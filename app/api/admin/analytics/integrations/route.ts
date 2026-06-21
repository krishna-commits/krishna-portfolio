import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	getCloudflareCredentials,
	getVercelCredentials,
	getAnalyticsDashboardLinks,
} from 'lib/analytics-env'
import { fetchCloudflareAnalytics } from 'lib/cloudflare-analytics'
import { fetchVercelObservability, getVercelDrainAnalytics } from 'lib/vercel-analytics'
import { siteConfig } from 'config/site'
import { prisma } from 'lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const days = parseInt(searchParams.get('days') || '30', 10)

		const cloudflareCreds = await getCloudflareCredentials()
		const vercelCreds = await getVercelCredentials()
		const links = getAnalyticsDashboardLinks(vercelCreds.projectName)

		let cloudflare: Awaited<ReturnType<typeof fetchCloudflareAnalytics>> | null = null
		let cloudflareError: string | null = null

		if (cloudflareCreds.configured && cloudflareCreds.zoneId && cloudflareCreds.apiToken) {
			try {
				cloudflare = await fetchCloudflareAnalytics(
					cloudflareCreds.zoneId,
					cloudflareCreds.apiToken,
					days,
				)
			} catch (error) {
				cloudflareError = error instanceof Error ? error.message : 'Cloudflare fetch failed'
			}
		}

		const vercelObservability =
			vercelCreds.configured && vercelCreds.accessToken && vercelCreds.teamId && vercelCreds.projectId
				? await fetchVercelObservability(
						vercelCreds.accessToken,
						vercelCreds.teamId,
						vercelCreds.projectId,
						days,
					)
				: {
						ok: false,
						totalRequests: 0,
						daily: [],
						note: 'Set VERCEL_ACCESS_TOKEN, VERCEL_TEAM_ID, and VERCEL_PROJECT_ID in Vercel env (or Admin → Environment Variables)',
					}

		const vercelWebAnalytics = await getVercelDrainAnalytics(days)

		let localAnalytics = {
			pageViews: 0,
			uniqueVisitors: 0,
			configured: Boolean(prisma),
		}

		if (prisma) {
			const startDate = new Date()
			startDate.setDate(startDate.getDate() - days)

			const [pageViews, visitors] = await Promise.all([
				prisma.pageView.count({ where: { createdAt: { gte: startDate } } }),
				prisma.visitor.findMany({
					where: { createdAt: { gte: startDate } },
					select: { sessionId: true },
				}),
			])

			localAnalytics = {
				pageViews,
				uniqueVisitors: new Set(visitors.map((v: { sessionId: string }) => v.sessionId)).size,
				configured: true,
			}
		}

		return NextResponse.json({
			period: { days },
			config: {
				cloudflare: {
					configured: cloudflareCreds.configured,
					zoneIdSet: Boolean(cloudflareCreds.zoneId),
					tokenSet: Boolean(cloudflareCreds.apiToken),
				},
				vercel: {
					accessTokenSet: Boolean(vercelCreds.accessToken),
					teamIdSet: Boolean(vercelCreds.teamId),
					projectIdSet: Boolean(vercelCreds.projectId),
					observabilityConfigured: vercelCreds.configured,
					drainSecretSet: vercelCreds.drainConfigured,
				},
				database: { configured: Boolean(prisma) },
			},
			cloudflare: cloudflare
				? { ok: true, ...cloudflare }
				: {
						ok: false,
						error:
							cloudflareError ||
							'Set CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN (Vercel env or Admin → Environment Variables)',
					},
			vercel: {
				observability: vercelObservability,
				webAnalytics: vercelWebAnalytics,
			},
			local: localAnalytics,
			links,
			setup: {
				cloudflare: [
					'Cloudflare Dashboard → your domain → Overview → copy Zone ID',
					'API Token with Zone → Analytics → Read',
					'Add CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN to Vercel env, redeploy',
					'Domain must be proxied (orange cloud) through Cloudflare for traffic metrics',
				],
				vercelObservability: [
					'Create token at vercel.com/account/tokens with Observability read scope',
					'Set VERCEL_ACCESS_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID',
					'Observability metrics may require Observability Plus on your Vercel plan',
				],
				vercelWebAnalytics: [
					'Enable Web Analytics on your Vercel project',
					'Project → Drains → Add Web Analytics Drain',
					`Endpoint: ${siteConfig.url.replace(/\/$/, '')}/api/analytics/drain/vercel`,
					'Set VERCEL_ANALYTICS_DRAIN_SECRET and add the same value as Authorization: Bearer <secret> on the drain',
				],
			},
		})
	} catch (error) {
		console.error('[Analytics Integrations API]', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to load integrations' },
			{ status: 500 },
		)
	}
}
