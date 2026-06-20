export const STATS_SETTINGS_KEY = 'stats'

export type StatItemConfig = {
	id: string
	label: string
	value: number
	icon?: string
	description?: string
	enabled: boolean
}

export type StatsSettings = {
	title: string
	description: string
	stats: StatItemConfig[]
}

/** Section title/description for the homepage stats block. Metric values come from live APIs (GitHub, ResearchGate, Medium). */
export const DEFAULT_STATS_SETTINGS: StatsSettings = {
	title: 'Knowledge & Impact',
	description:
		'Technical guides, credentials, and community reach  Research Core holds applied notes, not peer-reviewed journal papers.',
	stats: [],
}

export function mergeStatsSettings(partial?: Partial<StatsSettings> | null): StatsSettings {
	if (!partial) return DEFAULT_STATS_SETTINGS
	return {
		title: partial.title?.trim() || DEFAULT_STATS_SETTINGS.title,
		description: partial.description?.trim() || DEFAULT_STATS_SETTINGS.description,
		stats: partial.stats?.length ? partial.stats : DEFAULT_STATS_SETTINGS.stats,
	}
}

export const LIVE_STATS_SOURCES = [
	{
		name: 'GitHub',
		env: ['GITHUB_ACCESS_TOKEN'],
		metrics: 'Languages, Open Source Repos, GitHub Stars',
		endpoint: '/api/github/stats',
	},
	{
		name: 'ResearchGate',
		env: [
			'RESEARCHGATE_RESEARCH_INTEREST_SCORE',
			'RESEARCHGATE_CITATIONS',
			'RESEARCHGATE_H_INDEX',
			'RESEARCHGATE_TOTAL_READS',
		],
		metrics: 'Research interest score, citations, h-index, profile reads',
		endpoint: '/api/researchgate',
	},
	{
		name: 'Medium',
		env: ['MEDIUM_TOTAL_READS', 'MEDIUM_TOTAL_POSTS'],
		metrics: 'Article reads and published story count',
		endpoint: '/api/medium/stats',
	},
] as const
