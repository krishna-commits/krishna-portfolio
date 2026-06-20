'use client'

import { useGetGithubRepos, useGetGithubStats } from 'app/api/github'
import { Badge } from 'app/theme/components/ui/badge'
import { cn } from 'app/theme/lib/utils'
import moment from 'moment'
import Link from 'next/link'
import { memo, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
	Search,
	X,
	ExternalLink,
	Code2,
	Github,
	Star,
	GitFork,
	AlertCircle,
	ArrowUpRight,
	Layers,
} from 'lucide-react'
import { CopyrightFooter } from '../components/copyright-footer'
import {
	PAGE_CARD_LIGHT,
	PAGE_FILTER_ACTIVE,
	PAGE_FILTER_INACTIVE,
	PAGE_H1,
	PAGE_ICON_CHIP,
	PAGE_LEAD,
	pageGutter,
} from 'lib/page-layout'
import { siteConfig } from 'config/site'
import { GITHUB_OWNER } from 'lib/github-stats'
import { useLightMotion } from 'lib/hooks/use-light-motion'

type GithubRepoItem = {
	id: number
	name: string
	html_url: string
	description?: string | null
	language?: string | null
	stargazers_count?: number
	forks_count?: number
	updated_at?: string
	pushed_at?: string
	homepage?: string | null
	topics?: string[]
	fork?: boolean
	archived?: boolean
}

type SortKey = 'updated' | 'stars' | 'name'

function PageShell({ children }: { children: React.ReactNode }) {
	return (
		<main className={cn('min-h-screen bg-background py-8 md:py-10', pageGutter, 'mx-auto w-full max-w-7xl')}>
			{children}
		</main>
	)
}

function LoadingSkeleton() {
	return (
		<PageShell>
			<div className="space-y-6">
				<div className="space-y-3">
					<div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
					<div className="h-5 max-w-xl animate-pulse rounded bg-muted" />
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-20 animate-pulse rounded-xl bg-muted/60" />
					))}
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-36 animate-pulse rounded-2xl bg-muted/50" />
					))}
				</div>
			</div>
		</PageShell>
	)
}

function StatChip({
	label,
	value,
	icon: Icon,
	loading,
}: {
	label: string
	value: string | number
	icon: React.ComponentType<{ className?: string }>
	loading?: boolean
}) {
	return (
		<div className={cn(PAGE_CARD_LIGHT, 'flex items-center gap-3 p-3.5 sm:p-4')}>
			<span className="inline-flex rounded-lg border border-amber-200/60 bg-amber-50 p-2 text-amber-700 dark:border-border dark:bg-muted dark:text-amber-400">
				<Icon className="h-4 w-4" aria-hidden />
			</span>
			<div>
				<p className="text-lg font-bold tabular-nums leading-none text-foreground sm:text-xl">
					{loading ? '' : value}
				</p>
				<p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">{label}</p>
			</div>
		</div>
	)
}

const RepoCard = memo(function RepoCard({
	repo,
	compact = false,
}: {
	repo: GithubRepoItem
	compact?: boolean
}) {
	const stars = repo.stargazers_count ?? 0
	const forks = repo.forks_count ?? 0
	const updated = repo.pushed_at || repo.updated_at

	return (
		<article
			className={cn(
				PAGE_CARD_LIGHT,
				'group flex h-full flex-col p-4 transition-all hover:border-amber-400 hover:shadow-md sm:p-5',
				compact && 'border-amber-300/80',
			)}
		>
			<div className="mb-2 flex items-start justify-between gap-2">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<span className="inline-flex shrink-0 rounded-lg border border-amber-200/60 bg-white p-1.5 dark:border-border dark:bg-muted">
						<Github className="h-3.5 w-3.5 text-foreground" aria-hidden />
					</span>
					<Link
						href={repo.html_url}
						target="_blank"
						rel="noopener noreferrer"
						className="min-w-0 truncate text-sm font-semibold text-foreground no-underline transition-colors hover:text-amber-700 dark:hover:text-amber-400 sm:text-base"
					>
						{repo.name}
					</Link>
				</div>
				<ExternalLink
					className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
					aria-hidden
				/>
			</div>

			{repo.description ? (
				<p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
					{repo.description}
				</p>
			) : (
				<p className="mb-3 flex-1 text-xs italic text-muted-foreground/70">No description</p>
			)}

			{repo.topics && repo.topics.length > 0 && (
				<div className="mb-3 flex flex-wrap gap-1">
					{repo.topics.slice(0, 3).map((topic) => (
						<span
							key={topic}
							className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
						>
							{topic}
						</span>
					))}
				</div>
			)}

			<div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
				<div className="flex flex-wrap items-center gap-2">
					{repo.language && (
						<Badge variant="outline" className="font-mono text-[10px]">
							{repo.language}
						</Badge>
					)}
					{stars > 0 && (
						<span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs">
							<Star className="h-3 w-3" aria-hidden />
							{stars}
						</span>
					)}
					{forks > 0 && (
						<span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs">
							<GitFork className="h-3 w-3" aria-hidden />
							{forks}
						</span>
					)}
					{updated && (
						<span className="text-[10px] text-muted-foreground sm:text-xs">
							{moment(updated).fromNow()}
						</span>
					)}
				</div>
				{repo.homepage && (
					<Link
						href={repo.homepage}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[10px] font-semibold text-amber-700 no-underline hover:underline dark:text-amber-400 sm:text-xs"
					>
						Live demo
					</Link>
				)}
			</div>
		</article>
	)
})

