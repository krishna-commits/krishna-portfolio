'use client'

import useSWR from 'swr'
import {
	DEFAULT_NAVIGATION_CONFIG,
	mergeNavigationConfig,
	type NavigationConfig,
} from 'lib/navigation-config'
import { homepageFetcher, homepageSwrOptions } from 'lib/hooks/use-homepage-api'

export function useNavigationConfig() {
	const { data, isLoading, mutate } = useSWR<{ navigation?: Partial<NavigationConfig> }>(
		'/api/homepage/navigation',
		homepageFetcher,
		homepageSwrOptions,
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
