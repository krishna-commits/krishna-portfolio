import { NextResponse } from 'next/server'
import {
	CONTACT_PAGE_KEY,
	DEFAULT_CONTACT_PAGE,
	mergeContactPage,
} from 'lib/contact-page-config'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_CONTACT_PAGE | null>(
			CONTACT_PAGE_KEY,
			null,
		)
		return NextResponse.json({ contact: mergeContactPage(stored) }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Contact Page Public API]', error)
		return NextResponse.json({ contact: DEFAULT_CONTACT_PAGE }, { status: 200 })
	}
}
