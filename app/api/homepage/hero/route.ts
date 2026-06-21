import { NextResponse } from 'next/server'
import { DEFAULT_HERO_DATA, mergeHeroData } from 'lib/hero-config'
import { getSiteSettingJson } from 'lib/site-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<typeof DEFAULT_HERO_DATA | null>('hero', null)
		const hero = mergeHeroData(stored)
		return publicJson({ hero })
	} catch (error: unknown) {
		console.error('[Hero Public API]', error)
		return publicJson({ hero: DEFAULT_HERO_DATA })
	}
}
