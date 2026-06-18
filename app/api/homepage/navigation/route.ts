import { NextResponse } from 'next/server'
import {
	DEFAULT_NAVIGATION_CONFIG,
	NAVIGATION_CONFIG_KEY,
	mergeNavigationConfig,
} from 'lib/navigation-config'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_NAVIGATION_CONFIG | null>(
			NAVIGATION_CONFIG_KEY,
			null,
		)
		return NextResponse.json({ navigation: mergeNavigationConfig(stored) }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Navigation Public API]', error)
		return NextResponse.json({ navigation: DEFAULT_NAVIGATION_CONFIG }, { status: 200 })
	}
}
