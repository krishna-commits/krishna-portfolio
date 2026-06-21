import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { getVercelCredentials } from 'lib/analytics-env'
import { fetchVercelObservability, getVercelDrainAnalytics } from 'lib/vercel-analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const days = parseInt(searchParams.get('days') || '30', 10)
		const vercelCreds = await getVercelCredentials()

		const observability =
			vercelCreds.configured && vercelCreds.accessToken && vercelCreds.teamId && vercelCreds.projectId
				? await fetchVercelObservability(
						vercelCreds.accessToken,
						vercelCreds.teamId,
						vercelCreds.projectId,
						days,
					)
				: {
						ok: false,
						totalRequests: 0,
						daily: [],
						error: 'Vercel API credentials not configured',
						note: 'Set VERCEL_ACCESS_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID',
					}

		const webAnalytics = await getVercelDrainAnalytics(days)

		return NextResponse.json({
			configured: vercelCreds.configured,
			drainConfigured: vercelCreds.drainConfigured,
			projectName: vercelCreds.projectName,
			observability,
			webAnalytics,
		})
	} catch (error) {
		console.error('[Vercel Analytics API]', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch Vercel analytics' },
			{ status: 500 },
		)
	}
}
