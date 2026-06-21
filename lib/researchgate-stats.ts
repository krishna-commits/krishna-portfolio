import { siteConfig } from 'config/site'
import {
	getAdminSocialLinks,
	parseResearchGateSlug,
} from 'lib/integration-settings'
import { getIntegrationStatsOverrides } from 'lib/integration-stats-config'

export type ResearchGateStats = {
	researchInterestScore: number
	citations: number
	hIndex: number
	recommendations: number
	totalReads: number
	publicationReads: number
	fullTextReads: number
	otherReads: number
	questionReads: number
	answerReads: number
	source: 'researchgate' | 'environment' | 'admin' | 'fallback'
	profileUrl: string
	fetchedAt: string
}

const DEFAULT_PROFILE_SLUG = 'Krishna-Neupane'

function parseIntEnv(key: string, fallback = 0): number {
	const raw = process.env[key]
	if (!raw) return fallback
	const n = parseInt(raw, 10)
	return Number.isFinite(n) ? n : fallback
}

function parseFloatEnv(key: string, fallback = 0): number {
	const raw = process.env[key]
	if (!raw) return fallback
	const n = parseFloat(raw)
	return Number.isFinite(n) ? n : fallback
}

async function resolveProfileUrl(): Promise<{ profileUrl: string; statsUrl: string }> {
	const links = await getAdminSocialLinks()
	const profileUrl = links.researchgate || siteConfig.links.researchgate || `https://www.researchgate.net/profile/${DEFAULT_PROFILE_SLUG}`
	const slug = parseResearchGateSlug(profileUrl) || DEFAULT_PROFILE_SLUG
	return {
		profileUrl,
		statsUrl: `https://www.researchgate.net/profile/${slug}/stats`,
	}
}

function statsFromEnv(): Omit<ResearchGateStats, 'source' | 'profileUrl' | 'fetchedAt'> | null {
	const totalReads = parseIntEnv('RESEARCHGATE_TOTAL_READS') || parseIntEnv('RESEARCHGATE_READS')
	const publicationReads = parseIntEnv('RESEARCHGATE_PUBLICATION_READS')
	const fullTextReads = parseIntEnv('RESEARCHGATE_FULLTEXT_READS')
	const researchInterestScore = parseFloatEnv('RESEARCHGATE_RESEARCH_INTEREST_SCORE')
	const citations = parseIntEnv('RESEARCHGATE_CITATIONS')
	const hIndex = parseIntEnv('RESEARCHGATE_H_INDEX')

	if (
		!totalReads &&
		!publicationReads &&
		!fullTextReads &&
		!researchInterestScore &&
		!citations &&
		!hIndex
	) {
		return null
	}

	return {
		researchInterestScore,
		citations,
		hIndex,
		recommendations: parseIntEnv('RESEARCHGATE_RECOMMENDATIONS'),
		totalReads: totalReads || publicationReads + fullTextReads,
		publicationReads,
		fullTextReads,
		otherReads: parseIntEnv('RESEARCHGATE_OTHER_READS'),
		questionReads: parseIntEnv('RESEARCHGATE_QUESTION_READS'),
		answerReads: parseIntEnv('RESEARCHGATE_ANSWER_READS'),
	}
}

function statsFromAdminOverride(
	override: NonNullable<Awaited<ReturnType<typeof getIntegrationStatsOverrides>>['researchgate']>,
): Omit<ResearchGateStats, 'source' | 'profileUrl' | 'fetchedAt'> {
	return {
		researchInterestScore: override.researchInterestScore ?? 0,
		citations: override.citations ?? 0,
		hIndex: override.hIndex ?? 0,
		recommendations: override.recommendations ?? 0,
		totalReads: override.totalReads ?? 0,
		publicationReads: override.publicationReads ?? 0,
		fullTextReads: override.fullTextReads ?? 0,
		otherReads: 0,
		questionReads: 0,
		answerReads: 0,
	}
}

