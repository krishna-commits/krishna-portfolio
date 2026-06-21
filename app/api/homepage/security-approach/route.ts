import { getSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_SECURITY_APPROACH,
	mergeSecurityApproach,
	type SecurityApproachConfig,
} from 'lib/security-approach-config'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<SecurityApproachConfig> | null>(
			'security_approach',
			null,
		)
		const securityApproach = mergeSecurityApproach(stored)
		return publicJson({ securityApproach })
	} catch (error: unknown) {
		console.error('[Security Approach Public API]', error)
		return publicJson({ securityApproach: DEFAULT_SECURITY_APPROACH })
	}
}
