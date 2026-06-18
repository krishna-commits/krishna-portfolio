import { NextResponse } from 'next/server'
import {
	DEFAULT_RESEARCH_CORE_CONFIG,
	RESEARCH_CORE_CONFIG_KEY,
	mergeResearchCoreConfig,
} from 'lib/research-core-config'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_RESEARCH_CORE_CONFIG | null>(
			RESEARCH_CORE_CONFIG_KEY,
			null,
		)
		const config = mergeResearchCoreConfig(stored)
		return NextResponse.json({ config }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Research Core Config API]', error)
		return NextResponse.json({ config: DEFAULT_RESEARCH_CORE_CONFIG }, { status: 200 })
	}
}
