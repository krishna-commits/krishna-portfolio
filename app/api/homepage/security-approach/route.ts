import { NextResponse } from 'next/server'
import { getSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_SECURITY_APPROACH,
	mergeSecurityApproach,
	type SecurityApproachConfig,
} from 'lib/security-approach-config'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<SecurityApproachConfig> | null>(
			'security_approach',
			null,
		)
		const securityApproach = mergeSecurityApproach(stored)
		return NextResponse.json({ securityApproach }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Security Approach Public API]', error)
		return NextResponse.json({ securityApproach: DEFAULT_SECURITY_APPROACH }, { status: 200 })
	}
}
