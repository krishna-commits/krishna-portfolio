import { NextResponse } from 'next/server'
import { fetchGitHubStats } from 'lib/github-stats'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export async function GET() {
	try {
		const token = process.env.GITHUB_ACCESS_TOKEN
		const stats = await fetchGitHubStats(token)

		return NextResponse.json({
			...stats,
			authenticated: Boolean(token),
		})
	} catch (error) {
		console.error('[GitHub Stats API]', error)
		return NextResponse.json(
			{
				error: 'Failed to fetch GitHub stats',
				publicRepos: 0,
				totalStars: 0,
				totalForks: 0,
				languageCount: 0,
				languages: [],
				source: 'github',
			},
			{ status: 500 },
		)
	}
}
