import { NextResponse } from 'next/server'
import { fetchMediumStats } from 'lib/medium-stats'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
	try {
		const stats = await fetchMediumStats()

		return NextResponse.json({
			totalReads: stats.totalReads,
			totalPosts: stats.totalPosts,
			lastUpdated: stats.fetchedAt,
			...(stats.totalReads === 0 && stats.source === 'rss'
				? {
						message:
							'Set MEDIUM_TOTAL_READS in environment variables for live Medium read counts.',
					}
				: {}),
		})
	} catch (error) {
		console.error('[Medium Stats API] Exception:', error)
		return NextResponse.json(
			{
				totalReads: 0,
				totalPosts: 0,
				source: 'error',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 500 },
		)
	}
}
