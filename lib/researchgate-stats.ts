import { siteConfig } from 'config/site'

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
	source: 'researchgate' | 'environment' | 'fallback'
	profileUrl: string
	fetchedAt: string
}

const PROFILE_SLUG = 'Krishna-Neupane'
const PROFILE_URL = `https://www.researchgate.net/profile/${PROFILE_SLUG}`
const STATS_URL = `${PROFILE_URL}/stats`

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

async function tryScrapeResearchGateStats(): Promise<Omit<ResearchGateStats, 'source' | 'profileUrl' | 'fetchedAt'> | null> {
	try {
		const response = await fetch(STATS_URL, {
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
	const profileUrl = siteConfig.links.researchgate || PROFILE_URL

	const scraped = await tryScrapeResearchGateStats()
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

	// Documented fallbacks from public profile (update via env when stats change)
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
