'use client'

import useSWR from 'swr'
import {
	DEFAULT_SITE_CHROME,
	mergeSiteChrome,
	type SiteChromeConfig,
} from 'lib/site-chrome-config'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSiteChrome() {
	const { data, isLoading, mutate } = useSWR<{ chrome?: Partial<SiteChromeConfig> }>(
		'/api/homepage/site-chrome',
		fetcher,
		{ revalidateOnFocus: true },
	)

	return {
		chrome: mergeSiteChrome(data?.chrome),
		isLoading,
		mutate,
		defaults: DEFAULT_SITE_CHROME,
	}
}
