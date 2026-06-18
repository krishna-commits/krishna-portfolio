'use client'

import useSWR from 'swr'
import {
	DEFAULT_NAVIGATION_CONFIG,
	mergeNavigationConfig,
	type NavigationConfig,
} from 'lib/navigation-config'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useNavigationConfig() {
	const { data, isLoading, mutate } = useSWR<{ navigation?: Partial<NavigationConfig> }>(
		'/api/homepage/navigation',
		fetcher,
		{ revalidateOnFocus: true },
	)

	const navigation = mergeNavigationConfig(data?.navigation)

	return {
		navigation,
		desktopItems: navigation.items.filter((i) => i.enabled && i.showInDesktop),
		mobileItems: navigation.items.filter((i) => i.enabled && i.showInMobile),
		isLoading,
		mutate,
		defaults: DEFAULT_NAVIGATION_CONFIG,
	}
}
