'use client'

import useSWR from 'swr'
import {
	DEFAULT_CONTACT_PAGE,
	mergeContactPage,
	type ContactPageConfig,
} from 'lib/contact-page-config'
import { homepageFetcher, homepageSwrOptions } from 'lib/hooks/use-homepage-api'

export function useContactPage() {
	const { data, isLoading, mutate } = useSWR<{ contact?: Partial<ContactPageConfig> }>(
		'/api/homepage/contact',
		homepageFetcher,
		homepageSwrOptions,
	)

	return {
		contact: mergeContactPage(data?.contact),
		isLoading,
		mutate,
		defaults: DEFAULT_CONTACT_PAGE,
	}
}
