import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	DEFAULT_NAVIGATION_CONFIG,
	NAVIGATION_CONFIG_KEY,
	mergeNavigationConfig,
	type NavigationConfig,
} from 'lib/navigation-config'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<NavigationConfig> | null>(
			NAVIGATION_CONFIG_KEY,
			null,
		)
		return NextResponse.json({ navigation: mergeNavigationConfig(stored) }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch navigation'
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
		const navigation = mergeNavigationConfig(body.navigation as Partial<NavigationConfig>)
		await upsertSiteSettingJson(NAVIGATION_CONFIG_KEY, navigation)

		return NextResponse.json({ message: 'Navigation saved', navigation }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to save navigation'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson(NAVIGATION_CONFIG_KEY, DEFAULT_NAVIGATION_CONFIG)
		return NextResponse.json(
			{ message: 'Reset to defaults', navigation: DEFAULT_NAVIGATION_CONFIG },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