export default function CodeCanvasPage() {
	const { repo, repoLoading, repoError, repoEmpty } = useGetGithubRepos()
	const { stats, statsLoading, statsReady } = useGetGithubStats()
	const lightMotion = useLightMotion()

	const [query, setQuery] = useState('')
	const [lang, setLang] = useState('')
	const [sort, setSort] = useState<SortKey>('updated')
	const [hideForks, setHideForks] = useState(false)

	const repos = (repo || []) as GithubRepoItem[]

	const languages = useMemo(() => {
		const set = new Set<string>()
		repos.forEach((r) => r.language && set.add(r.language))
		return Array.from(set).sort()
	}, [repos])

	const filtered = useMemo(() => {
		let list = repos.filter((r) => {
			if (hideForks && r.fork) return false
			if (r.archived) return false
			const matchesQuery = query
				? `${r.name} ${r.description ?? ''} ${(r.topics ?? []).join(' ')}`
						.toLowerCase()
						.includes(query.toLowerCase())
				: true
			const matchesLang = lang ? r.language === lang : true
			return matchesQuery && matchesLang
		})

		list = [...list].sort((a, b) => {
			if (sort === 'stars') return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)
			if (sort === 'name') return a.name.localeCompare(b.name)
			const aDate = a.pushed_at || a.updated_at || ''
			const bDate = b.pushed_at || b.updated_at || ''
			return bDate.localeCompare(aDate)
		})

		return list
	}, [repos, query, lang, sort, hideForks])

	const highlighted = useMemo(
		() =>
			[...repos]
				.filter((r) => !r.fork && !r.archived && (r.stargazers_count ?? 0) > 0)
				.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
				.slice(0, 3),
		[repos],
	)

	const showHighlighted =
		highlighted.length > 0 && !query && !lang && sort === 'updated' && !hideForks

	const gridRepos = useMemo(() => {
		if (!showHighlighted) return filtered
		const highlightedIds = new Set(highlighted.map((r) => r.id))
		return filtered.filter((r) => !highlightedIds.has(r.id))
	}, [filtered, highlighted, showHighlighted])

	if (repoLoading) return <LoadingSkeleton />

	if (repoError) {
		return (
			<PageShell>
				<div className={cn(PAGE_CARD_LIGHT, 'flex flex-col gap-4 p-6 sm:flex-row sm:items-start')}>
					<span className="inline-flex rounded-lg border border-amber-200/60 bg-amber-50 p-2.5 text-amber-700 dark:bg-muted dark:text-amber-400">
						<AlertCircle className="h-5 w-5" aria-hidden />
					</span>
					<div className="flex-1 space-y-3">
						<h1 className="text-lg font-semibold text-foreground">Unable to load repositories</h1>
						<p className="text-sm text-muted-foreground">
							GitHub data is temporarily unavailable. View repositories directly on GitHub.
						</p>
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-amber-700"
						>
							<Github className="h-4 w-4" aria-hidden />
							@{GITHUB_OWNER}
							<ArrowUpRight className="h-4 w-4" aria-hidden />
						</Link>
					</div>
				</div>
			</PageShell>
		)
	}

	const header = (
		<div className="mb-6 space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2.5">
						<span className={PAGE_ICON_CHIP}>
							<Code2 className="h-5 w-5" aria-hidden />
						</span>
						<h1 className={PAGE_H1}>Code Canvas</h1>
					</div>
					<p className={PAGE_LEAD}>
						Live GitHub repositories  DevSecOps tooling, cloud automation, security research implementations, and
						production experiments by @{GITHUB_OWNER}.
					</p>
				</div>
				<Link
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-amber-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm no-underline transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-border dark:bg-card dark:hover:bg-muted"
				>
					<Github className="h-4 w-4" aria-hidden />
					View on GitHub
					<ArrowUpRight className="h-4 w-4" aria-hidden />
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
				<StatChip
					label="Public repos"
					value={statsReady ? stats!.publicRepos : repos.length}
					icon={Github}
					loading={statsLoading && repoLoading}
				/>
				<StatChip
					label="Stars"
					value={statsReady ? stats!.totalStars : repos.reduce((s, r) => s + (r.stargazers_count ?? 0), 0)}
					icon={Star}
					loading={statsLoading}
				/>
				<StatChip
					label="Forks"
					value={statsReady ? stats!.totalForks : repos.reduce((s, r) => s + (r.forks_count ?? 0), 0)}
					icon={GitFork}
					loading={statsLoading}
				/>
				<StatChip
					label="Languages"
					value={statsReady ? stats!.languageCount : languages.length}
					icon={Layers}
					loading={statsLoading}
				/>
			</div>
		</div>
	)

	const filters = (
		<div className="mb-5 space-y-3">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search repos, topics, descriptions…"
						className="h-9 w-full rounded-lg border border-amber-200/80 bg-white pl-8 pr-8 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 dark:border-input dark:bg-background"
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery('')}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				<select
					value={sort}
					onChange={(e) => setSort(e.target.value as SortKey)}
					className="h-9 rounded-lg border border-amber-200/80 bg-white px-2.5 text-xs font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 dark:border-input dark:bg-background sm:text-sm"
					aria-label="Sort repositories"
				>
					<option value="updated">Recently updated</option>
					<option value="stars">Most stars</option>
					<option value="name">Name A–Z</option>
				</select>
				<label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground sm:text-sm">
					<input
						type="checkbox"
						checked={hideForks}
						onChange={(e) => setHideForks(e.target.checked)}
						className="rounded border-border"
					/>
					Hide forks
				</label>
			</div>

			{languages.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					<button
						type="button"
						onClick={() => setLang('')}
						className={lang === '' ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE}
					>
						All
					</button>
					{languages.map((l) => (
						<button
							key={l}
							type="button"
							onClick={() => setLang(lang === l ? '' : l)}
							className={lang === l ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE}
						>
							{l}
						</button>
					))}
				</div>
			)}

			<p className="text-xs text-muted-foreground">
				{filtered.length} of {repos.filter((r) => !r.archived).length} repositories
				{(query || lang) && (
					<button
						type="button"
						onClick={() => {
							setQuery('')
							setLang('')
						}}
						className="ml-2 font-semibold text-amber-700 hover:underline dark:text-amber-400"
					>
						Clear filters
					</button>
				)}
			</p>
		</div>
	)

	const grid = (
		<>
			{showHighlighted && (
				<div className="mb-6">
					<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Highlighted</h2>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						{highlighted.map((r) => (
							<RepoCard key={r.id} repo={r} compact />
						))}
					</div>
				</div>
			)}

			{repoEmpty ? (
				<div className="py-12 text-center">
					<p className="text-sm text-muted-foreground">No public repositories found.</p>
				</div>
			) : filtered.length === 0 ? (
				<div className="py-12 text-center">
					<p className="text-sm text-muted-foreground">No repositories match your filters.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
					{gridRepos.map((repoItem) => (
						<RepoCard key={repoItem.id} repo={repoItem} />
					))}
				</div>
			)}
		</>
	)

	return (
		<PageShell>
			{lightMotion ? (
				<>
					{header}
					{filters}
					{grid}
				</>
			) : (
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
					{header}
					{filters}
					{grid}
				</motion.div>
			)}

			<div className="mt-10 border-t border-border/60 pt-8">
				<CopyrightFooter />
			</div>
		</PageShell>
	)
}
