import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API_BASE = 'https://api.github.com'
const OWNER = 'krishna-commits'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
	try {
		const token = process.env.GITHUB_ACCESS_TOKEN

		// If token is not set, use unauthenticated API (rate limited to 60/hour)
		if (!token) {
			console.warn('[GitHub API] GITHUB_ACCESS_TOKEN not set, using unauthenticated API (rate limited)')
			const response = await fetch(`${GITHUB_API_BASE}/users/${OWNER}/repos?sort=created&direction=desc&per_page=100`, {
				headers: {
					'Accept': 'application/vnd.github+json',
					'X-GitHub-Api-Version': '2022-11-28',
				},
				next: { revalidate: 300 }, // Cache for 5 minutes
			})

			if (!response.ok) {
				console.error(`[GitHub API] Error ${response.status}: ${response.statusText}`)
				return NextResponse.json({ error: 'Failed to fetch repositories', repos: [] }, { status: response.status })
			}

			const repos = await response.json()
			return NextResponse.json({ repos: Array.isArray(repos) ? repos : [] })
		}

		// Use authenticated API with token (higher rate limit: 5,000/hour)
		console.log(`[GitHub API] Using authenticated API for user: ${OWNER}`)
		
		const response = await fetch(`${GITHUB_API_BASE}/users/${OWNER}/repos?sort=created&direction=desc&per_page=100`, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
			},
			next: { revalidate: 60 }, // Cache for 1 minute
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`[GitHub API] Error ${response.status}: ${response.statusText}`, errorText)
			return NextResponse.json(
				{ 
					error: `Failed to fetch repositories: ${response.statusText}`,
					repos: [] 
				}, 
				{ status: response.status }
			)
		}

		const repos = await response.json()
		console.log(`[GitHub API] Successfully fetched ${Array.isArray(repos) ? repos.length : 0} repositories`)
		
		return NextResponse.json({ 
			repos: Array.isArray(repos) ? repos : [],
			authenticated: true,
		})
	} catch (error) {
		console.error('[GitHub API] Exception fetching repositories:', error)
		return NextResponse.json(
			{ 
				error: 'Internal server error',
				errorMessage: error instanceof Error ? error.message : 'Unknown error',
				repos: [] 
			},
			{ status: 500 }
		)
	}
}

