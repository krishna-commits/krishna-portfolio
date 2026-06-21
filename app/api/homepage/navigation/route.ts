import {
	DEFAULT_NAVIGATION_CONFIG,
	NAVIGATION_CONFIG_KEY,
	mergeNavigationConfig,
} from 'lib/navigation-config'
import { getSiteSettingJson } from 'lib/site-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_NAVIGATION_CONFIG | null>(
			NAVIGATION_CONFIG_KEY,
			null,
		)
		return publicJson({ navigation: mergeNavigationConfig(stored) })
	} catch (error: unknown) {
		console.error('[Navigation Public API]', error)
		return publicJson({ navigation: DEFAULT_NAVIGATION_CONFIG })
	}
}
