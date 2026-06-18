'use client'

import useSWR from 'swr'
import {
	DEFAULT_CONTACT_PAGE,
	mergeContactPage,
	type ContactPageConfig,
} from 'lib/contact-page-config'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useContactPage() {
	const { data, isLoading, mutate } = useSWR<{ contact?: Partial<ContactPageConfig> }>(
		'/api/homepage/contact',
		fetcher,
		{ revalidateOnFocus: true },
	)

	return {
		contact: mergeContactPage(data?.contact),
		isLoading,
		mutate,
		defaults: DEFAULT_CONTACT_PAGE,
	}
}
