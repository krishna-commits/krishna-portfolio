'use client'

import { useState, useMemo } from "react"
import { cn } from "app/theme/lib/utils"
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
						className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all"
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
									"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
									selectedVenue === null
										? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
										: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
								)}
							>
								All Venues
							</button>
							{venues.slice(0, 6).map((venue) => (
								<button
									key={venue}
									onClick={() => setSelectedVenue(venue)}
									className={cn(
										"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
										selectedVenue === venue
											? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
											: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
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
									"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
									selectedYear === null
										? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
										: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
								)}
							>
								All Years
							</button>
							{years.slice(0, 6).map((year) => (
								<button
									key={year}
									onClick={() => setSelectedYear(year)}
									className={cn(
										"px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300",
										selectedYear === year
											? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
											: "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
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
							className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all"
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
				<div className="text-center py-16">
					<p className="text-sm text-slate-500 dark:text-slate-400">No research items found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					{filteredItems.map((item: any, index: number) => (
						<motion.div
							key={item._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.4 }}
							whileHover={{ y: -2, scale: 1.01 }}
						>
							<Link
								href={item.url}
								className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 hover:shadow-md transition-all duration-300 block"
							>
								<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
								<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
								
								<div className="p-4 sm:p-5 relative space-y-3">
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-start gap-3 flex-1 min-w-0">
											<div className="p-1.5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex-shrink-0 shadow-sm">
												<BookOpen className="h-3 w-3" />
											</div>
											<div className="flex-1 min-w-0">
												<h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1.5">
                {item.title}
												</h2>
												{item.description && (
													<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
												)}
											</div>
										</div>
										<ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-shrink-0 transition-colors mt-1" />
									</div>

									<div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
										{item.venue && (
											<Badge variant="secondary" className="text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0">
												{item.venue}
											</Badge>
										)}
										{item.citationCount !== undefined && item.citationCount > 0 && (
											<span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full font-semibold">
												<TrendingUp className="h-2.5 w-2.5" />
												{item.citationCount}
											</span>
										)}
										{item.date && (
											<span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
												<Calendar className="h-2.5 w-2.5" />
												{new Date(item.date).getFullYear()}
											</span>
										)}
										{item.highlight && (
											<Badge className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
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
