'use client'

import useSWR from 'swr'
import {
	DEFAULT_SITE_CHROME,
	mergeSiteChrome,
	type SiteChromeConfig,
} from 'lib/site-chrome-config'
import { homepageFetcher, homepageSwrOptions } from 'lib/hooks/use-homepage-api'

export function useSiteChrome() {
	const { data, isLoading, mutate } = useSWR<{ chrome?: Partial<SiteChromeConfig> }>(
		'/api/homepage/site-chrome',
		homepageFetcher,
		homepageSwrOptions,
	)

	return {
		chrome: mergeSiteChrome(data?.chrome),
		isLoading,
		mutate,
		defaults: DEFAULT_SITE_CHROME,
	}
}
