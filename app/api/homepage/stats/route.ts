import { DEFAULT_STATS_SETTINGS, mergeStatsSettings } from 'lib/stats-config'
import { getSiteSettingJson } from 'lib/site-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<typeof DEFAULT_STATS_SETTINGS> | null>('stats', null)
		const stats = mergeStatsSettings(stored)
		return publicJson({ stats })
	} catch (error: unknown) {
		console.error('[Stats Public API]', error)
		return publicJson({ stats: DEFAULT_STATS_SETTINGS })
	}
}
