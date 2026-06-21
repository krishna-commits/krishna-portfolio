import {
	DEFAULT_SITE_CHROME,
	SITE_CHROME_KEY,
	mergeSiteChrome,
} from 'lib/site-chrome-config'
import { getSiteSettingJson } from 'lib/site-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_SITE_CHROME | null>(
			SITE_CHROME_KEY,
			null,
		)
		return publicJson({ chrome: mergeSiteChrome(stored) })
	} catch (error: unknown) {
		console.error('[Site Chrome Public API]', error)
		return publicJson({ chrome: DEFAULT_SITE_CHROME })
	}
}
