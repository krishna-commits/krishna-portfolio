import { siteConfig } from 'config/site'

export type MediumStats = {
	totalReads: number
	totalPosts: number
	source: 'medium' | 'environment' | 'rss'
	fetchedAt: string
}

function parseIntEnv(key: string): number | null {
	const raw = process.env[key]
	if (!raw) return null
	const n = parseInt(raw, 10)
	return Number.isFinite(n) ? n : null
}

function mediumUsername(): string {
	return siteConfig.links.medium.split('@').pop()?.split('/')[0] || 'neupane.krishna33'
}

async function fetchMediumPostCount(): Promise<number> {
	const rssUrl = `https://medium.com/feed/@${mediumUsername()}`
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
	const envReads = parseIntEnv('MEDIUM_TOTAL_READS')
	const envPosts = parseIntEnv('MEDIUM_TOTAL_POSTS')
	const rssPosts = await fetchMediumPostCount()
	const totalPosts = envPosts ?? rssPosts

	if (envReads != null) {
		return {
			totalReads: envReads,
			totalPosts,
			source: 'environment',
			fetchedAt,
		}
	}

	return {
		totalReads: 0,
		totalPosts,
		source: 'rss',
		fetchedAt,
	}
}
