import { NextRequest, NextResponse } from 'next/server'
import { fetchAllGitHubRepos, GITHUB_OWNER } from 'lib/github-stats'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export async function GET(_request: NextRequest) {
	try {
		const token = process.env.GITHUB_ACCESS_TOKEN
		if (!token) {
			console.warn('[GitHub API] GITHUB_ACCESS_TOKEN not set, using unauthenticated API (rate limited)')
		} else {
			console.log(`[GitHub API] Using authenticated API for user: ${GITHUB_OWNER}`)
		}

		const repos = await fetchAllGitHubRepos(token)
		console.log(`[GitHub API] Successfully fetched ${repos.length} repositories`)

		return NextResponse.json({
			repos,
			authenticated: Boolean(token),
		})
	} catch (error) {
		console.error('[GitHub API] Exception fetching repositories:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				errorMessage: error instanceof Error ? error.message : 'Unknown error',
				repos: [],
			},
			{ status: 500 },
		)
	}
}
