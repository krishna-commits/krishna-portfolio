import {
	CONTACT_PAGE_KEY,
	DEFAULT_CONTACT_PAGE,
	mergeContactPage,
} from 'lib/contact-page-config'
import { getSiteSettingJson } from 'lib/site-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_CONTACT_PAGE | null>(
			CONTACT_PAGE_KEY,
			null,
		)
		return publicJson({ contact: mergeContactPage(stored) })
	} catch (error: unknown) {
		console.error('[Contact Page Public API]', error)
		return publicJson({ contact: DEFAULT_CONTACT_PAGE })
	}
}
