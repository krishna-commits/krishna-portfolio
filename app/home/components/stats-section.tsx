'use client'

import { motion } from 'framer-motion'
import { memo, useMemo, useEffect, useState, type ComponentType } from 'react'
import { siteConfig } from 'config/site'
import useSWR from 'swr'
import Link from 'next/link'
import {
	BookOpen,
	Code,
	Award,
	Zap,
	Eye,
	BookMarked,
	TrendingUp,
	Quote,
	Hash,
	PenLine,
	ExternalLink,
	GraduationCap,
} from 'lucide-react'
import { cn } from 'app/theme/lib/utils'
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD, PAGE_CARD_LIGHT } from 'lib/page-layout'
import { PublicationsBand } from './publications-section'
import { useLightMotion } from 'lib/hooks/use-light-motion'

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) {
		return { citations: 0, reads: 0, totalReads: 0, totalPosts: 0 }
	}
	return res.json()
}

type Accent = 'amber' | 'violet' | 'emerald' | 'sky'

type StatItem = {
	icon: ComponentType<{ className?: string }>
	label: string
	value: number
	description?: string
	delay?: number
	loading?: boolean
	decimals?: number
	accent?: Accent
}

const ACCENT: Record<
	Accent,
	{ icon: string; chip: string; ring: string; glow: string }
> = {
	amber: {
		icon: 'text-amber-600 dark:text-amber-400',
		chip: 'bg-amber-500/10 border-amber-500/20',
		ring: 'ring-amber-500/20',
		glow: 'from-amber-500/[0.07] via-amber-500/[0.02] to-transparent',
	},
	violet: {
		icon: 'text-violet-600 dark:text-violet-400',
		chip: 'bg-violet-500/10 border-violet-500/20',
		ring: 'ring-violet-500/20',
		glow: 'from-violet-500/[0.08] via-violet-500/[0.02] to-transparent',
	},
	emerald: {
		icon: 'text-emerald-600 dark:text-emerald-400',
		chip: 'bg-emerald-500/10 border-emerald-500/20',
		ring: 'ring-emerald-500/20',
		glow: 'from-emerald-500/[0.07] via-emerald-500/[0.02] to-transparent',
	},
	sky: {
		icon: 'text-sky-600 dark:text-sky-400',
		chip: 'bg-sky-500/10 border-sky-500/20',
		ring: 'ring-sky-500/20',
		glow: 'from-sky-500/[0.07] via-sky-500/[0.02] to-transparent',
	},
}

function useAnimatedNumber(value: number, loading: boolean, decimals = 0) {
	const [display, setDisplay] = useState(0)

	useEffect(() => {
		if (loading) {
			setDisplay(0)
			return
		}

		let startTime: number | null = null
		const duration = 1400

		const animate = (time: number) => {
			if (startTime === null) startTime = time
			const progress = Math.min((time - startTime) / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			const current = value * eased
			setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current))
			if (progress < 1) requestAnimationFrame(animate)
			else setDisplay(value)
		}

		requestAnimationFrame(animate)
	}, [value, loading, decimals])

	return display
}

function formatMetric(value: number, decimals = 0) {
	if (decimals > 0) return value.toFixed(decimals)
	return value.toLocaleString()
}

function MetricValue({
	value,
	loading,
	decimals = 0,
	className,
}: {
	value: number
	loading?: boolean
	decimals?: number
	className?: string
}) {
	const display = useAnimatedNumber(value, loading ?? false, decimals)

	if (loading) {
		return (
			<span className={cn('inline-block h-[1em] w-16 animate-pulse rounded bg-muted', className)} aria-hidden />
		)
	}

	return (
		<span className={cn('tabular-nums tracking-tight', className)}>
			{formatMetric(display, decimals)}
		</span>
	)
}

