import { prisma } from 'lib/prisma'
import { decryptSecret, isSensitiveEnvKey } from 'lib/env-secrets'

/** Resolve env vars from process.env first, then admin-stored `env:*` settings. */
export async function getAnalyticsEnv(key: string): Promise<string | undefined> {
	const fromProcess = process.env[key]?.trim()
	if (fromProcess) return fromProcess

	if (!prisma) return undefined

	try {
		const setting = await prisma.siteSetting.findUnique({
			where: { key: `env:${key}` },
		})
		if (!setting?.value) return undefined

		const parsed = JSON.parse(setting.value) as {
			value?: string
			encrypted?: boolean
		}

		let value = parsed.value?.trim()
		if (!value) return undefined

		if (parsed.encrypted || isSensitiveEnvKey(key)) {
			value = decryptSecret(value)
		}

		return value || undefined
	} catch {
		return undefined
	}
}

export async function getCloudflareCredentials() {
	const zoneId = await getAnalyticsEnv('CLOUDFLARE_ZONE_ID')
	const apiToken = await getAnalyticsEnv('CLOUDFLARE_API_TOKEN')

	return {
		zoneId,
		apiToken,
		configured: Boolean(zoneId && apiToken),
	}
}

export async function getVercelCredentials() {
	const accessToken =
		(await getAnalyticsEnv('VERCEL_ACCESS_TOKEN')) ||
		(await getAnalyticsEnv('VERCEL_TOKEN'))
	const teamId =
		(await getAnalyticsEnv('VERCEL_TEAM_ID')) || process.env.VERCEL_TEAM_ID
	const projectId =
		(await getAnalyticsEnv('VERCEL_PROJECT_ID')) || process.env.VERCEL_PROJECT_ID
	const projectName =
		(await getAnalyticsEnv('VERCEL_PROJECT_NAME')) ||
		process.env.VERCEL_PROJECT_NAME ||
		'krishna-portfolio'
	const drainSecret = await getAnalyticsEnv('VERCEL_ANALYTICS_DRAIN_SECRET')

	return {
		accessToken,
		teamId,
		projectId,
		projectName,
		drainSecret,
		configured: Boolean(accessToken && teamId && projectId),
		drainConfigured: Boolean(drainSecret),
	}
}

export function getAnalyticsDashboardLinks(projectName = 'krishna-portfolio') {
	const teamSlug = process.env.VERCEL_TEAM_SLUG || ''
	const teamPath = teamSlug ? `${teamSlug}/` : ''
	const projectPath = `${teamPath}${projectName}`

	return {
		vercelAnalytics: `https://vercel.com/${projectPath}/analytics`,
		vercelSpeedInsights: `https://vercel.com/${projectPath}/speed-insights`,
		vercelObservability: `https://vercel.com/${projectPath}/observability`,
		vercelProject: `https://vercel.com/${projectPath}`,
		cloudflareAnalytics: 'https://dash.cloudflare.com/?to=/:account/analytics/traffic',
		cloudflareZone: 'https://dash.cloudflare.com/',
	}
}