function extractStat(html: string, patterns: RegExp[]): number | null {
	for (const pattern of patterns) {
		const match = html.match(pattern)
		if (match?.[1]) {
			const n = parseInt(match[1].replace(/,/g, ''), 10)
			if (Number.isFinite(n)) return n
		}
	}
	return null
}

async function tryScrapeResearchGateStats(
	statsUrl: string,
): Promise<Omit<ResearchGateStats, 'source' | 'profileUrl' | 'fetchedAt'> | null> {
	try {
		const response = await fetch(statsUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; KrishnaPortfolio/1.0)',
				Accept: 'text/html,application/xhtml+xml',
			},
			next: { revalidate: 3600 },
			signal: AbortSignal.timeout(8000),
		})

		if (!response.ok) return null

		const html = await response.text()

		const totalReads = extractStat(html, [
			/"totalReads"\s*:\s*(\d+)/i,
			/Total reads[^0-9]*([\d,]+)/i,
			/data-testid="total-reads"[^>]*>[\s\S]*?([\d,]+)/i,
		])
		const publicationReads = extractStat(html, [
			/"publicationReads"\s*:\s*(\d+)/i,
			/Publication reads[^0-9]*([\d,]+)/i,
		])
		const fullTextReads = extractStat(html, [
			/"fullTextReads"\s*:\s*(\d+)/i,
			/Full-text reads[^0-9]*([\d,]+)/i,
		])
		const citations = extractStat(html, [
			/"citations"\s*:\s*(\d+)/i,
			/Citations[^0-9]*([\d,]+)/i,
		])

		if (!totalReads && !publicationReads && !fullTextReads) {
			return null
		}

		return {
			researchInterestScore: parseFloatEnv('RESEARCHGATE_RESEARCH_INTEREST_SCORE'),
			citations: citations ?? parseIntEnv('RESEARCHGATE_CITATIONS'),
			hIndex: parseIntEnv('RESEARCHGATE_H_INDEX'),
			recommendations: parseIntEnv('RESEARCHGATE_RECOMMENDATIONS'),
			totalReads: totalReads ?? (publicationReads ?? 0) + (fullTextReads ?? 0),
			publicationReads: publicationReads ?? 0,
			fullTextReads: fullTextReads ?? 0,
			otherReads: parseIntEnv('RESEARCHGATE_OTHER_READS'),
			questionReads: parseIntEnv('RESEARCHGATE_QUESTION_READS'),
			answerReads: parseIntEnv('RESEARCHGATE_ANSWER_READS'),
		}
	} catch (error) {
		console.warn('[ResearchGate Stats] Scrape failed:', error)
		return null
	}
}

export async function fetchResearchGateStats(): Promise<ResearchGateStats> {
	const fetchedAt = new Date().toISOString()
	const { profileUrl, statsUrl } = await resolveProfileUrl()
	const overrides = await getIntegrationStatsOverrides()

	if (overrides.researchgate && overrides.researchgate.useLiveFetch === false) {
		return {
			...statsFromAdminOverride(overrides.researchgate),
			source: 'admin',
			profileUrl,
			fetchedAt,
		}
	}

	const scraped = await tryScrapeResearchGateStats(statsUrl)
	if (
		scraped &&
		(scraped.totalReads > 0 || scraped.citations > 0 || scraped.researchInterestScore > 0)
	) {
		return { ...scraped, source: 'researchgate', profileUrl, fetchedAt }
	}

	const fromEnv = statsFromEnv()
	if (fromEnv) {
		return { ...fromEnv, source: 'environment', profileUrl, fetchedAt }
	}

	if (overrides.researchgate) {
		return {
			...statsFromAdminOverride(overrides.researchgate),
			source: 'admin',
			profileUrl,
			fetchedAt,
		}
	}

	return {
		researchInterestScore: 38.2,
		citations: 6,
		hIndex: 2,
		recommendations: 19,
		totalReads: 5145,
		publicationReads: 0,
		fullTextReads: 0,
		otherReads: 0,
		questionReads: 0,
		answerReads: 0,
		source: 'fallback',
		profileUrl,
		fetchedAt,
	}
}