function FeaturedMetricCard({ stat, index }: { stat: StatItem; index: number }) {
	const accent = ACCENT[stat.accent ?? 'amber']
	const lightMotion = useLightMotion()

	const card = (
		<div
			className={cn(
				PAGE_CARD_LIGHT,
				'relative h-full overflow-hidden p-5 sm:p-6',
				'transition-all duration-300 hover:border-amber-300 hover:shadow-md hover:ring-1',
				accent.ring,
			)}
		>
			<div
				className={cn(
					'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100',
					accent.glow,
				)}
				aria-hidden
			/>
			<div className="relative flex h-full flex-col justify-between gap-4">
				<div
					className={cn(
						'inline-flex w-fit rounded-xl border p-2.5',
						accent.chip,
					)}
				>
					<stat.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', accent.icon)} aria-hidden />
				</div>
				<div className="space-y-1">
					<p className="text-3xl font-bold leading-none text-foreground sm:text-4xl">
						<MetricValue value={stat.value} loading={stat.loading} />
					</p>
					<p className="text-sm font-semibold text-foreground">{stat.label}</p>
					{stat.description && (
						<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
							{stat.description}
						</p>
					)}
				</div>
			</div>
		</div>
	)

	if (lightMotion) {
		return <div className="group relative">{card}</div>
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.08, duration: 0.5 }}
			className="group relative"
		>
			{card}
		</motion.div>
	)
}

function CompactMetric({
	stat,
	index,
	href,
}: {
	stat: StatItem
	index: number
	href?: string
}) {
	const accent = ACCENT[stat.accent ?? 'amber']
	const lightMotion = useLightMotion()

	const inner = (
		<>
			<div className={cn('mt-0.5 shrink-0 rounded-lg border p-2', accent.chip)}>
				<stat.icon className={cn('h-4 w-4', accent.icon)} aria-hidden />
			</div>
			<div className="min-w-0 flex-1 space-y-0.5">
				<p className="text-xl font-bold leading-none text-foreground sm:text-2xl">
					<MetricValue value={stat.value} loading={stat.loading} decimals={stat.decimals} />
				</p>
				<p className="text-xs font-medium text-foreground sm:text-sm">{stat.label}</p>
				{stat.description && (
					<p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">{stat.description}</p>
				)}
			</div>
		</>
	)

	const cardClass = cn(
		PAGE_CARD_LIGHT,
		'flex items-start gap-3 p-3.5 sm:p-4',
		'transition-all duration-200 hover:border-amber-300 hover:shadow-md',
		href && 'hover:ring-1 hover:ring-amber-200/60',
	)

	if (href) {
		if (lightMotion) {
			return (
				<Link href={href} className={cn(cardClass, 'no-underline')}>
					{inner}
				</Link>
			)
		}
		return (
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-40px' }}
				transition={{ delay: (stat.delay ?? index * 0.05) + 0.1, duration: 0.45 }}
			>
				<Link href={href} className={cn(cardClass, 'no-underline')}>
					{inner}
				</Link>
			</motion.div>
		)
	}

	if (lightMotion) {
		return <div className={cardClass}>{inner}</div>
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ delay: (stat.delay ?? index * 0.05) + 0.1, duration: 0.45 }}
			className={cardClass}
		>
			{inner}
		</motion.div>
	)
}

function PlatformLink({
	href,
	label,
	internal = false,
}: {
	href: string
	label: string
	internal?: boolean
}) {
	const className =
		'inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-700 dark:hover:text-amber-400 sm:text-xs'

	if (internal) {
		return (
			<Link href={href} className={className}>
				{label}
			</Link>
		)
	}

	return (
		<Link href={href} target="_blank" rel="noopener noreferrer" className={className}>
			{label}
			<ExternalLink className="h-3 w-3" aria-hidden />
		</Link>
	)
}

function LiveBadge() {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 sm:text-[11px]">
			<span className="relative flex h-1.5 w-1.5">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
				<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
			</span>
			Live
		</span>
	)
}

function PanelHeader({
	icon: Icon,
	title,
	badge,
	link,
}: {
	icon: ComponentType<{ className?: string }>
	title: string
	badge?: React.ReactNode
	link?: { href: string; label: string }
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="flex items-center gap-2.5 sm:gap-3">
				<span className={PAGE_ICON_CHIP}>
					<Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
				</span>
				<div className="flex flex-wrap items-center gap-2">
					<h3 className="text-base font-semibold text-foreground sm:text-lg">{title}</h3>
					{badge}
				</div>
			</div>
			{link && <PlatformLink href={link.href} label={link.label} />}
		</div>
	)
}

