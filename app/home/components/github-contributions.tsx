'use client'

import { motion } from "framer-motion"
import { useGetGithubRepos } from "app/api/github"
import { Github, Star, GitFork, ExternalLink, Code2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "config/site"
import { useMemo } from "react"

export function GitHubContributions() {
	const { repo, repoLoading, repoError } = useGetGithubRepos()

	const githubStats = useMemo(() => {
		if (!repo || repo.length === 0) return null
		const totalStars = repo.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
		const totalForks = repo.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0)
		const publicRepos = repo.length
		const topRepos = repo
			.sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
			.slice(0, 6)
		return { totalStars, totalForks, publicRepos, topRepos }
	}, [repo])

	if (repoLoading) {
		return (
			<section className="w-full">
				<div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />
			</section>
		)
	}

	// Show error state if API fails
	if (repoError || !githubStats) {
		return (
			<section className="relative w-full">
				{/* Header - Compact */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 sm:mb-5"
				>
					<div className="space-y-1.5">
						<div className="inline-flex items-center gap-1.5">
							<div className="p-1.5 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-200 shadow-sm">
								<Code2 className="h-3 w-3 text-white dark:text-slate-900" />
							</div>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-50">
								Open Source
							</h2>
						</div>
						<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
							Real-time GitHub contributions and repository statistics
						</p>
					</div>
				</motion.div>

				{/* Error State */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-6 shadow-sm"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
							<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
						</div>
						<div className="flex-1">
							<p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
								GitHub data temporarily unavailable
							</p>
							<p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
								Please visit GitHub directly to view repositories and contributions.
							</p>
							<Link
								href={siteConfig.links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all touch-target"
							>
								View GitHub Profile
								<ExternalLink className="h-3 w-3" />
							</Link>
						</div>
					</div>
				</motion.div>
			</section>
		)
	}

	const stats = [
		{ icon: Star, label: "Stars", value: githubStats.totalStars, gradient: "from-yellow-400 via-amber-500 to-yellow-600", bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20", description: "Repository stars" }, // Yellow, Gold, Mustard vibrant
		{ icon: GitFork, label: "Forks", value: githubStats.totalForks, gradient: "from-blue-400 to-sky-500", bgGradient: "from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20", description: "Code forks" }, // Light Blue vibrant
		{ icon: Github, label: "Repositories", value: githubStats.publicRepos, gradient: "from-sky-400 to-blue-500", bgGradient: "from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20", description: "Public repos" }, // Light Blue vibrant
	]

	return (
		<section className="relative w-full">
			{/* Header - Compact */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 sm:mb-5"
			>
				<div className="space-y-1.5">
					<div className="inline-flex items-center gap-1.5">
						<div className="p-1.5 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-200 shadow-sm">
							<Code2 className="h-3 w-3 text-white dark:text-slate-900" />
						</div>
						<h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-50">
							Open Source
						</h2>
					</div>
					<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
						Real-time GitHub contributions and repository statistics
					</p>
				</div>
				<Link
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 group touch-target shadow-sm hover:shadow-md"
				>
					View GitHub
					<ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
				</Link>
			</motion.div>

			{/* Stats Grid - Minimal gaps */}
			<div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
				{stats.map((stat, idx) => (
					<StatCard key={idx} stat={stat} index={idx} />
				))}
			</div>

			{/* Top Repositories - Minimal gaps */}
			{githubStats.topRepos.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center gap-1.5">
						<div className="p-1.5 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-200 shadow-sm">
							<Star className="h-3 w-3 text-white dark:text-slate-900" />
						</div>
						<h3 className="text-base sm:text-lg font-light text-slate-900 dark:text-slate-50">
							Top Repositories
						</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
						{githubStats.topRepos.map((repoItem: any, idx: number) => (
							<RepoCard key={repoItem.id || idx} repo={repoItem} index={idx} />
						))}
					</div>
				</div>
			)}
		</section>
	)
}

function StatCard({ stat, index }: { stat: any; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.05, duration: 0.4 }}
			className="group relative"
		>
			<div className={`relative h-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${stat.bgGradient} p-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-slate-300 dark:group-hover:border-slate-700 text-center`}>
				<div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient}`} />
				
				<div className="relative space-y-1.5">
					<div className={`inline-flex p-1.5 rounded-md bg-gradient-to-br ${stat.gradient} shadow-sm mx-auto`}>
						<stat.icon className="h-3 w-3 text-white" />
					</div>
					<div className="space-y-0.5">
						<div className={`text-lg sm:text-xl md:text-2xl font-light bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent leading-none`}>
							{stat.value}
						</div>
						<div className="space-y-0.5">
							<div className="text-[10px] font-semibold text-slate-900 dark:text-slate-50">
								{stat.label}
							</div>
							<div className="text-[9px] text-slate-500 dark:text-slate-500">
								{stat.description}
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

function RepoCard({ repo, index }: { repo: any; index: number }) {
	return (
		<Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block">
			<motion.div
				initial={{ opacity: 0, y: 15 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: index * 0.05 }}
				className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-3 hover:shadow-sm transition-all duration-300"
			>
				<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 to-red-500" />
				<div className="relative space-y-1.5">
					<div className="flex items-start justify-between">
						<div className="space-y-0.5 flex-1 min-w-0">
							<h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
								{repo.name}
							</h4>
							{repo.description && (
								<p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
									{repo.description}
								</p>
							)}
						</div>
						<ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
					</div>
					<div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
						<span className="flex items-center gap-0.5">
							<Star className="h-2.5 w-2.5 text-amber-500" />
							<span className="font-semibold">{repo.stargazers_count || 0}</span>
						</span>
						<span className="flex items-center gap-0.5">
							<GitFork className="h-2.5 w-2.5 text-blue-500" />
							<span className="font-semibold">{repo.forks_count || 0}</span>
						</span>
						{repo.language && (
							<span className="ml-auto bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-[9px] font-medium">
								{repo.language}
							</span>
						)}
					</div>
				</div>
			</motion.div>
		</Link>
	)
}
