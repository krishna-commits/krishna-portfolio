'use client'

import { useState, useMemo } from "react"
import { cn } from "app/theme/lib/utils"
import {
	PAGE_CARD,
	PAGE_FILTER_ACTIVE,
	PAGE_FILTER_INACTIVE,
	PAGE_INPUT,
} from "lib/page-layout"
import { allResearchCores } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import Link from "next/link"
import { ArrowRight, BookOpen, Search, Filter, X, Calendar, Quote, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function ResearchCoreCard() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
	const [selectedYear, setSelectedYear] = useState<string | null>(null)
	const [sortBy, setSortBy] = useState<"date" | "citations" | "title">("date")

	const sortedCheatsheets = allResearchCores.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
	const topLevelItems = sortedCheatsheets.filter((item: any) => item.parent == null && item.grand_parent == null)

	// Extract unique venues and years
	const venues = useMemo(() => {
		const venueSet = new Set<string>()
		topLevelItems.forEach((item: any) => {
			if (item.venue) venueSet.add(item.venue)
		})
		return Array.from(venueSet).sort()
	}, [topLevelItems])

	const years = useMemo(() => {
		const yearSet = new Set<string>()
		topLevelItems.forEach((item: any) => {
			if (item.date) {
				const year = new Date(item.date).getFullYear().toString()
				yearSet.add(year)
			}
		})
		return Array.from(yearSet).sort().reverse()
	}, [topLevelItems])

	// Filter and sort
	const filteredItems = useMemo(() => {
		let filtered = topLevelItems.filter((item: any) => {
			const matchesSearch = searchQuery
				? (item.title + " " + (item.description || "")).toLowerCase().includes(searchQuery.toLowerCase())
				: true
			const matchesVenue = selectedVenue ? item.venue === selectedVenue : true
			const matchesYear = selectedYear
				? item.date && new Date(item.date).getFullYear().toString() === selectedYear
				: true
			return matchesSearch && matchesVenue && matchesYear
		})

		// Sort
		filtered.sort((a: any, b: any) => {
			if (sortBy === "citations") {
				return (b.citationCount || 0) - (a.citationCount || 0)
			} else if (sortBy === "date") {
				const dateA = a.date ? new Date(a.date).getTime() : 0
				const dateB = b.date ? new Date(b.date).getTime() : 0
				return dateB - dateA
			} else {
				return a.title.localeCompare(b.title)
			}
		})

		return filtered
	}, [topLevelItems, searchQuery, selectedVenue, selectedYear, sortBy])

  return (
		<div className="space-y-4 sm:space-y-6">
			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="space-y-3"
			>
				{/* Search */}
				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
					<input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search research..."
						className={cn(PAGE_INPUT, "pl-8 pr-8")}
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

				{/* Filter Row */}
				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					<div className="flex items-center gap-1.5">
						<Filter className="h-3 w-3 text-slate-400" />
						<span className="text-xs text-slate-600 dark:text-slate-400">Filter:</span>
					</div>

					{/* Venue Filter */}
					{venues.length > 0 && (
						<div className="flex items-center gap-1.5 flex-wrap">
							<button
								onClick={() => setSelectedVenue(null)}
								className={cn(
									"transition-all duration-300",
									selectedVenue === null ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
								)}
							>
								All Venues
							</button>
							{venues.slice(0, 6).map((venue) => (
								<button
									key={venue}
									onClick={() => setSelectedVenue(venue)}
									className={cn(
										"transition-all duration-300",
										selectedVenue === venue ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
									)}
								>
									{venue}
								</button>
							))}
						</div>
					)}

					{/* Year Filter */}
					{years.length > 0 && (
						<div className="flex items-center gap-1.5 flex-wrap">
							<button
								onClick={() => setSelectedYear(null)}
								className={cn(
									"transition-all duration-300",
									selectedYear === null ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
								)}
							>
								All Years
							</button>
							{years.slice(0, 6).map((year) => (
								<button
									key={year}
									onClick={() => setSelectedYear(year)}
									className={cn(
										"transition-all duration-300",
										selectedYear === year ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
									)}
								>
									{year}
								</button>
							))}
						</div>
					)}

					{/* Sort */}
					<div className="ml-auto flex items-center gap-2">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "date" | "citations" | "title")}
							className={PAGE_INPUT}
						>
							<option value="date">Sort by Date</option>
							<option value="citations">Sort by Citations</option>
							<option value="title">Sort by Title</option>
						</select>
					</div>
				</div>
			</motion.div>

			{/* Research Items */}
			{filteredItems.length === 0 ? (
				<div className="py-16 text-center">
					<p className="text-sm text-muted-foreground">No research items found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					{filteredItems.map((item: any, index: number) => (
						<motion.div
							key={item._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.4 }}
							whileHover={{ y: -2 }}
						>
							<Link
								href={item.url}
								className={cn(
									PAGE_CARD,
									"group no-underline relative block overflow-hidden transition-shadow hover:shadow-md",
								)}
								data-cursor="pointer"
							>
								<div className="relative space-y-3 p-4 sm:p-5">
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 flex-1 items-start gap-3">
											<div className="flex-shrink-0 rounded-lg border border-border bg-muted p-1.5">
												<BookOpen className="h-3 w-3 text-foreground" aria-hidden />
											</div>
											<div className="min-w-0 flex-1">
												<h2 className="mb-1.5 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base md:text-lg">
													{item.title}
												</h2>
												{item.description && (
													<p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
														{item.description}
													</p>
												)}
											</div>
										</div>
										<ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
									</div>

									<div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
										{item.venue && (
											<Badge variant="outline" className="bg-muted/50 text-[10px] font-normal">
												{item.venue}
											</Badge>
										)}
										{item.citationCount !== undefined && item.citationCount > 0 && (
											<span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
												<TrendingUp className="h-2.5 w-2.5" aria-hidden />
												{item.citationCount}
											</span>
										)}
										{item.date && (
											<span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
												<Calendar className="h-2.5 w-2.5" aria-hidden />
												{new Date(item.date).getFullYear()}
											</span>
										)}
										{item.highlight && (
											<Badge className="border-0 bg-amber-600 text-[10px] text-white">
												Featured
											</Badge>
										)}
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			)}
      </div>
  )
}
