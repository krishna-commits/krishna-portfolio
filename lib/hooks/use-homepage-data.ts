'use client'

import useSWR from 'swr'
import { siteConfig } from 'config/site'
import { DEFAULT_HERO_DATA, mergeHeroData, type HeroData } from 'lib/hero-config'
import { homepageFetcher, homepageSwrOptions } from 'lib/hooks/use-homepage-api'

export function useHero() {
	const { data, error, isLoading, mutate } = useSWR<{ hero?: Partial<HeroData> }>(
		'/api/homepage/hero',
		homepageFetcher,
		{ ...homepageSwrOptions, revalidateOnFocus: true },
	)

	const hero = mergeHeroData(data?.hero)

	return { hero, isLoading, error, mutate, defaults: DEFAULT_HERO_DATA }
}

export function useSocialLinks() {
	const { data, error, isLoading, mutate } = useSWR<{ links?: Record<string, string> }>(
		'/api/homepage/social',
		homepageFetcher,
		homepageSwrOptions,
	)

	const links = {
		github: data?.links?.github || siteConfig.links.github,
		linkedIn: data?.links?.linkedIn || siteConfig.links.linkedIn,
		researchgate: data?.links?.researchgate || siteConfig.links.researchgate,
		orcid: data?.links?.orcid || siteConfig.links.orcid,
		medium: data?.links?.medium || siteConfig.links.medium,
		instagram: data?.links?.instagram || siteConfig.links.instagram,
		twitter: data?.links?.twitter || '',
		email: data?.links?.email || siteConfig.copyright?.email || '',
	}

	return { links, isLoading, error, mutate }
}
