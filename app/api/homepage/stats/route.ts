import { NextResponse } from 'next/server'
import { DEFAULT_STATS_SETTINGS, mergeStatsSettings } from 'lib/stats-config'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<typeof DEFAULT_STATS_SETTINGS> | null>('stats', null)
		const stats = mergeStatsSettings(stored)
		return NextResponse.json({ stats }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Stats Public API]', error)
		return NextResponse.json({ stats: DEFAULT_STATS_SETTINGS }, { status: 200 })
	}
}
