import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	getIntegrationStatsOverrides,
	saveIntegrationStatsOverrides,
	mergeIntegrationStatsOverrides,
	type IntegrationStatsOverrides,
} from 'lib/integration-stats-config'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const overrides = await getIntegrationStatsOverrides()
		return NextResponse.json({ integrations: mergeIntegrationStatsOverrides(overrides) })
	} catch (error: unknown) {
		console.error('[Integrations Admin API]', error)
		return NextResponse.json({ error: 'Failed to load integration settings' }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = (await request.json()) as IntegrationStatsOverrides
		await saveIntegrationStatsOverrides(mergeIntegrationStatsOverrides(body))
		return NextResponse.json({ message: 'Integration settings saved' })
	} catch (error: unknown) {
		console.error('[Integrations Admin API]', error)
		return NextResponse.json({ error: 'Failed to save integration settings' }, { status: 500 })
	}
}
