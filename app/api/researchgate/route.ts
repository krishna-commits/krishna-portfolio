import { NextResponse } from 'next/server'
import { fetchResearchGateStats } from 'lib/researchgate-stats'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
	try {
		const stats = await fetchResearchGateStats()

		return NextResponse.json({
			researchInterestScore: stats.researchInterestScore,
			citations: stats.citations,
			hIndex: stats.hIndex,
			recommendations: stats.recommendations,
			reads: stats.totalReads,
			totalReads: stats.totalReads,
			publicationReads: stats.publicationReads,
			fullTextReads: stats.fullTextReads,
			otherReads: stats.otherReads,
			questionReads: stats.questionReads,
			answerReads: stats.answerReads,
			lastUpdated: stats.fetchedAt,
		})
	} catch (error) {
		console.error('[ResearchGate API] Exception:', error)
		return NextResponse.json(
			{
				researchInterestScore: 0,
				citations: 0,
				hIndex: 0,
				recommendations: 0,
				reads: 0,
				totalReads: 0,
				publicationReads: 0,
				fullTextReads: 0,
				source: 'error',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 500 },
		)
	}
}
