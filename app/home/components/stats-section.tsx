'use client'

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import { memo, useMemo, useEffect, useState } from "react"
import { allResearchCores } from "contentlayer/generated"
import { allProjects } from "contentlayer/generated"
import { siteConfig } from "config/site"
import { useGetGithubRepos } from "app/api/github"
import useSWR from 'swr'
import { BookOpen, Code, Award, FileText, Zap, Github, Star, GitFork, Layers, Eye, Book, BookMarked, Users } from "lucide-react"
import { cn } from "app/theme/lib/utils"
import { PAGE_CARD, PAGE_ICON_CHIP, PAGE_H1, PAGE_LEAD } from "lib/page-layout"

const StatsChartPanel = dynamic(
	() => import('./stats-charts').then((mod) => ({ default: mod.StatsChartPanel })),
	{
		ssr: false,
		loading: () => <div className={cn(PAGE_CARD, 'h-48 animate-pulse sm:h-56')} aria-hidden />,
	},
)

const fetcher = async (url: string) => {
	const res = await fetch(url)
	if (!res.ok) {
		return { citations: 0, reads: 0, totalReads: 0, totalPosts: 0 }
	}
	return res.json()
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
	const [displayValue, setDisplayValue] = useState(0)
	
	useEffect(() => {
		let startTime: number | null = null
		const startValue = 0
		const endValue = value
		
		const animate = (currentTime: number) => {
			if (startTime === null) startTime = currentTime
			const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
			
			// Easing function (ease-out)
			const easeOut = 1 - Math.pow(1 - progress, 3)
			const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)
			
			setDisplayValue(currentValue)
			
			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				setDisplayValue(endValue)
			}
		}
		
		requestAnimationFrame(animate)
	}, [value, duration])
	
	return <span>{displayValue.toLocaleString()}</span>
}