export const StatsSection = memo(function StatsSection({
	researchCoreCount = 0,
	projectsCount = 0,
}: {
	researchCoreCount?: number
	projectsCount?: number
}) {
	const lightMotion = useLightMotion()
	const { data: certData } = useSWR('/api/homepage/certifications', fetcher, { revalidateOnFocus: true })
	const { data: statsSettings } = useSWR('/api/homepage/stats', fetcher, { revalidateOnFocus: true })
	const { data: researchGateData, isLoading: researchGateLoading } = useSWR(
		'/api/researchgate',
		fetcher,
		{ revalidateOnFocus: false, revalidateOnReconnect: true },
	)
	const { data: mediumData, isLoading: mediumLoading } = useSWR(
		'/api/medium/stats',
		fetcher,
		{ revalidateOnFocus: false, revalidateOnReconnect: true, refreshInterval: 3600000 },
	)

	const technicalGuideCount = researchCoreCount
	const projectsCountResolved = projectsCount
	const certificationsCount = useMemo(
		() => certData?.certifications?.length ?? siteConfig.certification.length,
		[certData],
	)

	const statsTitle = (statsSettings?.stats as { title?: string })?.title || 'Knowledge & Impact'
	const statsDescription =
		(statsSettings?.stats as { description?: string })?.description ||
		'At-a-glance metrics, research profile, and peer-reviewed publications.'

	const researchGateReady =
		!researchGateLoading &&
		researchGateData != null &&
		!researchGateData.error &&
		((researchGateData.researchInterestScore ?? 0) > 0 ||
			(researchGateData.citations ?? 0) > 0 ||
			(researchGateData.hIndex ?? 0) > 0 ||
			(researchGateData.totalReads ?? researchGateData.reads ?? 0) > 0)

	const mediumStatsReady = !mediumLoading && mediumData != null && !mediumData.error

	const mediumTotalReads = mediumStatsReady ? mediumData?.totalReads ?? 0 : 0
	const mediumTotalPosts = mediumStatsReady ? mediumData?.totalPosts ?? 0 : 0

	const researchGateReads = researchGateReady
		? researchGateData?.totalReads || researchGateData?.reads || 0
		: 0
	const researchInterestScore = researchGateReady ? researchGateData?.researchInterestScore ?? 0 : 0
	const researchCitations = researchGateReady ? researchGateData?.citations ?? 0 : 0
	const researchHIndex = researchGateReady ? researchGateData?.hIndex ?? 0 : 0

	const featuredStats: StatItem[] = useMemo(
		() => [
			{
				icon: BookOpen,
				label: 'Technical Guides',
				value: technicalGuideCount,
				description: 'Research Core notes & chapters',
				accent: 'amber',
			},
			{
				icon: Award,
				label: 'Certifications',
				value: certificationsCount,
				description: 'Professional credentials',
				accent: 'violet',
			},
			{
				icon: Code,
				label: 'Projects',
				value: projectsCountResolved,
				description: 'Live production tools',
				accent: 'emerald',
			},
		],
		[technicalGuideCount, certificationsCount, projectsCountResolved],
	)

	const researchStats: StatItem[] = useMemo(() => {
		const loading = researchGateLoading
		if (loading) {
			return [
				{ icon: Quote, label: 'Citations', value: 0, loading: true, accent: 'violet' },
				{ icon: Hash, label: 'h-index', value: 0, loading: true, accent: 'violet' },
				{ icon: BookMarked, label: 'Profile Reads', value: 0, loading: true, accent: 'violet' },
			]
		}
		if (!researchGateReady) return []

		const items: StatItem[] = [
			{
				icon: Quote,
				label: 'Citations',
				value: researchCitations,
				description: 'Publication citations',
				accent: 'violet',
			},
			{
				icon: Hash,
				label: 'h-index',
				value: researchHIndex,
				description: 'Research impact index',
				accent: 'violet',
			},
		]

		if (researchGateReads > 0) {
			items.push({
				icon: BookMarked,
				label: 'Profile Reads',
				value: researchGateReads,
				description: 'Total publication reads',
				accent: 'violet',
			})
		}

		return items
	}, [
		researchGateLoading,
		researchGateReady,
		researchCitations,
		researchHIndex,
		researchGateReads,
	])

	const mediumStats: StatItem[] = useMemo(() => {
		if (!mediumStatsReady) return []
		const items: StatItem[] = []
		if (mediumTotalReads > 0) {
			items.push({
				icon: Eye,
				label: 'Medium Reads',
				value: mediumTotalReads,
				description: 'Lifetime article reads',
				accent: 'sky',
			})
		}
		if (mediumTotalPosts > 0) {
			items.push({
				icon: PenLine,
				label: 'Medium Articles',
				value: mediumTotalPosts,
				description: 'Published stories',
				accent: 'sky',
			})
		}
		return items
	}, [mediumStatsReady, mediumTotalReads, mediumTotalPosts])

	const showResearchPanel = researchGateLoading || researchStats.length > 0

	const headerBlock = (
		<div className="mb-5 sm:mb-6">
			<div className="mb-4 space-y-2 sm:mb-5 sm:space-y-3">
				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					<span className="inline-flex items-center justify-center rounded-xl border border-amber-300/50 bg-amber-100 p-2.5 text-amber-800 shadow-sm dark:border-border dark:bg-muted dark:text-foreground">
						<Zap className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
					</span>
					<h2 className={PAGE_H1}>{statsTitle}</h2>
				</div>
				<p className={cn(PAGE_LEAD, 'max-w-3xl text-sm sm:text-base md:text-lg')}>
					{statsDescription}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
				{featuredStats.map((stat, idx) => (
					<FeaturedMetricCard key={stat.label} stat={stat} index={idx} />
				))}
			</div>
		</div>
	)

	const researchBlock = (
		<div className={cn(PAGE_CARD_LIGHT, 'overflow-hidden p-4 sm:p-5 md:p-6')}>
				<div className="mb-4 sm:mb-5">
					<PanelHeader
						icon={GraduationCap}
						title="Research & Publications"
						badge={researchGateReady ? <LiveBadge /> : undefined}
						link={{ href: siteConfig.links.researchgate, label: 'ResearchGate' }}
					/>
				</div>

				{showResearchPanel && (
					<div className="mb-5 grid grid-cols-1 gap-3 sm:gap-4">
						<div
							className={cn(
								'relative overflow-hidden rounded-2xl border border-violet-200/70 bg-white p-4 shadow-sm sm:p-5 dark:border-violet-500/20 dark:bg-transparent',
								ACCENT.violet.glow,
							)}
						>
							<div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
								<div className="space-y-2">
									<div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:text-violet-300 sm:text-xs">
										<TrendingUp className="h-3.5 w-3.5" aria-hidden />
										Research Interest Score
									</div>
									<p className="text-3xl font-bold leading-none text-foreground sm:text-4xl md:text-5xl">
										<MetricValue
											value={researchInterestScore}
											loading={researchGateLoading}
											decimals={1}
										/>
									</p>
									<p className="max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm">
										Combined reach across publications, reads, and citations on ResearchGate.
									</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{researchStats.map((stat, idx) => (
								<CompactMetric key={stat.label} stat={stat} index={idx} />
							))}
						</div>
					</div>
				)}

				{mediumStats.length > 0 && (
					<div className="mb-5 border-t border-border/60 pt-4">
						<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
							<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
								Writing reach
							</p>
							<PlatformLink href={siteConfig.links.medium} label="Medium" />
						</div>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{mediumStats.map((stat, idx) => (
								<CompactMetric key={stat.label} stat={stat} index={idx} />
							))}
						</div>
					</div>
				)}

				<div className={cn(showResearchPanel || mediumStats.length > 0 ? 'border-t border-border/60 pt-5' : '')}>
					<PublicationsBand />
				</div>
		</div>
	)

	return (
		<section className="relative w-full" aria-label="Knowledge and impact metrics">
			{lightMotion ? headerBlock : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					{headerBlock}
				</motion.div>
			)}
			{lightMotion ? researchBlock : (
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					{researchBlock}
				</motion.div>
			)}
		</section>
	)
})
