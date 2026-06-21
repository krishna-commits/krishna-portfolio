import { siteConfig } from 'config/site'
import { prisma } from 'lib/prisma'
import { importRecommendationsFromConfigIfEmpty } from 'lib/migrate-config-section'

export type LinkedInRecommendationItem = {
	name: string
	title: string
	company?: string
	text: string
	date?: string
	linkedinUrl?: string
}

export type LinkedInRecommendationsResult = {
	recommendations: LinkedInRecommendationItem[]
	count: number
	profileUrl: string
	fetchedAt: string
}

function profileUrl(): string {
	return siteConfig.links.linkedIn || 'https://www.linkedin.com/in/krishna-neupane-50082091/'
}

function parseRecDate(date?: string): number {
	if (!date) return 0
	const parsed = Date.parse(date)
	return Number.isFinite(parsed) ? parsed : 0
}

function sortByDateDesc(items: LinkedInRecommendationItem[]): LinkedInRecommendationItem[] {
	return [...items].sort((a, b) => parseRecDate(b.date) - parseRecDate(a.date))
}

async function fromDatabase(): Promise<LinkedInRecommendationItem[] | null> {
	if (!prisma) return null

	try {
		const rows = await prisma.linkedInRecommendation.findMany({
			orderBy: { orderIndex: 'asc' },
		})
		if (rows.length === 0) return null

		return rows.map((rec) => ({
			name: rec.name,
			title: rec.title,
			company: rec.company || undefined,
			text: rec.text,
			date: rec.date,
			linkedinUrl: profileUrl(),
		}))
	} catch (error) {
		console.warn('[LinkedIn Recommendations] Database fetch failed:', error)
		return null
	}
}

function fromConfig(): LinkedInRecommendationItem[] {
	return (siteConfig.linkedin_recommendations || []).map((rec) => ({
		name: rec.name,
		title: rec.title,
		company: rec.company || undefined,
		text: rec.text,
		date: rec.date,
		linkedinUrl: profileUrl(),
	}))
}

/** Recommendations: database first, then config/site.tsx fallback. */
export async function fetchLinkedInRecommendations(): Promise<LinkedInRecommendationsResult> {
	const fetchedAt = new Date().toISOString()
	const url = profileUrl()

	let recommendations = sortByDateDesc((await fromDatabase()) ?? [])

	if (recommendations.length === 0) {
		await importRecommendationsFromConfigIfEmpty()
		recommendations = sortByDateDesc((await fromDatabase()) ?? [])
	}

	if (recommendations.length === 0) {
		recommendations = sortByDateDesc(fromConfig())
	}

	return {
		recommendations,
		count: recommendations.length,
		profileUrl: url,
		fetchedAt,
	}
}
