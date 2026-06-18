import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	DEFAULT_SITE_CHROME,
	SITE_CHROME_KEY,
	mergeSiteChrome,
	type SiteChromeConfig,
} from 'lib/site-chrome-config'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<SiteChromeConfig> | null>(SITE_CHROME_KEY, null)
		return NextResponse.json({ chrome: mergeSiteChrome(stored) }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch site chrome'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const chrome = mergeSiteChrome(body.chrome as Partial<SiteChromeConfig>)
		await upsertSiteSettingJson(SITE_CHROME_KEY, chrome)

		return NextResponse.json({ message: 'Site chrome saved', chrome }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to save site chrome'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson(SITE_CHROME_KEY, DEFAULT_SITE_CHROME)
		return NextResponse.json({ message: 'Reset to defaults', chrome: DEFAULT_SITE_CHROME }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
