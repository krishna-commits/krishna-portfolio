import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { getCloudflareCredentials } from 'lib/analytics-env'
import { fetchCloudflareAnalytics } from 'lib/cloudflare-analytics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const days = parseInt(searchParams.get('days') || '30', 10)
		const { zoneId, apiToken, configured } = await getCloudflareCredentials()

		if (!configured || !zoneId || !apiToken) {
			return NextResponse.json(
				{
					error: 'Cloudflare credentials not configured',
					message:
						'Set CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN in Vercel env or Admin → Environment Variables, then redeploy.',
				},
				{ status: 400 },
			)
		}

		const data = await fetchCloudflareAnalytics(zoneId, apiToken, days)
		return NextResponse.json(data, { status: 200 })
	} catch (error) {
		console.error('[Cloudflare Analytics API]', error)
		return NextResponse.json(
			{
				error: 'Failed to fetch Cloudflare analytics',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
