'use client'

import { useState, useMemo } from "react"
import { allProjects } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import { Search, ExternalLink, Github, Filter, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "app/theme/lib/utils"

export default function ProjectsCard() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

	// Debug: Log projects to console
	console.log("All Projects:", allProjects)

	const sortedProjects = useMemo(() => {
		return [...allProjects].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
	}, [])

	// Extract all unique keywords
	const allKeywords = useMemo(() => {
		const keywords = new Set<string>()
		sortedProjects.forEach((project: any) => {
			if (project.keywords && Array.isArray(project.keywords)) {
				project.keywords.forEach((kw: string) => keywords.add(kw))
			}
		})
		return Array.from(keywords).sort()
	}, [sortedProjects])

	// Filter projects
	const filteredProjects = useMemo(() => {
		return sortedProjects.filter((project: any) => {
			const matchesSearch = searchQuery
				? (project.title + " " + (project.description || "")).toLowerCase().includes(searchQuery.toLowerCase())
				: true
			const matchesKeyword = selectedKeyword
				? project.keywords && project.keywords.includes(selectedKeyword)
				: true
			return matchesSearch && matchesKeyword
		})
		}, [sortedProjects, searchQuery, selectedKeyword])

	// Debug: Log filtered projects
	console.log("Filtered Projects:", filteredProjects)
	console.log("Total Projects:", allProjects.length)

  return (
		<div className="space-y-4 sm:space-y-6">
			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="flex flex-col sm:flex-row gap-2 sm:gap-3"
			>
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
					<input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search projects..."
						className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				{allKeywords.length > 0 && (
					<div className="flex items-center gap-1.5 flex-wrap">
						<Filter className="h-3 w-3 text-slate-400" />
						<button
							onClick={() => setSelectedKeyword(null)}
							className={cn(
								"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
								selectedKeyword === null
									? "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white border-transparent shadow-sm"
									: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
							)}
						>
							All
						</button>
						{allKeywords.slice(0, 8).map((keyword) => (
							<button
								key={keyword}
								onClick={() => setSelectedKeyword(keyword)}
								className={cn(
									"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
									selectedKeyword === keyword
										? "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white border-transparent shadow-sm"
										: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
								)}
							>
								{keyword}
							</button>
						))}
					</div>
				)}
			</motion.div>

			{/* Projects Grid */}
			{filteredProjects.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-sm text-slate-500 dark:text-slate-400">No projects found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
					{filteredProjects.map((project: any, index: number) => (
						<motion.div
							key={project._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.4 }}
							whileHover={{ y: -2, scale: 1.02 }}
							className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 hover:shadow-md transition-all duration-300"
						>
							<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
							<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
							
							{project.link ? (
								<Link
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="block p-4 sm:p-5 relative"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="p-1.5 rounded-md bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow-sm">
											<Github className="h-3 w-3" />
										</div>
										<ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
									</div>
									
									<h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
										{project.title}
									</h3>
									
									{project.description && (
										<p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
											{project.description}
										</p>
									)}

									{project.keywords && project.keywords.length > 0 && (
										<div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
											{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
												<Badge
													key={kIdx}
													variant="secondary"
													className="text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0"
												>
													{keyword}
												</Badge>
											))}
										</div>
									)}
								</Link>
							) : (
								<div className="p-4 sm:p-5 relative">
									<div className="flex items-start justify-between mb-3">
										<div className="p-1.5 rounded-md bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow-sm">
											<Github className="h-3 w-3" />
										</div>
									</div>
									
									<h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-2">
										{project.title}
									</h3>
									
									{project.description && (
										<p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
											{project.description}
										</p>
									)}

									{project.keywords && project.keywords.length > 0 && (
										<div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
											{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
												<Badge
													key={kIdx}
													variant="secondary"
													className="text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0"
												>
													{keyword}
												</Badge>
											))}
										</div>
									)}
								</div>
							)}
						</motion.div>
					))}
				</div>
			)}
      </div>
  )
}
