import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import {
	DEFAULT_RESEARCH_CORE_CONFIG,
	RESEARCH_CORE_CONFIG_KEY,
	mergeResearchCoreConfig,
	type ResearchCoreConfig,
} from 'lib/research-core-config'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<ResearchCoreConfig | null>(
			RESEARCH_CORE_CONFIG_KEY,
			null,
		)
		const config = mergeResearchCoreConfig(stored)
		const source = stored ? 'database' : 'defaults'

		return NextResponse.json({ config, source }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch config'
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
		const config = mergeResearchCoreConfig(body.config as Partial<ResearchCoreConfig>)

		await upsertSiteSettingJson(RESEARCH_CORE_CONFIG_KEY, config)

		return NextResponse.json(
			{ message: 'Research Core settings saved', config },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to save config'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson(RESEARCH_CORE_CONFIG_KEY, DEFAULT_RESEARCH_CORE_CONFIG)
		return NextResponse.json(
			{ message: 'Reset to defaults', config: DEFAULT_RESEARCH_CORE_CONFIG },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset config'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
