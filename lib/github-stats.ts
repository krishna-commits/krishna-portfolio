import { getGitHubIntegrationSettings } from 'lib/integration-settings'

const GITHUB_API_BASE = 'https://api.github.com'
export const DEFAULT_GITHUB_OWNER = 'krishna-commits'

/** @deprecated use getGitHubOwner() */
export const GITHUB_OWNER = DEFAULT_GITHUB_OWNER

export async function getGitHubOwner(): Promise<string> {
	const settings = await getGitHubIntegrationSettings()
	return settings.githubUsername || DEFAULT_GITHUB_OWNER
}

export type GitHubRepo = {
	name: string
	stargazers_count?: number
	forks_count?: number
	language?: string | null
	private?: boolean
}

export type GitHubAggregatedStats = {
	publicRepos: number
	totalStars: number
	totalForks: number
	languageCount: number
	languages: string[]
	source: 'github'
	username: string
	fetchedAt: string
}

type GitHubUser = {
	public_repos?: number
	login?: string
}

function githubHeaders(token?: string): HeadersInit {
	const headers: HeadersInit = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
	}
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}
	return headers
}

export async function fetchAllGitHubRepos(token?: string, owner?: string): Promise<GitHubRepo[]> {
	const githubOwner = owner ?? (await getGitHubOwner())
	const repos: GitHubRepo[] = []
	let page = 1
	const perPage = 100

	while (page <= 10) {
		const response = await fetch(
			`${GITHUB_API_BASE}/users/${githubOwner}/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`,
			{
				headers: githubHeaders(token),
				next: { revalidate: 300 },
			},
		)

		if (!response.ok) {
			throw new Error(`GitHub repos API error: ${response.status}`)
		}

		const batch = (await response.json()) as GitHubRepo[]
		if (!Array.isArray(batch) || batch.length === 0) break

		repos.push(...batch)
		if (batch.length < perPage) break
		page += 1
	}

	return repos
}

export function aggregateGitHubStats(repos: GitHubRepo[]): Omit<GitHubAggregatedStats, 'source' | 'username' | 'fetchedAt'> {
	const publicRepos = repos.filter((r) => !r.private).length || repos.length
	const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
	const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)
	const languages = Array.from(
		new Set(repos.map((r) => r.language).filter(Boolean) as string[]),
	).sort()

	return {
		publicRepos,
		totalStars,
		totalForks,
		languageCount: languages.length,
		languages,
	}
}

export async function fetchGitHubStats(token?: string): Promise<GitHubAggregatedStats> {
	const githubOwner = await getGitHubOwner()
	const [repos, userResponse] = await Promise.all([
		fetchAllGitHubRepos(token, githubOwner),
		fetch(`${GITHUB_API_BASE}/users/${githubOwner}`, {
			headers: githubHeaders(token),
			next: { revalidate: 300 },
		}),
	])

	const aggregated = aggregateGitHubStats(repos)

	if (userResponse.ok) {
		const user = (await userResponse.json()) as GitHubUser
		if (user.public_repos != null && user.public_repos > 0) {
			aggregated.publicRepos = user.public_repos
		}
	}

	return {
		...aggregated,
		source: 'github',
		username: githubOwner,
		fetchedAt: new Date().toISOString(),
	}
}
