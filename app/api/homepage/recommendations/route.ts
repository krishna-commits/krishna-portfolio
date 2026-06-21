import { fetchLinkedInRecommendations } from 'lib/linkedin-recommendations'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const data = await fetchLinkedInRecommendations()

		return publicJson({
			recommendations: data.recommendations,
			count: data.count,
			profileUrl: data.profileUrl,
			lastUpdated: data.fetchedAt,
		})
	} catch (error) {
		console.error('[Recommendations API] Error:', error)
		return publicJson(
			{
				recommendations: [],
				count: 0,
				profileUrl: '',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			500,
		)
	}
}