// Featured stat card with large display
function FeaturedStatCard({ stat, index }: { stat: any; index: number }) {
	const [isHovered, setIsHovered] = useState(false)
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 30, scale: 0.95 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
			whileHover={{ y: -8, scale: 1.02 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="group relative"
		>
			<div className={cn(
				PAGE_CARD,
				"relative h-full overflow-hidden p-4 transition-shadow duration-300 hover:shadow-md sm:p-5 md:p-6",
			)}>
				<div className="relative z-10 space-y-3 sm:space-y-4">
					<motion.div
						animate={isHovered ? { scale: 1.05 } : {}}
						transition={{ duration: 0.3 }}
						className="inline-flex rounded-lg border border-border bg-muted p-2 sm:p-2.5"
					>
						<stat.icon className="h-3 w-3 text-amber-600 dark:text-amber-400 sm:h-4 sm:w-4" />
					</motion.div>

					<div className="space-y-1.5">
						{stat.loading ? (
							<div className="text-2xl font-bold leading-none text-muted-foreground animate-pulse sm:text-3xl md:text-4xl">
								--
							</div>
						) : (
							<div className="text-2xl font-bold leading-none text-foreground sm:text-3xl md:text-4xl">
								<AnimatedCounter value={stat.value} />
							</div>
						)}
						<div className="text-sm font-semibold text-foreground sm:text-base">
							{stat.label}
						</div>
						<div className="text-xs text-muted-foreground sm:text-sm">
							{stat.description}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

// Standard stat card
function StatCard({ stat, index }: { stat: any; index: number }) {
	const [isHovered, setIsHovered] = useState(false)
	const [displayValue, setDisplayValue] = useState(0)
	
	useEffect(() => {
		if (!stat.loading) {
			let startTime: number | null = null
			const startValue = 0
			const endValue = stat.value
			const duration = 1.5
			
			const animate = (currentTime: number) => {
				if (startTime === null) startTime = currentTime
				const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
				const easeOut = 1 - Math.pow(1 - progress, 3)
				const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)
				setDisplayValue(currentValue)
				
				if (progress < 1) {
					requestAnimationFrame(animate)
				} else {
					setDisplayValue(endValue)
				}
			}
			
			requestAnimationFrame(animate)
		}
	}, [stat.value, stat.loading])
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: stat.delay, duration: 0.5 }}
			whileHover={{ y: -6, scale: 1.02 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="group relative"
		>
			<div className={cn(PAGE_CARD, "relative h-full overflow-hidden p-4 transition-shadow hover:shadow-md sm:p-5")}>
				<div className="relative space-y-4">
					<motion.div
						animate={isHovered ? { scale: 1.05 } : {}}
						transition={{ duration: 0.3 }}
						className="inline-flex rounded-lg border border-border bg-muted p-3"
					>
						<stat.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
					</motion.div>

					<div className="space-y-2">
						{stat.loading ? (
							<div className="text-xl font-bold leading-none text-muted-foreground animate-pulse sm:text-2xl md:text-3xl">
								--
							</div>
						) : (
							<div className="text-xl font-bold leading-none text-foreground sm:text-2xl md:text-3xl">
								{displayValue.toLocaleString()}
							</div>
						)}
						<div className="space-y-1">
							<div className="text-xs font-semibold text-foreground sm:text-sm">
								{stat.label}
							</div>
							<div className="text-xs text-muted-foreground">
								{stat.description}
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

// Category section with lazy-loaded chart
function CategorySection({ title, icon: Icon, stats, chartData, colors, chartType = 'donut' }: { 
	title: string
	icon: React.ComponentType<{ className?: string }>
	stats: any[]
	chartData?: any[]
	colors?: string[]
	chartType?: 'donut' | 'radial' | 'bar'
}) {
	const totalValue = chartData?.reduce((sum, item) => sum + item.value, 0) || 0
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="space-y-6 sm:space-y-8"
		>
			<div className="mb-4 flex items-center gap-2 sm:mb-5 sm:gap-3">
				<span className={PAGE_ICON_CHIP}>
					<Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
				</span>
				<h3 className="text-base font-semibold text-foreground sm:text-lg md:text-xl">{title}</h3>
			</div>
			
			{/* Chart and Stats Grid */}
			{chartData && chartData.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
					{/* Enhanced Chart */}
					<div className="lg:col-span-1">
						<StatsChartPanel
							chartType={chartType === 'radial' ? 'radial' : 'donut'}
							chartData={chartData}
							colors={colors || []}
							totalValue={totalValue}
						/>
					</div>
					
					{/* Stats Grid */}
					<div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
						{stats.map((stat, idx) => (
							<StatCard key={idx} stat={stat} index={idx} />
						))}
					</div>
				</div>
			) : (
				/* Stats Grid without Chart */
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
					{stats.map((stat, idx) => (
						<StatCard key={idx} stat={stat} index={idx} />
					))}
				</div>
			)}
		</motion.div>
	)
}

export const StatsSection = memo(function StatsSection() {
	const { repo, repoLoading } = useGetGithubRepos()
	
	// Fetch ResearchGate data
	const { data: certData } = useSWR('/api/homepage/certifications', fetcher, { revalidateOnFocus: true })
	const { data: techData } = useSWR('/api/homepage/technology', fetcher, { revalidateOnFocus: true })
	const { data: statsSettings } = useSWR('/api/homepage/stats', fetcher, { revalidateOnFocus: true })
	const { data: researchGateData, isLoading: researchGateLoading } = useSWR(
		'/api/researchgate',
		fetcher,
		{ revalidateOnFocus: false, revalidateOnReconnect: true }
	)
	
	// Fetch Medium stats data
	const { data: mediumData, isLoading: mediumLoading } = useSWR(
		'/api/medium/stats',
		fetcher,
		{ revalidateOnFocus: false, revalidateOnReconnect: true, refreshInterval: 3600000 } // Refresh every hour
	)
	
	const researchCount = useMemo(
		() => allResearchCores.filter((r: any) => r.parent == null && r.grand_parent == null).length,
		[]
	)
	const projectsCount = useMemo(() => allProjects.length, [])
	const certificationsCount = useMemo(() => {
		return certData?.certifications?.length ?? siteConfig.certification.length
	}, [certData])
	
	const researchGateCitations = useMemo(
		() => researchGateData?.citations || 0,
		[researchGateData]
	)
	
	const technologiesCount = useMemo(
		() => techData?.technology?.length ?? siteConfig.technology_stack?.length ?? 0,
		[techData],
	)

	const statsTitle = (statsSettings?.stats as { title?: string })?.title || 'Impact Metrics'
	const statsDescription =
		(statsSettings?.stats as { description?: string })?.description ||
		'Quantifying the impact of my work across security research, open source, and community engagement.'
	
	// GitHub stats
	const githubStats = useMemo(() => {
		if (!repo || repo.length === 0) return { totalStars: 0, totalForks: 0, publicRepos: 0 }
		const totalStars = repo.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
		const totalForks = repo.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0)
		const publicRepos = repo.length
		return { totalStars, totalForks, publicRepos }
	}, [repo])

	const mediumTotalReads = useMemo(
		() => mediumData?.totalReads || 25624,
		[mediumData]
	)
	
	// Log for debugging
	useEffect(() => {
		if (mediumData) {
			if (mediumData.error) {
				console.warn('[Medium Stats]', mediumData.message || mediumData.error)
			} else {
				console.log('[Medium Stats] Loaded:', {
					totalReads: mediumData.totalReads,
					source: mediumData.source,
				})
			}
		}
	}, [mediumData])

	const researchGateReads = useMemo(
		() => researchGateData?.totalReads || researchGateData?.reads || 4550,
		[researchGateData]
	)
	
	const researchGatePublicationReads = useMemo(
		() => researchGateData?.publicationReads || 4002,
		[researchGateData]
	)
	
	const researchGateFullTextReads = useMemo(
		() => researchGateData?.fullTextReads || 1512,
		[researchGateData]
	)

	// Featured stats (key metrics)
	const featuredStats = useMemo(() => [
		{ 
			icon: BookOpen, 
			label: "Research Publications", 
			value: researchCount,
			gradient: "from-orange-500 via-red-500 to-orange-600",
			description: "Peer-reviewed works",
			delay: 0,
		},
		{ 
			icon: Star, 
			label: "GitHub Stars", 
			value: githubStats.totalStars,
			gradient: "from-yellow-400 via-amber-500 to-orange-500",
			description: "Repository stars",
			delay: 0.1,
			loading: repoLoading,
		},
		{ 
			icon: Book, 
			label: "ResearchGate Reads", 
			value: researchGateReads,
			gradient: "from-purple-500 via-pink-500 to-rose-500",
			description: "Total reads",
			delay: 0.2,
			loading: researchGateLoading,
		},
	], [researchCount, githubStats.totalStars, researchGateReads, repoLoading, researchGateLoading])

	// Research stats
	const researchStats = useMemo(() => [
		{ 
			icon: BookMarked, 
			label: "Publication Reads", 
			value: researchGatePublicationReads,
			gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
			description: "Publication views",
			delay: 0,
			loading: researchGateLoading,
		},
		{ 
			icon: FileText, 
			label: "Full-Text Reads", 
			value: researchGateFullTextReads,
			gradient: "from-blue-500 via-indigo-500 to-purple-500",
			description: "Full-text views",
			delay: 0.1,
			loading: researchGateLoading,
		},
	], [researchGatePublicationReads, researchGateFullTextReads, researchGateLoading])

	// Development stats
	const developmentStats = useMemo(() => [
		{ 
			icon: Code, 
			label: "Projects", 
			value: projectsCount,
			gradient: "from-blue-400 to-sky-500",
			description: "Sub Domain live Production",
			delay: 0,
		},
		{ 
			icon: GitFork, 
			label: "GitHub Forks", 
			value: githubStats.totalForks,
			gradient: "from-blue-400 via-sky-500 to-blue-600",
			description: "Repository forks",
			delay: 0.1,
			loading: repoLoading,
		},
		{ 
			icon: Github, 
			label: "Open Source Repos", 
			value: githubStats.publicRepos,
			gradient: "from-slate-600 via-slate-700 to-slate-800",
			description: "Public repositories",
			delay: 0.2,
			loading: repoLoading,
		},
		{ 
			icon: Layers, 
			label: "Technologies", 
			value: technologiesCount,
			gradient: "from-indigo-500 via-purple-500 to-pink-500",
			description: "Tech stack tools",
			delay: 0.3,
		},
	], [projectsCount, githubStats, technologiesCount, repoLoading])

	// Community stats
	const communityStats = useMemo(() => [
		{ 
			icon: Award, 
			label: "Certifications", 
			value: certificationsCount,
			gradient: "from-yellow-400 via-amber-500 to-yellow-600",
			description: "Professional credentials",
			delay: 0,
		},
		{ 
			icon: Eye, 
			label: "Medium Reads", 
			value: mediumTotalReads,
			gradient: "from-emerald-500 via-teal-500 to-emerald-600",
			description: "Article reads",
			delay: 0.1,
			loading: mediumLoading,
		},
	], [certificationsCount, mediumTotalReads, mediumLoading])

	// Chart data for research
	const researchChartData = useMemo(() => {
		if (researchGateReads === 0) return []
		return [
			{ name: 'Publication Reads', value: researchGatePublicationReads },
			{ name: 'Full-Text Reads', value: researchGateFullTextReads },
			{ name: 'Other Reads', value: researchGateReads - researchGatePublicationReads - researchGateFullTextReads },
		].filter(item => item.value > 0)
	}, [researchGateReads, researchGatePublicationReads, researchGateFullTextReads])

	const researchChartColors = [
		'rgba(139, 92, 246, 0.9)', // purple-500
		'rgba(59, 130, 246, 0.9)',  // blue-500
		'rgba(236, 72, 153, 0.9)',  // pink-500
	]

	// Chart data for development
	const developmentChartData = useMemo(() => {
		if (githubStats.totalStars === 0 && githubStats.totalForks === 0 && projectsCount === 0) return []
		return [
			{ name: 'Projects', value: projectsCount },
			{ name: 'Stars', value: githubStats.totalStars },
			{ name: 'Forks', value: githubStats.totalForks },
			{ name: 'Repos', value: githubStats.publicRepos },
		].filter(item => item.value > 0)
	}, [projectsCount, githubStats])

	const developmentChartColors = [
		'rgba(59, 130, 246, 0.9)',  // blue-500
		'rgba(234, 179, 8, 0.9)',   // yellow-500
		'rgba(6, 182, 212, 0.9)',   // cyan-500
		'rgba(100, 116, 139, 0.9)', // slate-500
	]

	return (
		<section className="relative w-full" aria-label="Impact metrics">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="mb-6 sm:mb-8"
			>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							<span className={PAGE_ICON_CHIP}>
								<Zap className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
							</span>
							<h2 className={PAGE_H1}>{statsTitle}</h2>
						</div>
						<p className={cn(PAGE_LEAD, "max-w-3xl text-sm sm:text-base md:text-lg")}>
							{statsDescription}
						</p>
					</div>
				</div>

				{/* Featured Stats - Large Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 lg:mb-10">
					{featuredStats.map((stat, idx) => (
						<FeaturedStatCard key={idx} stat={stat} index={idx} />
					))}
				</div>
			</motion.div>

			{/* Category Sections */}
			<div className="space-y-6 sm:space-y-8 md:space-y-10">
				{/* Research Section */}
				{researchStats.length > 0 && (
					<CategorySection
						title="Research Reads"
						icon={BookOpen}
						stats={researchStats}
						chartData={researchChartData}
						colors={researchChartColors}
					/>
				)}

				{/* Community Section */}
				<CategorySection
					title="Community & Credentials"
					icon={Users}
					stats={communityStats}
				/>
			</div>
		</section>
	)
})
