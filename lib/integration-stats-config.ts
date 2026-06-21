import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'

export const INTEGRATION_STATS_KEY = 'integration_stats'

export type MediumStatsOverride = {
	totalReads?: number
	totalPosts?: number
	useLiveFetch?: boolean
}

export type ResearchGateStatsOverride = {
	researchInterestScore?: number
	citations?: number
	hIndex?: number
	recommendations?: number
	totalReads?: number
	publicationReads?: number
	fullTextReads?: number
	useLiveFetch?: boolean
}

export type OrcidStatsOverride = {
	workCount?: number
	useLiveFetch?: boolean
}

export type IntegrationStatsOverrides = {
	medium?: MediumStatsOverride
	researchgate?: ResearchGateStatsOverride
	orcid?: OrcidStatsOverride
}

export const DEFAULT_INTEGRATION_STATS: IntegrationStatsOverrides = {}

export async function getIntegrationStatsOverrides(): Promise<IntegrationStatsOverrides> {
	const stored = await getSiteSettingJson<IntegrationStatsOverrides | null>(
		INTEGRATION_STATS_KEY,
		null,
	)
	return stored ?? DEFAULT_INTEGRATION_STATS
}

export async function saveIntegrationStatsOverrides(
	value: IntegrationStatsOverrides,
): Promise<void> {
	await upsertSiteSettingJson(INTEGRATION_STATS_KEY, value)
}

export function mergeIntegrationStatsOverrides(
	partial?: IntegrationStatsOverrides | null,
): IntegrationStatsOverrides {
	if (!partial) return DEFAULT_INTEGRATION_STATS
	return {
		medium: partial.medium ? { ...partial.medium } : undefined,
		researchgate: partial.researchgate ? { ...partial.researchgate } : undefined,
		orcid: partial.orcid ? { ...partial.orcid } : undefined,
	}
}
