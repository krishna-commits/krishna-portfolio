'use client'

import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { siteConfig } from "config/site"
import Image from "next/image"
import { Code, Cloud, Database, Settings, Server, GitBranch, Zap, Shield, Container, Monitor, Search, X, Network, Layers, Grid, List, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "app/theme/lib/utils"
import { Badge } from "app/theme/components/ui/badge"

type Category = {
	name: string
	icon: React.ComponentType<{ className?: string }>
	keywords: string[]
	gradient: string
	bgGradient: string
	particleColor: string
	color: string
}

const categories: Category[] = [
	{ 
		name: "Scripting", 
		icon: Code, 
		keywords: ["Python", "Bash"], 
		gradient: "from-blue-500 to-sky-500",
		bgGradient: "from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
		particleColor: "rgba(59, 130, 246, 0.25)",
		color: "#3b82f6"
	},
	{ 
		name: "Version Control", 
		icon: GitBranch, 
		keywords: ["Git"], 
		gradient: "from-slate-600 to-slate-700",
		bgGradient: "from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20",
		particleColor: "rgba(71, 85, 105, 0.25)",
		color: "#475569"
	},
	{ 
		name: "Containerization and Orchestration", 
		icon: Container, 
		keywords: ["Docker", "Kubernetes", "Helm Chart", "AWS ECS", "Azure Container Apps"], 
		gradient: "from-blue-500 to-cyan-500",
		bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
		particleColor: "rgba(6, 182, 212, 0.25)",
		color: "#06b6d4"
	},
	{ 
		name: "Cloud Platforms", 
		icon: Cloud, 
		keywords: ["Amazon Web Services", "Azure Services", "Google Cloud Platform", "Heroku"], 
		gradient: "from-yellow-400 via-amber-500 to-orange-500",
		bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
		particleColor: "rgba(250, 204, 21, 0.25)",
		color: "#facc15"
	},
	{ 
		name: "Database Management", 
		icon: Database, 
		keywords: ["MySQL", "PostgreSQL", "MongoDB", "Dynamo DB", "RDS"], 
		gradient: "from-indigo-500 to-blue-500",
		bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
		particleColor: "rgba(99, 102, 241, 0.25)",
		color: "#6366f1"
	},
	{ 
		name: "Security Tools and Practices", 
		icon: Shield, 
		keywords: ["Sonarcloud", "Sonarqube", "1Password", "Vault", "Cloudflare"], 
		gradient: "from-red-500 to-orange-500",
		bgGradient: "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
		particleColor: "rgba(239, 68, 68, 0.25)",
		color: "#ef4444"
	},
	{ 
		name: "Ci/Cd Code Repository", 
		icon: Settings, 
		keywords: ["GitHub Actions", "Jenkins", "Gitlab pipelines", "Bitbucket Pipelines", "AWS CodeBuild", "AWS Codepipeline"], 
		gradient: "from-amber-500 to-yellow-500",
		bgGradient: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
		particleColor: "rgba(245, 158, 11, 0.25)",
		color: "#f59e0b"
	},
	{ 
		name: "Infranstracture as Code (IAC)", 
		icon: Server, 
		keywords: ["Terraform", "Terragrunt", "Cloudformation"], 
		gradient: "from-violet-500 to-purple-500",
		bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
		particleColor: "rgba(139, 92, 246, 0.25)",
		color: "#8b5cf6"
	},
	{ 
		name: "Logging and Monitoring", 
		icon: Monitor, 
		keywords: ["Elastic Search", "Fluentd/Fluentbit", "Kibana", "Prometheus", "Grafana", "AlertManager", "Cloudwatch", "Loki stack"], 
		gradient: "from-emerald-500 to-teal-500",
		bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
		particleColor: "rgba(16, 185, 129, 0.25)",
		color: "#10b981"
	},
	{ 
		name: "Serverless", 
		icon: Zap, 
		keywords: ["AWS Lambda", "Eventbridge", "Dynamodb streams", "AWS Step Functions", "AWS SNS"], 
		gradient: "from-rose-500 to-pink-500",
		bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
		particleColor: "rgba(244, 63, 94, 0.25)",
		color: "#f43f5e"
	},
	{ 
		name: "Networking", 
		icon: Network, 
		keywords: ["Loadbalancer", "firewalls", "WAF"], 
		gradient: "from-orange-500 to-red-500",
		bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
		particleColor: "rgba(249, 115, 22, 0.25)",
		color: "#f97316"
	},
	{ 
		name: "Communication", 
		icon: Monitor, 
		keywords: ["Slack", "Confluence", "jira", "Teams", "Zoom", "Twilio", "Sendgrid"], 
		gradient: "from-blue-500 to-indigo-500",
		bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
		particleColor: "rgba(59, 130, 246, 0.25)",
		color: "#3b82f6"
	},
	{ 
		name: "Message Queqe", 
		icon: Database, 
		keywords: ["Kafka", "RabbitMQ", "Redis", "AWS SQS"], 
		gradient: "from-cyan-500 to-blue-500",
		bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20",
		particleColor: "rgba(6, 182, 212, 0.25)",
		color: "#06b6d4"
	},
	{ 
		name: "Software Development Methodologies", 
		icon: Code, 
		keywords: ["Scrum", "Kanban", "Agile"], 
		gradient: "from-green-500 to-emerald-500",
		bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
		particleColor: "rgba(34, 197, 94, 0.25)",
		color: "#22c55e"
	}
]

type ViewMode = 'grid' | 'compact' | 'list'

export const SkillsShowcase = memo(function SkillsShowcase() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const allSkills = useMemo(() => siteConfig.technology_stack, [])

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	/* Calmer default on first paint for small screens */
	useEffect(() => {
		if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
			setViewMode("compact")
		}
	}, [])

	const categorizeSkill = useCallback((skillName: string): string => {
		const lowerName = skillName.toLowerCase()
		for (const category of categories) {
			if (category.keywords.some(keyword => lowerName.includes(keyword.toLowerCase()))) {
				return category.name
			}
		}
		return "Other"
	}, [])

	const categorizedSkills = useMemo(
		() => allSkills.reduce((acc: Record<string, typeof allSkills>, skill) => {
			const category = categorizeSkill(skill.name)
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(skill)
			return acc
		}, {}),
		[allSkills, categorizeSkill]
	)

	const filteredSkills = useMemo(() => {
		const skillsToFilter = selectedCategory 
			? categorizedSkills[selectedCategory] || []
			: Object.values(categorizedSkills).flat()

		if (!searchQuery) return skillsToFilter

		const query = searchQuery.toLowerCase()
		return skillsToFilter.filter((skill: any) =>
			skill.name.toLowerCase().includes(query)
		)
	}, [selectedCategory, categorizedSkills, searchQuery])

	const displayedCategories = useMemo(
		() => {
			if (selectedCategory) {
				return { [selectedCategory]: filteredSkills }
			}
			const grouped: Record<string, typeof allSkills> = {}
			filteredSkills.forEach((skill: any) => {
				const category = categorizeSkill(skill.name)
				if (!grouped[category]) {
					grouped[category] = []
				}
				grouped[category].push(skill)
			})
			return grouped
		},
		[selectedCategory, filteredSkills, categorizeSkill]
	)

	const handleCategoryChange = useCallback((category: string | null) => {
		setSelectedCategory(category)
		setSearchQuery("")
	}, [])

	const toggleCategory = useCallback((categoryName: string) => {
		setExpandedCategories(prev => {
			const next = new Set(prev)
			if (next.has(categoryName)) {
				next.delete(categoryName)
			} else {
				next.add(categoryName)
			}
			return next
		})
	}, [])

	const activeCategory = useMemo(() => 
		selectedCategory ? categories.find(c => c.name === selectedCategory) : undefined,
		[selectedCategory]
	)

	// Sort categories by skill count
	const sortedCategories = useMemo(() => {
		return Object.entries(categorizedSkills)
			.sort(([, a], [, b]) => b.length - a.length)
			.map(([name]) => name)
	}, [categorizedSkills])

	return (
		<section id="technology-stack" className="relative w-full" aria-labelledby="technology-stack-heading">
			<div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm p-4 sm:p-6 md:p-8">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-6 sm:mb-8"
			>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 mb-4 sm:mb-5">
					<div className="space-y-2 sm:space-y-3">
						<div className="inline-flex items-center gap-2 sm:gap-3">
							<div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/50">
								<Layers className="h-5 w-5" aria-hidden />
							</div>
							<h2 id="technology-stack-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
								Technology Stack
							</h2>
						</div>
						<p className="text-sm sm:text-base text-muted-foreground max-w-prose leading-relaxed">
							DevSecOps tools and security technologies I use to build, secure, and monitor cloud infrastructure from code to production
						</p>
					</div>
					<div className="flex items-center gap-3">
						{/* View Mode Toggle */}
						<div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 dark:bg-muted/30 border border-border">
							<button
								type="button"
								onClick={() => setViewMode('grid')}
								className={cn(
									"inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 rounded-lg transition-colors duration-200",
									viewMode === 'grid'
										? "bg-card text-foreground shadow-sm border border-border"
										: "text-muted-foreground hover:text-foreground"
								)}
								aria-label="Grid view"
							>
								<Grid className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode('compact')}
								className={cn(
									"inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 rounded-lg transition-colors duration-200",
									viewMode === 'compact'
										? "bg-card text-foreground shadow-sm border border-border"
										: "text-muted-foreground hover:text-foreground"
								)}
								aria-label="Compact view"
							>
								<Layers className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode('list')}
								className={cn(
									"inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-10 sm:min-w-10 rounded-lg transition-colors duration-200",
									viewMode === 'list'
										? "bg-card text-foreground shadow-sm border border-border"
										: "text-muted-foreground hover:text-foreground"
								)}
								aria-label="List view"
							>
								<List className="h-4 w-4" />
							</button>
						</div>
						{/* Total Count Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card shadow-sm"
						>
							<div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
								<Zap className="h-3.5 w-3.5" />
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-none">{allSkills.length}</span>
								<span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Tech</span>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Search Bar */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.1 }}
					className="relative mb-4"
				>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-4 sm:w-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search technologies..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-9 sm:pl-12 sm:pr-10 py-3 sm:py-3 text-sm sm:text-base rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-11 shadow-sm"
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target"
							>
								<X className="h-4 w-4 text-slate-400" />
							</button>
						)}
					</div>
				</motion.div>

				{/* Category Filters - Horizontal Scrollable */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.15 }}
					className="mb-4 sm:mb-6"
				>
					<div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0">
						<motion.button
							type="button"
							whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
							whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
							onClick={() => handleCategoryChange(null)}
							className={cn(
								"px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 border rounded-xl shadow-sm whitespace-nowrap min-h-11 inline-flex items-center",
								selectedCategory === null
									? "bg-amber-600 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-500"
									: "bg-card text-muted-foreground border-border hover:bg-muted/60"
							)}
						>
							<span className="relative flex items-center gap-1.5">
								<Zap className="h-3 w-3" />
								<span>All</span>
								<Badge variant="secondary" className={cn(
									"text-xs font-bold px-1.5 py-0",
									selectedCategory === null
										? "bg-white/20 text-white"
										: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
								)}>
									{allSkills.length}
								</Badge>
							</span>
						</motion.button>
						{sortedCategories.map((categoryName, idx) => {
							const category = categories.find(c => c.name === categoryName)
							if (!category) return null
							const Icon = category.icon
							const skillCount = categorizedSkills[categoryName]?.length || 0
							return (
								<motion.button
									type="button"
									key={categoryName}
									whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
									whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
									onClick={() => handleCategoryChange(categoryName)}
									initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
									animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.02 }}
									className={cn(
										"px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 border rounded-xl shadow-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap min-h-11",
										selectedCategory === categoryName
											? "bg-amber-600 text-white border-amber-600 dark:bg-amber-600"
											: "bg-card text-muted-foreground border-border hover:bg-muted/60"
									)}
								>
									<Icon className="h-3.5 w-3.5 flex-shrink-0" />
									<span>{categoryName}</span>
									<Badge variant="secondary" className={cn(
										"text-xs font-bold px-1.5 py-0 relative z-10",
										selectedCategory === categoryName
											? "bg-white/20 text-white"
											: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
									)}>
										{skillCount}
									</Badge>
								</motion.button>
							)
						})}
					</div>
				</motion.div>
			</motion.div>

			{/* Skills Display - Dynamic based on view mode */}
			<AnimatePresence mode="wait">
				{Object.keys(displayedCategories).length > 0 ? (
					<motion.div
						key={`${selectedCategory || 'all'}-${viewMode}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4 }}
						className="space-y-6 sm:space-y-8"
					>
						{Object.entries(displayedCategories).map(([categoryName, skills]) => {
							const category = categories.find(c => c.name === categoryName)
							if (!skills || skills.length === 0) return null
							
							const isExpanded = expandedCategories.has(categoryName) || selectedCategory === categoryName
							const displaySkills = viewMode === 'list' && !isExpanded ? skills.slice(0, 6) : skills
							const hasMore = viewMode === 'list' && !isExpanded && skills.length > 6
							
							return (
								<motion.div
									key={categoryName}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="space-y-4"
								>
									{!selectedCategory && category && (
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.25 }}
											className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800"
										>
											<div className="flex items-center gap-3">
												<div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}>
													<category.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
												</div>
												<div>
													<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-50 mb-0.5">
														{categoryName}
													</h3>
													<p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
														{skills.length} {skills.length === 1 ? 'technology' : 'technologies'}
													</p>
												</div>
											</div>
											{viewMode === 'list' && !selectedCategory && (
												<button
													onClick={() => toggleCategory(categoryName)}
													className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
												>
													{isExpanded ? (
														<ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
													) : (
														<ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
													)}
												</button>
											)}
										</motion.div>
									)}
									<div className={cn(
										"grid gap-3 sm:gap-4",
										viewMode === 'grid' && "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8",
										viewMode === 'compact' && "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12",
										viewMode === 'list' && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
									)}>
										<AnimatePresence>
											{displaySkills.map((skill: any, idx: number) => (
												<SkillCard 
													key={`${categoryName}-${skill.name}-${idx}`} 
													skill={skill} 
													index={idx} 
													category={category}
													isHovered={hoveredSkill === skill.name}
													onHoverStart={() => setHoveredSkill(skill.name)}
													onHoverEnd={() => setHoveredSkill(null)}
													viewMode={viewMode}
													prefersReducedMotion={prefersReducedMotion}
												/>
											))}
										</AnimatePresence>
										{hasMore && (
											<motion.button
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => toggleCategory(categoryName)}
												className={cn(
													"aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center",
													viewMode === 'list' && "col-span-full"
												)}
											>
												<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
													+{skills.length - 6} more
												</span>
											</motion.button>
										)}
									</div>
								</motion.div>
							)
						})}
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-center py-12"
					>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							No technologies found matching "{searchQuery}"
						</p>
					</motion.div>
				)}
			</AnimatePresence>
			</div>
		</section>
	)
})

// Skill cards: single surface style (border + soft shadow), minimal motion
const SkillCard = memo(function SkillCard({
	skill,
	index,
	category,
	isHovered,
	onHoverStart,
	onHoverEnd,
	viewMode,
	prefersReducedMotion,
}: {
	skill: any
	index: number
	category?: Category
	isHovered: boolean
	onHoverStart: () => void
	onHoverEnd: () => void
	viewMode: ViewMode
	prefersReducedMotion: boolean
}) {
	const [imageError, setImageError] = useState(false)
	const categoryBgGradient = useMemo(
		() => category?.bgGradient || "from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40",
		[category]
	)

	return (
		<motion.div
			initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
			animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
			transition={{ delay: index * 0.015, duration: prefersReducedMotion ? 0 : 0.35 }}
			whileHover={prefersReducedMotion ? undefined : { y: -2 }}
			onMouseEnter={onHoverStart}
			onMouseLeave={onHoverEnd}
			className="group"
		>
			<div
				className={cn(
					"relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-sm transition-shadow duration-200 hover:shadow-md",
					category && `bg-gradient-to-br ${categoryBgGradient}`,
					viewMode === "compact" && "aspect-square p-2",
					(viewMode === "grid" || viewMode === "list") && "aspect-square"
				)}
			>
				<div className="relative z-10">
					{skill.imageUrl && !imageError ? (
						<div
							className={cn(
								"relative flex items-center justify-center",
								viewMode === "compact"
									? "h-8 w-8 sm:h-10 sm:w-10"
									: "h-10 w-10 sm:h-12 sm:h-12 md:h-14 md:w-14"
							)}
						>
							<Image
								src={skill.imageUrl}
								alt={skill.name}
								width={viewMode === "compact" ? 40 : 56}
								height={viewMode === "compact" ? 40 : 56}
								unoptimized
								className="object-contain opacity-90 transition-opacity duration-200 group-hover:opacity-100"
								onError={() => setImageError(true)}
							/>
						</div>
					) : (
						<div
							className={cn(
								"flex items-center justify-center rounded-xl border border-border bg-muted font-semibold text-muted-foreground",
								viewMode === "compact"
									? "h-8 w-8 sm:h-10 sm:w-10 text-sm sm:text-base"
									: "h-10 w-10 sm:h-12 sm:text-lg md:h-14 md:w-14"
							)}
						>
							{skill.name.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				{(viewMode === "grid" || viewMode === "list") && (
					<div className="relative z-10 w-full">
						<span
							className={cn(
								"line-clamp-2 block text-center font-medium leading-tight text-foreground",
								viewMode === "list" ? "text-xs sm:text-sm" : "text-xs"
							)}
						>
							{skill.name}
						</span>
					</div>
				)}
			</div>
		</motion.div>
	)
}, (prevProps, nextProps) => {
	return (
		prevProps.skill.name === nextProps.skill.name &&
		prevProps.index === nextProps.index &&
		prevProps.category?.name === nextProps.category?.name &&
		prevProps.isHovered === nextProps.isHovered &&
		prevProps.viewMode === nextProps.viewMode &&
		prevProps.prefersReducedMotion === nextProps.prefersReducedMotion
	)
})
