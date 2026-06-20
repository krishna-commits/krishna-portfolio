'use client'

import { useState, useMemo, useCallback, memo } from "react"
import { siteConfig } from "config/site"
import useSWR from "swr"
import Image from "next/image"
import { Code, Cloud, Database, Settings, Server, GitBranch, Zap, Shield, Container, Monitor, Search, X, Network, Layers } from "lucide-react"
import { cn } from "app/theme/lib/utils"
import { PAGE_CARD } from "lib/page-layout"

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
		keywords: ["MySQL", "PostgreSQL", "MongoDB", "DynamoDB", "Dynamo DB", "RDS"], 
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
		name: "CI/CD", 
		icon: Settings, 
		keywords: ["GitHub Actions", "Jenkins", "GitLab Pipelines", "Gitlab pipelines", "Bitbucket Pipelines", "AWS CodeBuild", "AWS Codepipeline"], 
		gradient: "from-amber-500 to-yellow-500",
		bgGradient: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
		particleColor: "rgba(245, 158, 11, 0.25)",
		color: "#f59e0b"
	},
	{ 
		name: "Infrastructure as Code (IaC)", 
		icon: Server, 
		keywords: ["Terraform", "Terragrunt", "Cloudformation", "AWS CloudFormation"], 
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
		keywords: ["AWS Lambda", "Amazon EventBridge", "Eventbridge", "DynamoDB Streams", "Dynamodb streams", "AWS Step Functions", "AWS SNS"], 
		gradient: "from-rose-500 to-pink-500",
		bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
		particleColor: "rgba(244, 63, 94, 0.25)",
		color: "#f43f5e"
	},
	{ 
		name: "Networking", 
		icon: Network, 
		keywords: ["Loadbalancer", "Firewalls", "firewalls", "WAF"], 
		gradient: "from-orange-500 to-red-500",
		bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
		particleColor: "rgba(249, 115, 22, 0.25)",
		color: "#f97316"
	},
	{ 
		name: "Communication", 
		icon: Monitor, 
		keywords: ["Slack", "Confluence", "Jira", "jira", "Teams", "Zoom", "Twilio", "Sendgrid"], 
		gradient: "from-blue-500 to-indigo-500",
		bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
		particleColor: "rgba(59, 130, 246, 0.25)",
		color: "#3b82f6"
	},
	{ 
		name: "Message Queue", 
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

const CATEGORY_SHORT_LABELS: Record<string, string> = {
	'Containerization and Orchestration': 'Containers',
	'Infrastructure as Code (IaC)': 'IaC',
	'Software Development Methodologies': 'Agile',
	'Security Tools and Practices': 'Security',
	'Logging and Monitoring': 'Observability',
	'Database Management': 'Databases',
	'Cloud Platforms': 'Cloud',
	'Message Queue': 'Messaging',
	'Version Control': 'Git',
}

const DOMAIN_SUMMARY = ['Cloud Platforms', 'CI/CD', 'Security Tools and Practices', 'Infrastructure as Code (IaC)'] as const

const SKILL_NAME_SHORT: Record<string, string> = {
	'Amazon Web Services': 'AWS',
	'Google Cloud Platform': 'GCP',
	'Azure Services': 'Azure',
	'GitHub Actions': 'GH Actions',
	'Bitbucket Pipelines': 'Bitbucket',
	'Infrastructure as Code (IaC)': 'IaC',
	'Elastic Search': 'Elasticsearch',
	'Fluentd/Fluentbit': 'Fluentbit',
}

function categoryLabel(name: string, short = false): string {
	if (short && CATEGORY_SHORT_LABELS[name]) return CATEGORY_SHORT_LABELS[name]
	return name
}

function skillDisplayName(name: string): string {
	return SKILL_NAME_SHORT[name] ?? name
}

/** Shared generic logos  show monogram so tiles stay distinct */
const GENERIC_SKILL_IMAGES = new Set(["/aws-logo.png", "/agile.png"])

function skillMonogram(name: string): string {
	const stripped = name.replace(/^AWS\s+/i, "").trim()
	const words = stripped.split(/[\s/]+/).filter(Boolean)
	if (words.length === 1) return words[0].slice(0, 3)
	return words.map((w) => w[0]).join("").slice(0, 3).toUpperCase()
}

export const SkillsShowcase = memo(function SkillsShowcase() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const { data: techData } = useSWR<{ technology?: typeof siteConfig.technology_stack }>(
		'/api/homepage/technology',
		(url: string) => fetch(url).then((r) => r.json()),
		{ revalidateOnFocus: true },
	)
	const allSkills = useMemo(
		() =>
			techData?.technology?.length
				? techData.technology
				: siteConfig.technology_stack,
		[techData],
	)

	const categorizeSkill = useCallback((skillName: string): string => {
		const lowerName = skillName.toLowerCase().trim()

		for (const category of categories) {
			if (category.keywords.some((keyword) => lowerName === keyword.toLowerCase())) {
				return category.name
			}
		}

		const keywordMatches = categories.flatMap((category) =>
			category.keywords.map((keyword) => ({ keyword, category: category.name })),
		)
		keywordMatches.sort((a, b) => b.keyword.length - a.keyword.length)

		for (const { keyword, category } of keywordMatches) {
			if (lowerName.includes(keyword.toLowerCase())) {
				return category
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
		return skillsToFilter.filter((skill) =>
			skill.name.toLowerCase().includes(query)
		)
	}, [selectedCategory, categorizedSkills, searchQuery])

	const handleCategoryChange = useCallback((category: string | null) => {
		setSelectedCategory(category)
		setSearchQuery("")
	}, [])

	const sortedCategories = useMemo(() => {
		return Object.entries(categorizedSkills)
			.sort(([, a], [, b]) => b.length - a.length)
			.map(([name]) => name)
	}, [categorizedSkills])

	const domainSummary = useMemo(
		() =>
			DOMAIN_SUMMARY.map((name) => ({
				name,
				label: categoryLabel(name, true),
				count: categorizedSkills[name]?.length ?? 0,
				category: categories.find((c) => c.name === name),
			})).filter((d) => d.count > 0),
		[categorizedSkills],
	)

	return (
		<section id="technology-stack" className="relative w-full" aria-labelledby="technology-stack-heading">
			<div
				className={cn(
					PAGE_CARD,
					'overflow-hidden border-amber-200/60 bg-gradient-to-br from-amber-50/30 via-white to-white p-4 shadow-sm dark:border-border dark:from-amber-950/10 dark:via-card sm:p-5',
				)}
			>
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2.5">
						<span className="inline-flex rounded-lg border border-amber-300/50 bg-amber-100 p-2 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
							<Layers className="h-4 w-4" aria-hidden />
						</span>
						<div>
							<h2 id="technology-stack-heading" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
								Technology Stack
							</h2>
							<p className="text-xs text-muted-foreground sm:text-sm">
								{allSkills.length} tools · cloud · CI/CD · security · observability
							</p>
						</div>
					</div>
					<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200/80 bg-white px-2.5 py-1 text-xs font-bold tabular-nums text-amber-900 shadow-sm dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300">
						<Zap className="h-3 w-3" aria-hidden />
						{allSkills.length}
					</span>
				</div>

				<div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
					<div className="relative min-w-0 flex-1">
						<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
						<input
							type="text"
							placeholder="Search tools…"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-9 w-full rounded-lg border border-amber-200/80 bg-white pl-8 pr-8 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 dark:border-input dark:bg-background"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery('')}
								className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
								aria-label="Clear search"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
					<select
						value={selectedCategory ?? ''}
						onChange={(e) => handleCategoryChange(e.target.value || null)}
						className="h-9 rounded-lg border border-amber-200/80 bg-white px-2.5 text-xs font-medium text-foreground shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 dark:border-input dark:bg-background sm:text-sm"
						aria-label="Filter by domain"
					>
						<option value="">All domains</option>
						{sortedCategories.map((name) => (
							<option key={name} value={name}>
								{categoryLabel(name, true)} ({categorizedSkills[name]?.length ?? 0})
							</option>
						))}
					</select>
				</div>

				{domainSummary.length > 0 && !searchQuery && (
					<div className="mb-4 flex flex-wrap gap-1.5">
						<button
							type="button"
							onClick={() => handleCategoryChange(null)}
							className={cn(
								'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs',
								selectedCategory === null
									? 'border-amber-500 bg-amber-600 text-white'
									: 'border-amber-200/80 bg-white text-slate-600 hover:border-amber-300 dark:border-border dark:bg-card dark:text-muted-foreground',
							)}
						>
							All
						</button>
						{domainSummary.map(({ name, label, category }) => (
							<button
								key={name}
								type="button"
								onClick={() => handleCategoryChange(selectedCategory === name ? null : name)}
								className={cn(
									'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors sm:text-xs',
									selectedCategory === name
										? 'border-amber-500 bg-amber-600 text-white'
										: 'border-amber-200/80 bg-white text-slate-600 hover:border-amber-300 dark:border-border dark:bg-card dark:text-muted-foreground',
								)}
							>
								{category && <category.icon className="h-3 w-3" aria-hidden />}
								{label}
							</button>
						))}
					</div>
				)}

				{filteredSkills.length > 0 ? (
					<div className="flex flex-wrap gap-1">
						{filteredSkills.map((skill, idx) => {
							const category = categories.find((c) => c.name === categorizeSkill(skill.name))
							return <SkillChip key={`${skill.name}-${idx}`} skill={skill} category={category} />
						})}
					</div>
				) : (
					<p className="py-6 text-center text-sm text-muted-foreground">
						No tools match &ldquo;{searchQuery}&rdquo;
					</p>
				)}
			</div>
		</section>
	)
})

const SkillChip = memo(function SkillChip({
	skill,
	category,
}: {
	skill: { name: string; imageUrl?: string }
	category?: Category
}) {
	const [imageError, setImageError] = useState(false)
	const useMonogram = !skill.imageUrl || GENERIC_SKILL_IMAGES.has(skill.imageUrl) || imageError
	const label = skillDisplayName(skill.name)

	return (
		<div
			title={skill.name}
			className={cn(
				'group inline-flex max-w-[9.5rem] items-center gap-1.5 rounded-md border border-slate-200/90 bg-white px-1.5 py-1 shadow-sm transition-all hover:border-amber-400 hover:shadow dark:border-border dark:bg-card',
				category && 'hover:ring-1 hover:ring-amber-200/80',
			)}
		>
			{skill.imageUrl && !useMonogram ? (
				<span className="relative flex h-4 w-4 shrink-0 items-center justify-center sm:h-5 sm:w-5">
					<Image
						src={skill.imageUrl}
						alt=""
						width={20}
						height={20}
						unoptimized
						className="max-h-full max-w-full object-contain"
						onError={() => setImageError(true)}
					/>
				</span>
			) : (
				<span
					className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-50 text-[8px] font-bold text-amber-800 dark:bg-muted dark:text-amber-300 sm:h-5 sm:w-5 sm:text-[9px]"
					aria-hidden
				>
					{skillMonogram(skill.name)}
				</span>
			)}
			<span className="truncate text-[10px] font-medium leading-none text-slate-700 group-hover:text-amber-900 dark:text-foreground dark:group-hover:text-amber-300 sm:text-[11px]">
				{label}
			</span>
		</div>
	)
})
