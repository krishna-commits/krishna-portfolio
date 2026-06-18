import { NextResponse } from 'next/server'
import {
	DEFAULT_SITE_CHROME,
	SITE_CHROME_KEY,
	mergeSiteChrome,
} from 'lib/site-chrome-config'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_SITE_CHROME | null>(
			SITE_CHROME_KEY,
			null,
		)
		return NextResponse.json({ chrome: mergeSiteChrome(stored) }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Site Chrome Public API]', error)
		return NextResponse.json({ chrome: DEFAULT_SITE_CHROME }, { status: 200 })
	}
}
