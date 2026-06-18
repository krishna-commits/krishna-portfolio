import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	CONTACT_PAGE_KEY,
	DEFAULT_CONTACT_PAGE,
	mergeContactPage,
	type ContactPageConfig,
} from 'lib/contact-page-config'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<ContactPageConfig> | null>(CONTACT_PAGE_KEY, null)
		return NextResponse.json({ contact: mergeContactPage(stored) }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch contact page'
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
		const contact = mergeContactPage(body.contact as Partial<ContactPageConfig>)
		await upsertSiteSettingJson(CONTACT_PAGE_KEY, contact)

		return NextResponse.json({ message: 'Contact page saved', contact }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to save contact page'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson(CONTACT_PAGE_KEY, DEFAULT_CONTACT_PAGE)
		return NextResponse.json({ message: 'Reset to defaults', contact: DEFAULT_CONTACT_PAGE }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
