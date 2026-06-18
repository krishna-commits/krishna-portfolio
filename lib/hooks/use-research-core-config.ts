'use client'

import useSWR from 'swr'
import {
	DEFAULT_RESEARCH_CORE_CONFIG,
	mergeResearchCoreConfig,
	type ResearchCoreConfig,
} from 'lib/research-core-config'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useResearchCoreConfig() {
	const { data, error, isLoading, mutate } = useSWR<{ config: ResearchCoreConfig }>(
		'/api/research-core/config',
		fetcher,
		{ revalidateOnFocus: true },
	)

	const config = mergeResearchCoreConfig(data?.config)

	return {
		config,
		isLoading,
		error,
		mutate,
		defaults: DEFAULT_RESEARCH_CORE_CONFIG,
	}
}
