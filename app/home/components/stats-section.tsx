'use client'

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { memo, useMemo, useEffect, useState } from "react"
import { allResearchCores } from "contentlayer/generated"
import { allProjects } from "contentlayer/generated"
import { siteConfig } from "config/site"
import { useGetGithubRepos } from "app/api/github"
import useSWR from 'swr'
import { BookOpen, Code, Award, FileText, Zap, Github, Star, GitFork, TrendingUp, Layers, Eye, Book, BookMarked, MessageSquare, BarChart3, Target, Users, Rocket } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, RadialBarChart, RadialBar, LineChart, Line } from 'recharts'
import { cn } from "app/theme/lib/utils"

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
				"relative h-full overflow-hidden rounded-xl border-2 p-4 sm:p-5 md:p-6 transition-all duration-500",
				"bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950",
				"border-slate-200 dark:border-slate-800",
				"hover:border-transparent hover:shadow-2xl"
			)}>
				{/* Gradient overlay on hover */}
				<div className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 rounded-2xl",
					stat.gradient,
					"group-hover:opacity-10"
				)} />
				
				{/* Content */}
				<div className="relative z-10 space-y-3 sm:space-y-4">
					{/* Icon */}
					<motion.div
						animate={isHovered ? { rotate: [0, -10, 10, -10, 0], scale: 1.1 } : {}}
						transition={{ duration: 0.5 }}
						className={cn(
							"inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-br shadow-md",
							stat.gradient
						)}>
						<stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
					</motion.div>
					
					{/* Value */}
					<div className="space-y-1.5">
						{stat.loading ? (
							<div className={cn(
								"text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br bg-clip-text text-transparent leading-none animate-pulse",
								stat.gradient
							)}>
								--
							</div>
						) : (
							<div className={cn(
								"text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-br bg-clip-text text-transparent leading-none",
								stat.gradient
							)}>
								<AnimatedCounter value={stat.value} />
							</div>
						)}
						<div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50">
							{stat.label}
						</div>
						<div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
							{stat.description}
						</div>
					</div>
				</div>
				
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-800/50 rounded-full blur-3xl -mr-16 -mt-16" />
				<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-100/50 to-transparent dark:from-slate-800/50 rounded-full blur-2xl -ml-12 -mb-12" />
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
			<div className={cn(
				"relative h-full overflow-hidden rounded-lg border-2 p-4 sm:p-5 transition-all duration-300",
				"bg-white dark:bg-slate-900",
				"border-slate-200 dark:border-slate-800",
				"hover:border-transparent hover:shadow-xl"
			)}>
				{/* Top gradient bar */}
				<div className={cn(
					"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300",
					stat.gradient,
					"group-hover:h-1.5"
				)} />
				
				<div className="relative space-y-4">
					{/* Icon */}
					<motion.div
						animate={isHovered ? { rotate: 360 } : {}}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className={cn(
							"inline-flex p-3 rounded-xl bg-gradient-to-br shadow-md transition-all duration-300",
							stat.gradient,
							"group-hover:shadow-lg group-hover:scale-110"
						)}>
						<stat.icon className="h-5 w-5 text-white" />
					</motion.div>
					
					{/* Value and Label */}
					<div className="space-y-2">
						{stat.loading ? (
							<div className={cn(
								"text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent leading-none animate-pulse",
								stat.gradient
							)}>
								--
							</div>
						) : (
							<div className={cn(
								"text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent leading-none",
								stat.gradient
							)}>
								{displayValue.toLocaleString()}
							</div>
						)}
						<div className="space-y-1">
							<div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50">
								{stat.label}
							</div>
							<div className="text-xs text-slate-500 dark:text-slate-400">
								{stat.description}
							</div>
						</div>
					</div>
				</div>
				
				{/* Hover glow effect */}
				<div className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 rounded-xl blur-xl -z-10",
					stat.gradient,
					"group-hover:opacity-20"
				)} />
			</div>
		</motion.div>
	)
}

