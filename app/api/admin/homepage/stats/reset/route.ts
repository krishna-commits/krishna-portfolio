import { NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { DEFAULT_STATS_SETTINGS, STATS_SETTINGS_KEY } from 'lib/stats-config'
import { upsertSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson(STATS_SETTINGS_KEY, DEFAULT_STATS_SETTINGS)

		return NextResponse.json(
			{
				message: 'Stats section reset to defaults',
				stats: DEFAULT_STATS_SETTINGS,
			},
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset stats'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
