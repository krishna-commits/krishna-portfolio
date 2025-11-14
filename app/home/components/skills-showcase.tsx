'use client'

import { useState, useMemo, useCallback, memo, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { siteConfig } from "config/site"
import Image from "next/image"
import { Code, Cloud, Database, Settings, Server, GitBranch, Zap, Shield, Container, Monitor, Search, X, Sparkles, Network, TrendingUp, Layers, Grid, List, BarChart3, ChevronDown, ChevronUp } from "lucide-react"
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
		keywords: ["Sonarcloud", "Sonarqube", "1passsword", "Vault", "Cloudflare"], 
		gradient: "from-red-500 to-orange-500",
		bgGradient: "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
		particleColor: "rgba(239, 68, 68, 0.25)",
		color: "#ef4444"
	},
	{ 
		name: "Ci/Cd Code Repository", 
		icon: Settings, 
		keywords: ["Github Action", "Jenkins", "Gitlab pipelines", "Bitbucket Pipelines", "AWS CodeBuild", "AWS Codepipeline"], 
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
		<section id="technology-stack" className="relative w-full py-6 sm:py-8 lg:py-10" aria-label="Technology stack">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-6 sm:mb-8"
			>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
					<div className="space-y-2">
						<div className="inline-flex items-center gap-2 sm:gap-3">
							<motion.div
								animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
								transition={prefersReducedMotion ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
								className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg"
							>
								<Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
							</motion.div>
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
								Technology Stack
							</h2>
						</div>
						<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
							DevSecOps tools and security technologies I use to build, secure, and monitor cloud infrastructure from code to production
						</p>
					</div>
					<div className="flex items-center gap-3">
						{/* View Mode Toggle */}
						<div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
							<button
								onClick={() => setViewMode('grid')}
								className={cn(
									"p-1.5 rounded-md transition-all duration-200",
									viewMode === 'grid'
										? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
										: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
								)}
								aria-label="Grid view"
							>
								<Grid className="h-3 w-3 sm:h-4 sm:w-4" />
							</button>
							<button
								onClick={() => setViewMode('compact')}
								className={cn(
									"p-1.5 rounded-md transition-all duration-200",
									viewMode === 'compact'
										? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
										: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
								)}
								aria-label="Compact view"
							>
								<Layers className="h-3 w-3 sm:h-4 sm:w-4" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								className={cn(
									"p-1.5 rounded-md transition-all duration-200",
									viewMode === 'list'
										? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
										: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
								)}
								aria-label="List view"
							>
								<List className="h-3 w-3 sm:h-4 sm:w-4" />
							</button>
						</div>
						{/* Total Count Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800 shadow-md"
						>
							<div className="p-1 rounded-md bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
								<Zap className="h-3 w-3 text-white" />
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
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
						<input
							type="text"
							placeholder="Search technologies..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-8 pr-7 py-2 text-xs sm:text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow"
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							>
								<X className="h-3 w-3 text-slate-400" />
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
					className="mb-6"
				>
					<div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => handleCategoryChange(null)}
							className={cn(
								"px-3 py-1.5 text-xs font-semibold transition-all duration-200 border rounded-lg shadow-sm hover:shadow relative overflow-hidden whitespace-nowrap",
								selectedCategory === null
									? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white border-transparent shadow-md"
									: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
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
									key={categoryName}
									whileHover={{ scale: 1.02, y: -2 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => handleCategoryChange(categoryName)}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.02 }}
									className={cn(
										"px-3 py-1.5 text-xs font-semibold transition-all duration-200 border rounded-lg shadow-sm hover:shadow-md flex items-center gap-1.5 relative overflow-hidden whitespace-nowrap",
										selectedCategory === categoryName
											? `bg-gradient-to-r ${category.gradient} text-white border-transparent shadow-lg`
											: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
									)}
								>
									{selectedCategory === categoryName && (
										<motion.div
											layoutId="activeCategory"
											className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-lg`}
											transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
										/>
									)}
									<Icon className="h-3 w-3 flex-shrink-0 relative z-10" />
									<span className="relative z-10">{categoryName}</span>
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
		</section>
	)
})

// Enhanced Skill Card with impressive animations
const SkillCard = memo(function SkillCard({ 
	skill, 
	index, 
	category,
	isHovered,
	onHoverStart,
	onHoverEnd,
	viewMode
}: { 
	skill: any
	index: number
	category?: Category
	isHovered: boolean
	onHoverStart: () => void
	onHoverEnd: () => void
	viewMode: ViewMode
}) {
	const [imageError, setImageError] = useState(false)
	const [rotation, setRotation] = useState({ x: 0, y: 0 })
	const cardRef = useRef<HTMLDivElement>(null)
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const categoryGradient = useMemo(() => category?.gradient || "from-slate-600 to-slate-700", [category])
	const categoryBgGradient = useMemo(() => category?.bgGradient || "from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20", [category])
	const categoryColor = useMemo(() => category?.color || "#64748b", [category])

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current || !isHovered) return
		const rect = cardRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const centerX = rect.width / 2
		const centerY = rect.height / 2
		mouseX.set((x - centerX) / centerX)
		mouseY.set((y - centerY) / centerY)
		const rotateX = ((y - centerY) / centerY) * -8
		const rotateY = ((x - centerX) / centerX) * 8
		setRotation({ x: rotateX, y: rotateY })
	}, [isHovered, mouseX, mouseY])

	const handleMouseLeave = useCallback(() => {
		setRotation({ x: 0, y: 0 })
		mouseX.set(0)
		mouseY.set(0)
		onHoverEnd()
	}, [onHoverEnd, mouseX, mouseY])

	const springConfig = { stiffness: 300, damping: 30 }
	const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), springConfig)
	const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springConfig)

	return (
		<motion.div
			ref={cardRef}
			initial={{ opacity: 0, scale: 0.8, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ 
				delay: index * 0.02, 
				duration: 0.4, 
				ease: [0.21, 1.11, 0.81, 0.99] 
			}}
			whileHover={{ 
				y: viewMode === 'compact' ? -4 : -8, 
				scale: viewMode === 'compact' ? 1.05 : 1.1,
				transition: { duration: 0.3 }
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={onHoverStart}
			onMouseLeave={handleMouseLeave}
			className="group relative"
			style={{
				perspective: "1000px",
			}}
		>
			{/* Glow effect on hover */}
			{isHovered && category && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 0.4, scale: 1.2 }}
					exit={{ opacity: 0, scale: 0.8 }}
					className={`absolute -inset-1.5 bg-gradient-to-br ${categoryGradient} rounded-xl blur-xl opacity-30 -z-10`}
				/>
			)}

			{/* Animated border gradient */}
			{isHovered && category && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={`absolute -inset-0.5 bg-gradient-to-br ${categoryGradient} rounded-xl blur-sm opacity-60 -z-10`}
				/>
			)}
			
			<motion.div
				style={{
					rotateX: isHovered ? rotateX : 0,
					rotateY: isHovered ? rotateY : 0,
					transformStyle: "preserve-3d",
				}}
				className={cn(
					"relative overflow-hidden rounded-lg border bg-white dark:bg-slate-900 p-2 sm:p-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer",
					category
						? `border-slate-200 dark:border-slate-800 group-hover:border-transparent bg-gradient-to-br ${categoryBgGradient}`
						: "border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700",
					"group-hover:shadow-xl group-hover:shadow-slate-200/50 dark:group-hover:shadow-slate-900/50",
					viewMode === 'compact' && "aspect-square p-2",
					viewMode === 'grid' && "aspect-square",
					viewMode === 'list' && "aspect-square"
				)}
			>
				{/* Animated gradient overlay on hover */}
				{isHovered && category && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.15 }}
						exit={{ opacity: 0 }}
						className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} rounded-lg`}
					/>
				)}

				{/* Animated particles around skill on hover */}
				{isHovered && category && viewMode !== 'compact' && (
					<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
						{Array.from({ length: 6 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
								animate={{
									opacity: [0, 1, 0],
									scale: [0, 1.2, 0],
									x: `calc(50% + ${Math.cos((i * Math.PI * 2) / 6) * 30}px)`,
									y: `calc(50% + ${Math.sin((i * Math.PI * 2) / 6) * 30}px)`,
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									delay: i * 0.15,
									ease: "easeOut",
								}}
								className="absolute w-1.5 h-1.5 rounded-full"
								style={{
									background: categoryColor,
									boxShadow: `0 0 8px ${categoryColor}`,
								}}
							/>
						))}
					</div>
				)}
				
				{/* Skill Image or Fallback */}
				<div className="relative z-10">
					{skill.imageUrl && !imageError ? (
						<motion.div
							animate={isHovered ? { 
								scale: viewMode === 'compact' ? 1.1 : 1.2,
								rotate: viewMode === 'compact' ? 0 : [0, 5, -5, 0],
							} : { scale: 1 }}
							transition={{ duration: 0.3 }}
							className={cn(
								"relative flex items-center justify-center",
								viewMode === 'compact' ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
							)}
						>
							<Image
								src={skill.imageUrl}
								alt={skill.name}
								width={viewMode === 'compact' ? 40 : 56}
								height={viewMode === 'compact' ? 40 : 56}
								className="object-contain opacity-90 group-hover:opacity-100 transition-all duration-200"
								onError={() => setImageError(true)}
							/>
							{/* Glow effect on image */}
							{isHovered && category && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 0.5, scale: 1.15 }}
									exit={{ opacity: 0, scale: 0.9 }}
									className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} rounded-full blur-lg -z-10`}
								/>
							)}
						</motion.div>
					) : (
						<motion.div
							animate={isHovered ? { 
								scale: viewMode === 'compact' ? 1.1 : 1.2,
								rotate: viewMode === 'compact' ? 0 : [0, 5, -5, 0],
							} : { scale: 1 }}
							transition={{ duration: 0.3 }}
							className={cn(
								"rounded-lg flex items-center justify-center shadow-md transition-all duration-200 relative overflow-hidden",
								category
									? `bg-gradient-to-br ${categoryGradient}`
									: "bg-slate-200 dark:bg-slate-800",
								viewMode === 'compact' ? "w-8 h-8 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
							)}
						>
							{/* Animated gradient background */}
							{isHovered && category && (
								<motion.div
									animate={{
										backgroundPosition: ["0% 0%", "100% 100%"],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										repeatType: "reverse",
									}}
									className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-60`}
								/>
							)}
							<span className={cn(
								"font-bold transition-colors duration-200 relative z-10",
								category
									? "text-white"
									: "text-slate-700 dark:text-slate-200",
								viewMode === 'compact' ? "text-sm sm:text-base" : "text-base sm:text-lg md:text-xl"
							)}>
								{skill.name.charAt(0).toUpperCase()}
							</span>
						</motion.div>
					)}
				</div>
				
				{/* Skill Name - Only show in grid and list mode */}
				{(viewMode === 'grid' || viewMode === 'list') && (
					<div className="relative z-10 w-full">
						<span className={cn(
							"text-center font-medium leading-tight line-clamp-2 transition-colors duration-200 relative block",
							category
								? "text-slate-900 dark:text-slate-50"
								: "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50",
							viewMode === 'list' ? "text-xs sm:text-sm" : "text-xs"
						)}>
							{skill.name}
							{isHovered && category && (
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: "100%" }}
									exit={{ width: 0 }}
									className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${categoryGradient} rounded-full`}
								/>
							)}
						</span>
					</div>
				)}
				
				{/* Hover indicator - animated dot */}
				{isHovered && category && viewMode !== 'compact' && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 1.5, repeat: Infinity }}
						className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gradient-to-br ${categoryGradient} rounded-full shadow-md z-20`}
					/>
				)}
			</motion.div>
		</motion.div>
	)
}, (prevProps, nextProps) => {
	return (
		prevProps.skill.name === nextProps.skill.name &&
		prevProps.index === nextProps.index &&
		prevProps.category?.name === nextProps.category?.name &&
		prevProps.isHovered === nextProps.isHovered &&
		prevProps.viewMode === nextProps.viewMode
	)
})
