import { NextResponse } from 'next/server'
import { siteConfig } from 'config/site'
import { getSiteSettingJson } from 'lib/site-settings'
import { getSocialLinksFromConfig } from 'lib/homepage-data'

export const dynamic = 'force-dynamic'

type SocialLinksData = {
	github?: string
	linkedIn?: string
	researchgate?: string
	orcid?: string
	medium?: string
	twitter?: string
	email?: string
	instagram?: string
}

export async function GET() {
	try {
		const stored = await getSiteSettingJson<SocialLinksData | null>('social_links', null)
		const fallback = getSocialLinksFromConfig()

		const links = {
			github: stored?.github || fallback.github || '',
			linkedIn: stored?.linkedIn || fallback.linkedIn || '',
			researchgate: stored?.researchgate || fallback.researchgate || '',
			orcid: stored?.orcid || fallback.orcid || '',
			medium: stored?.medium || fallback.medium || '',
			twitter: stored?.twitter || '',
			email: stored?.email || siteConfig.copyright?.email || '',
			instagram: stored?.instagram || fallback.instagram || '',
		}

		return NextResponse.json({ links }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Social Links Public API]', error)
		const fallback = getSocialLinksFromConfig()
		return NextResponse.json({ links: { ...fallback } }, { status: 200 })
	}
}
