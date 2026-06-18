import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_SECURITY_APPROACH,
	mergeSecurityApproach,
	type SecurityApproachConfig,
} from 'lib/security-approach-config'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<SecurityApproachConfig> | null>(
			'security_approach',
			null,
		)
		return NextResponse.json(mergeSecurityApproach(stored), { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch security approach'
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
    const stored = await getSiteSettingJson<Partial<SecurityApproachConfig> | null>(
      'security_approach',
      null,
    )
    const config = mergeSecurityApproach({ ...stored, ...body } as Partial<SecurityApproachConfig>)
		await upsertSiteSettingJson('security_approach', config)

		return NextResponse.json(
			{ message: 'Security approach updated successfully', data: config },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to update security approach'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson('security_approach', DEFAULT_SECURITY_APPROACH)
		return NextResponse.json(
			{ message: 'Reset to defaults', data: DEFAULT_SECURITY_APPROACH },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