// Enhanced Donut Chart with Center Metric
function EnhancedDonutChart({ data, colors, centerValue, centerLabel, title }: {
	data: any[]
	colors: string[]
	centerValue?: string | number
	centerLabel?: string
	title: string
}) {
	const total = data.reduce((sum, item) => sum + item.value, 0)
	
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="relative rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
		>
			<h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 text-center">
				{title}
			</h4>
			<div className="relative h-48 sm:h-56">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<defs>
							{colors.map((color, index) => (
								<linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
									<stop offset="0%" stopColor={color} stopOpacity={0.9} />
									<stop offset="100%" stopColor={color} stopOpacity={0.7} />
								</linearGradient>
							))}
						</defs>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={50}
							outerRadius={80}
							paddingAngle={4}
							dataKey="value"
							animationBegin={0}
							animationDuration={800}
							animationEasing="ease-out"
						>
							{data.map((entry, index) => (
								<Cell 
									key={`cell-${index}`} 
									fill={`url(#gradient-${index})`}
									stroke="white"
									strokeWidth={2}
								/>
							))}
						</Pie>
						<Tooltip 
							formatter={(value: number, name: string, props: any) => {
								const percent = ((value / total) * 100).toFixed(1)
								return [`${value.toLocaleString()} (${percent}%)`, name]
							}}
							contentStyle={{
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								border: '1px solid #e2e8f0',
								borderRadius: '8px',
								padding: '8px 12px',
								fontSize: '12px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
				
				{/* Center Content */}
				{centerValue !== undefined && (
					<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
						<div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
							{centerValue.toLocaleString()}
						</div>
						{centerLabel && (
							<div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
								{centerLabel}
							</div>
						)}
					</div>
				)}
			</div>
			
			{/* Legend */}
			<div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
				{data.map((entry, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -10 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
						className="flex items-center gap-1.5"
					>
						<div 
							className="w-3 h-3 rounded-full shadow-sm"
							style={{ backgroundColor: colors[index] }}
						/>
						<span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
							{entry.name}
						</span>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

// Radial Progress Chart
function RadialProgressChart({ data, colors, title }: {
	data: any[]
	colors: string[]
	title: string
}) {
	const maxValue = Math.max(...data.map(item => item.value))
	
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="relative rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
		>
			<h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 text-center">
				{title}
			</h4>
			<div className="h-48 sm:h-56">
				<ResponsiveContainer width="100%" height="100%">
					<RadialBarChart
						innerRadius="40%"
						outerRadius="90%"
						data={data.map((item, index) => ({
							...item,
							fill: colors[index],
							max: maxValue
						}))}
						startAngle={90}
						endAngle={-270}
					>
						<RadialBar
							dataKey="value"
							cornerRadius={6}
							animationBegin={0}
							animationDuration={1000}
							animationEasing="ease-out"
						/>
						<Tooltip 
							formatter={(value: number) => value.toLocaleString()}
							contentStyle={{
								backgroundColor: 'rgba(255, 255, 255, 0.95)',
								border: '1px solid #e2e8f0',
								borderRadius: '8px',
								padding: '8px 12px',
								fontSize: '12px'
							}}
						/>
						<Legend 
							verticalAlign="bottom"
							height={24}
							formatter={(value) => <span style={{ fontSize: '10px', color: '#64748b' }}>{value}</span>}
						/>
					</RadialBarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	)
}

// Category section with enhanced chart
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
			{/* Section Header */}
			<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
				<motion.div
					whileHover={{ rotate: 360, scale: 1.1 }}
					transition={{ duration: 0.6 }}
					className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-md"
				>
					<Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
				</motion.div>
				<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-50">
					{title}
				</h3>
			</div>
			
			{/* Chart and Stats Grid */}
			{chartData && chartData.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					{/* Enhanced Chart */}
					<div className="lg:col-span-1">
						{chartType === 'donut' ? (
							<EnhancedDonutChart
								data={chartData}
								colors={colors || []}
								centerValue={totalValue}
								centerLabel="Total"
								title="Distribution"
							/>
						) : chartType === 'radial' ? (
							<RadialProgressChart
								data={chartData}
								colors={colors || []}
								title="Distribution"
							/>
						) : null}
					</div>
					
					{/* Stats Grid */}
					<div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
						{stats.map((stat, idx) => (
							<StatCard key={idx} stat={stat} index={idx} />
						))}
					</div>
				</div>
			) : (
				/* Stats Grid without Chart */
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
	const certificationsCount = useMemo(() => siteConfig.certification.length, [])
	
	const researchGateCitations = useMemo(
		() => researchGateData?.citations || 0,
		[researchGateData]
	)
	
	const technologiesCount = useMemo(() => siteConfig.technology_stack?.length || 0, [])
	
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
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
					<div className="space-y-4">
						<div className="inline-flex items-center gap-4">
					<motion.div
						animate={{ rotate: [0, 360] }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg"
					>
						<Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
					</motion.div>
							<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
								Impact Metrics
							</h2>
						</div>
						<p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
							Measurable security outcomes, research impact, and engineering achievements demonstrating DevSecOps expertise
						</p>
					</div>
				</div>

				{/* Featured Stats - Large Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8 lg:mb-10">
					{featuredStats.map((stat, idx) => (
						<FeaturedStatCard key={idx} stat={stat} index={idx} />
					))}
				</div>
			</motion.div>

			{/* Category Sections */}
			<div className="space-y-8 sm:space-y-10">
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

				{/* Development Section */}
				<CategorySection
					title="Development & Open Source"
					icon={Code}
					stats={developmentStats}
					chartData={developmentChartData}
					colors={developmentChartColors}
				/>

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
