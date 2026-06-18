import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { DEFAULT_HERO_DATA, mergeHeroData, type HeroData } from 'lib/hero-config'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'
import { siteConfig } from 'config/site'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<HeroData> | null>('hero', null)
		const hero = mergeHeroData(stored)
		const source = stored ? 'database' : 'defaults'

		return NextResponse.json({ ...hero, _source: source }, { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch hero settings'
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
    const stored = await getSiteSettingJson<Partial<HeroData> | null>('hero', null)
    const hero = mergeHeroData({ ...stored, ...body } as Partial<HeroData>)

		if (!hero.name || !hero.bio || !hero.title || !hero.description) {
			return NextResponse.json(
				{ error: 'Missing required fields: name, bio, title, description' },
				{ status: 400 },
			)
		}

		if (!hero.profileImage) {
			hero.profileImage =
				siteConfig.profile_image ||
				'https://yqymybxe5e8jynd2.public.blob.vercel-storage.com/public/photo.JPG'
		}

		await upsertSiteSettingJson('hero', hero)

		return NextResponse.json(
			{ message: 'Hero settings updated successfully', data: hero },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to update hero settings'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
