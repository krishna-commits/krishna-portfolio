import { getAdminSocialLinks, parseMediumUsername } from 'lib/integration-settings'
import { getIntegrationStatsOverrides } from 'lib/integration-stats-config'

export type MediumStats = {
	totalReads: number
	totalPosts: number
	source: 'medium' | 'environment' | 'admin' | 'rss'
	fetchedAt: string
}

function parseIntEnv(key: string): number | null {
	const raw = process.env[key]
	if (!raw) return null
	const n = parseInt(raw, 10)
	return Number.isFinite(n) ? n : null
}

async function resolveMediumUsername(): Promise<string> {
	const links = await getAdminSocialLinks()
	return parseMediumUsername(links.medium || '')
}

async function fetchMediumPostCount(username: string): Promise<number> {
	const rssUrl = `https://medium.com/feed/@${username}`
	try {
		const response = await fetch(
			`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
			{ next: { revalidate: 3600 } },
		)
		if (!response.ok) return 0
		const data = await response.json()
		return Array.isArray(data.items) ? data.items.length : 0
	} catch {
		return 0
	}
}

export async function fetchMediumStats(): Promise<MediumStats> {
	const fetchedAt = new Date().toISOString()
	const overrides = await getIntegrationStatsOverrides()
	const mediumOverride = overrides.medium

	if (mediumOverride && mediumOverride.useLiveFetch === false) {
		return {
			totalReads: mediumOverride.totalReads ?? 0,
			totalPosts: mediumOverride.totalPosts ?? 0,
			source: 'admin',
			fetchedAt,
		}
	}

	const username = await resolveMediumUsername()
	const envReads = parseIntEnv('MEDIUM_TOTAL_READS')
	const envPosts = parseIntEnv('MEDIUM_TOTAL_POSTS')
	const rssPosts = mediumOverride?.useLiveFetch === false ? 0 : await fetchMediumPostCount(username)

	const adminReads = mediumOverride?.totalReads
	const adminPosts = mediumOverride?.totalPosts

	const totalPosts = adminPosts ?? envPosts ?? rssPosts
	const totalReads = adminReads ?? envReads ?? 0

	if (adminReads != null || (mediumOverride && mediumOverride.useLiveFetch === false)) {
		return { totalReads, totalPosts, source: 'admin', fetchedAt }
	}

	if (envReads != null) {
		return { totalReads, totalPosts, source: 'environment', fetchedAt }
	}

	return { totalReads, totalPosts, source: 'rss', fetchedAt }
}

export async function getMediumRssUsername(): Promise<string> {
	return resolveMediumUsername()
}
