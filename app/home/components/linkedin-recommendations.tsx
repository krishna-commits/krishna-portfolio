'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Linkedin, ExternalLink, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { useSocialLinks } from 'lib/hooks/use-homepage-data'
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD } from 'lib/page-layout'
import { cn } from 'app/theme/lib/utils'
import type { LinkedInRecommendationItem } from 'lib/linkedin-recommendations'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const CLAMP_LINES = 5

function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}

function Avatar({ name }: { name: string }) {
	const label = initials(name) || '?'

	return (
		<div
			className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-500/25 bg-gradient-to-br from-amber-100 to-amber-50 text-sm font-bold text-amber-800 dark:from-amber-900/50 dark:to-amber-950/30 dark:text-amber-200"
			aria-hidden
		>
			{label}
		</div>
	)
}

function RecommendationCard({
	rec,
	index,
	featured = false,
	profileUrl,
}: {
	rec: LinkedInRecommendationItem
	index: number
	featured?: boolean
	profileUrl: string
}) {
	const [expanded, setExpanded] = useState(false)
	const isLong = rec.text.length > 280

	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ delay: index * 0.06, duration: 0.45 }}
			className="group relative"
		>
			<div
				className={cn(
					PAGE_CARD,
					'relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-amber-500/15',
					featured ? 'p-6 sm:p-7 md:p-8' : 'p-5 sm:p-6',
				)}
			>
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					aria-hidden
				/>

				<div className="relative flex h-full flex-col gap-4">
					<div className="flex items-start justify-between gap-3">
						<span className="inline-flex rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-400">
							<Quote className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
						</span>
						{featured && (
							<span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 sm:text-xs">
								Latest
							</span>
						)}
					</div>

					<blockquote
						className={cn(
							'flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base',
							!expanded && isLong && `line-clamp-${CLAMP_LINES}`,
						)}
						style={
							!expanded && isLong
								? {
										display: '-webkit-box',
										WebkitLineClamp: CLAMP_LINES,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
									}
								: undefined
						}
					>
						&ldquo;{rec.text}&rdquo;
					</blockquote>

					{isLong && (
						<button
							type="button"
							onClick={() => setExpanded((v) => !v)}
							className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-amber-700 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 sm:text-sm"
						>
							{expanded ? 'Show less' : 'Read full recommendation'}
							<ChevronDown
								className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
								aria-hidden
							/>
						</button>
					)}

					<footer className="mt-auto border-t border-border/80 pt-4">
						<div className="flex items-center gap-3">
							<Avatar name={rec.name} />
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-foreground sm:text-base">
									{rec.name}
								</p>
								<p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
									{rec.title}
									{rec.company ? ` · ${rec.company}` : ''}
								</p>
								{rec.date && (
									<p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{rec.date}</p>
								)}
							</div>
							<Link
								href={rec.linkedinUrl || profileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="shrink-0 rounded-lg border border-border bg-muted/60 p-2.5 text-foreground transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400"
								aria-label={`View ${rec.name} on LinkedIn`}
							>
								<Linkedin className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
							</Link>
						</div>
					</footer>
				</div>
			</div>
		</motion.article>
	)
}

function RecommendationsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className={cn(PAGE_CARD, 'h-64 animate-pulse bg-muted/40')} aria-hidden />
			))}
		</div>
	)
}

const SLIM_MAX = 3

export function LinkedInRecommendations({ variant = 'full' }: { variant?: 'full' | 'slim' }) {
	const { data, isLoading } = useSWR('/api/homepage/recommendations', fetcher, {
		revalidateOnFocus: false,
	})
	const { links } = useSocialLinks()

	const recommendations = (data?.recommendations ?? []) as LinkedInRecommendationItem[]
	const count = data?.count ?? recommendations.length
	const profileUrl = data?.profileUrl || links.linkedIn
	const isSlim = variant === 'slim'

	const [featured, rest] = useMemo((): [LinkedInRecommendationItem | null, LinkedInRecommendationItem[]] => {
		if (recommendations.length === 0) return [null, []]
		if (isSlim) return [null, recommendations.slice(0, SLIM_MAX)]
		return [recommendations[0], recommendations.slice(1)]
	}, [recommendations, isSlim])

	if (isLoading) {
		return (
			<section id="recommendations" className="relative w-full scroll-mt-24" aria-labelledby="recommendations-heading">
				<div className={cn('animate-pulse rounded-2xl bg-muted/40', isSlim ? 'mb-5 h-14' : 'mb-8 h-24')} aria-hidden />
				<RecommendationsSkeleton />
			</section>
		)
	}

	if (recommendations.length === 0) return null

	return (
		<section id="recommendations" className="relative w-full scroll-mt-24" aria-labelledby="recommendations-heading">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className={isSlim ? 'mb-5 sm:mb-6' : 'mb-8 sm:mb-10'}
			>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className={cn('space-y-2', isSlim && 'space-y-1')}>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							<span className={PAGE_ICON_CHIP}>
								<Linkedin className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden />
							</span>
							<h2 id="recommendations-heading" className={cn(PAGE_H1, isSlim && 'text-xl sm:text-2xl')}>
								LinkedIn Recommendations
							</h2>
							<span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-300">
								{count}
							</span>
						</div>
						{!isSlim && (
							<p className={cn(PAGE_LEAD, 'max-w-2xl text-sm sm:text-base')}>
								What colleagues and collaborators say about working together.
							</p>
						)}
						{isSlim && (
							<p className="text-sm text-muted-foreground">
								Colleague endorsements from LinkedIn  imported via admin.
							</p>
						)}
					</div>
					<Link
						href={profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-amber-500/30 hover:bg-amber-500/5 sm:px-4 sm:py-2.5"
					>
						View on LinkedIn
						<ExternalLink className="h-4 w-4" aria-hidden />
					</Link>
				</div>
			</motion.div>

			{featured && (
				<RecommendationCard rec={featured} index={0} featured profileUrl={profileUrl} />
			)}

			{rest.length > 0 && (
				<div
					className={cn(
						'grid grid-cols-1 gap-4 sm:gap-5',
						isSlim ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3',
					)}
				>
					{rest.map((rec, idx) => (
						<RecommendationCard
							key={`${rec.name}-${rec.date ?? idx}`}
							rec={rec}
							index={idx + (featured ? 1 : 0)}
							profileUrl={profileUrl}
						/>
					))}
				</div>
			)}
		</section>
	)
}
