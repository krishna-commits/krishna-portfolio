'use client'

import { useState, useMemo } from "react"
import { allProjects } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import { Search, ExternalLink, Github, Filter, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "app/theme/lib/utils"
import {
	PAGE_CARD,
	PAGE_FILTER_ACTIVE,
	PAGE_FILTER_INACTIVE,
	PAGE_INPUT,
} from "lib/page-layout"

export default function ProjectsCard() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)

	// Debug: Log projects to console
	// console.log("All Projects:", allProjects)

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
				? (project.title + " " + (project.description || "") + " " + (project.outcome || "")).toLowerCase().includes(searchQuery.toLowerCase())
				: true
			const matchesKeyword = selectedKeyword
				? project.keywords && project.keywords.includes(selectedKeyword)
				: true
			return matchesSearch && matchesKeyword
		})
		}, [sortedProjects, searchQuery, selectedKeyword])

	// Debug: Log filtered projects
	// console.log("Filtered Projects:", filteredProjects)

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
						className={cn(PAGE_INPUT, "pl-8 pr-8")}
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				{allKeywords.length > 0 && (
					<div className="flex items-center gap-1.5 flex-wrap">
						<Filter className="h-3 w-3 text-slate-400" />
						<button
							type="button"
							onClick={() => setSelectedKeyword(null)}
							className={cn(
								"transition-all duration-300",
								selectedKeyword === null ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
							)}
						>
							All
						</button>
						{allKeywords.slice(0, 8).map((keyword) => (
							<button
								key={keyword}
								type="button"
								onClick={() => setSelectedKeyword(keyword)}
								className={cn(
									"transition-all duration-300",
									selectedKeyword === keyword ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
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
				<div className="py-16 text-center">
					<p className="text-sm text-muted-foreground">No projects found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredProjects.map((project: any, index: number) => (
						<motion.div
							key={project._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.4 }}
							whileHover={{ y: -2 }}
							className={cn(PAGE_CARD, "group overflow-hidden transition-shadow hover:shadow-md")}
							data-cursor="pointer"
						>
							{project.link ? (
								<Link
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="no-underline relative block p-4 sm:p-5"
								>
									<div className="mb-3 flex items-start justify-between">
										<div className="rounded-lg border border-border bg-muted p-1.5">
											<Github className="h-3 w-3 text-foreground" aria-hidden />
										</div>
										<ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
									</div>

									<h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
										{project.title}
									</h3>

									{project.outcome && (
										<p className="mb-2 text-xs font-medium leading-snug text-amber-800 dark:text-amber-300">
											{project.outcome}
										</p>
									)}

									{project.description && (
										<p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
											{project.description}
										</p>
									)}

									{project.keywords && project.keywords.length > 0 && (
										<div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
											{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
												<Badge key={kIdx} variant="outline" className="bg-muted/50 text-[10px] font-normal">
													{keyword}
												</Badge>
											))}
										</div>
									)}
								</Link>
							) : (
								<div className="relative p-4 sm:p-5">
									<div className="mb-3 flex items-start justify-between">
										<div className="rounded-lg border border-border bg-muted p-1.5">
											<Github className="h-3 w-3 text-foreground" aria-hidden />
										</div>
									</div>

									<h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">
										{project.title}
									</h3>

									{project.outcome && (
										<p className="mb-2 text-xs font-medium leading-snug text-amber-800 dark:text-amber-300">
											{project.outcome}
										</p>
									)}

									{project.description && (
										<p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
											{project.description}
										</p>
									)}

									{project.keywords && project.keywords.length > 0 && (
										<div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
											{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
												<Badge key={kIdx} variant="outline" className="bg-muted/50 text-[10px] font-normal">
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
