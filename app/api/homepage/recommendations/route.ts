import { NextResponse } from 'next/server'
import { fetchLinkedInRecommendations } from 'lib/linkedin-recommendations'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
	try {
		const data = await fetchLinkedInRecommendations()

		return NextResponse.json({
			recommendations: data.recommendations,
			count: data.count,
			profileUrl: data.profileUrl,
			lastUpdated: data.fetchedAt,
		})
	} catch (error) {
		console.error('[Recommendations API] Error:', error)
		return NextResponse.json(
			{
				recommendations: [],
				count: 0,
				profileUrl: '',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 500 },
		)
	}
}
