'use client'

import { useState, useMemo } from "react"
import { cn } from "app/theme/lib/utils"
import {
	PAGE_CARD,
	PAGE_FILTER_ACTIVE,
	PAGE_FILTER_INACTIVE,
	PAGE_INPUT,
} from "lib/page-layout"
import { RESEARCH_PILLARS } from "lib/research-pillars"
import { allResearchCores } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import Link from "next/link"
import { ArrowRight, BookOpen, Search, Filter, X, Calendar, TrendingUp, Layers } from "lucide-react"
import { motion } from "framer-motion"

function isPillarIntro(slugAsParams: string) {
	const parts = slugAsParams.split("/")
	return parts.length === 2 && parts[1] === "introduction"
}

function isTopicIntro(slugAsParams: string) {
	const parts = slugAsParams.split("/")
	return parts.length === 3 && parts[2] === "introduction"
}

function topicSlugFromIntro(slugAsParams: string) {
	return slugAsParams.split("/").slice(0, 2).join("/")
}

export default function ResearchCoreCard() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
	const [selectedYear, setSelectedYear] = useState<string | null>(null)
	const [selectedPillar, setSelectedPillar] = useState<string | null>(null)
	const [sortBy, setSortBy] = useState<"date" | "citations" | "title">("date")

	const pillarIntros = useMemo(
		() => allResearchCores.filter((item) => isPillarIntro(item.slugAsParams)),
		[],
	)

	const topicIntros = useMemo(
		() =>
			allResearchCores
				.filter((item) => isTopicIntro(item.slugAsParams))
				.sort((a, b) => (a.order || 0) - (b.order || 0)),
		[],
	)

	const venues = useMemo(() => {
		const venueSet = new Set<string>()
		topicIntros.forEach((item: { venue?: string }) => {
			if (item.venue) venueSet.add(item.venue)
		})
		return Array.from(venueSet).sort()
	}, [topicIntros])

	const years = useMemo(() => {
		const yearSet = new Set<string>()
		topicIntros.forEach((item: { date?: string }) => {
			if (item.date) yearSet.add(new Date(item.date).getFullYear().toString())
		})
		return Array.from(yearSet).sort().reverse()
	}, [topicIntros])

	const filteredTopics = useMemo(() => {
		let filtered = topicIntros.filter((item: any) => {
			const pillar = item.slugAsParams.split("/")[0]
			const matchesSearch = searchQuery
				? (
						item.title +
						" " +
						(item.description || "") +
						" " +
						(item.keywords?.join(" ") || "")
					)
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				: true
			const matchesVenue = selectedVenue ? item.venue === selectedVenue : true
			const matchesYear = selectedYear
				? item.date && new Date(item.date).getFullYear().toString() === selectedYear
				: true
			const matchesPillar = selectedPillar ? pillar === selectedPillar : true
			return matchesSearch && matchesVenue && matchesYear && matchesPillar
		})

		filtered.sort((a: any, b: any) => {
			if (sortBy === "citations") return (b.citationCount || 0) - (a.citationCount || 0)
			if (sortBy === "date") {
				const dateA = a.date ? new Date(a.date).getTime() : 0
				const dateB = b.date ? new Date(b.date).getTime() : 0
				return dateB - dateA
			}
			return a.title.localeCompare(b.title)
		})

		return filtered
	}, [topicIntros, searchQuery, selectedVenue, selectedYear, selectedPillar, sortBy])

	const topicsByPillar = useMemo(() => {
		const map = new Map<string, typeof filteredTopics>()
		for (const pillar of RESEARCH_PILLARS) {
			map.set(
				pillar.slug,
				filteredTopics.filter((t: any) => t.slugAsParams.startsWith(pillar.slug + "/")),
			)
		}
		return map
	}, [filteredTopics])

	const pillarIntroBySlug = useMemo(() => {
		const map = new Map<string, (typeof pillarIntros)[0]>()
		pillarIntros.forEach((p: any) => map.set(p.slugAsParams.split("/")[0], p))
		return map
	}, [pillarIntros])

	return (
		<div className="space-y-6 sm:space-y-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="space-y-3"
			>
				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search research tracks..."
						className={cn(PAGE_INPUT, "pl-8 pr-8")}
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Filter className="h-3 w-3 text-muted-foreground" />
					<span className="text-xs text-muted-foreground">Pillar:</span>
					<button
						type="button"
						onClick={() => setSelectedPillar(null)}
						className={cn(
							"transition-all",
							selectedPillar === null ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
						)}
					>
						All
					</button>
					{RESEARCH_PILLARS.map((pillar) => (
						<button
							key={pillar.slug}
							type="button"
							onClick={() => setSelectedPillar(pillar.slug)}
							className={cn(
								"transition-all",
								selectedPillar === pillar.slug ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
							)}
						>
							{pillar.title}
						</button>
					))}
				</div>

				<div className="flex flex-wrap items-center gap-2 sm:gap-3">
					{venues.length > 0 && (
						<div className="flex flex-wrap items-center gap-1.5">
							<span className="text-xs text-muted-foreground">Venue:</span>
							<button
								type="button"
								onClick={() => setSelectedVenue(null)}
								className={cn(
									selectedVenue === null ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
								)}
							>
								All
							</button>
							{venues.slice(0, 5).map((venue) => (
								<button
									key={venue}
									type="button"
									onClick={() => setSelectedVenue(venue)}
									className={cn(
										selectedVenue === venue ? PAGE_FILTER_ACTIVE : PAGE_FILTER_INACTIVE,
									)}
								>
									{venue}
								</button>
							))}
						</div>
					)}
					<div className="ml-auto">
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

			{RESEARCH_PILLARS.filter(
				(p) => !selectedPillar || p.slug === selectedPillar,
			).map((pillar, pillarIndex) => {
				const topics = topicsByPillar.get(pillar.slug) || []
				const pillarIntro = pillarIntroBySlug.get(pillar.slug)
				if (topics.length === 0 && selectedPillar) return null

				return (
					<section key={pillar.slug} className="space-y-4">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
									<h2 className="text-lg font-semibold text-foreground sm:text-xl">{pillar.title}</h2>
								</div>
								<p className="max-w-3xl text-sm text-muted-foreground">{pillar.description}</p>
							</div>
							{pillarIntro && (
								<Link
									href={pillarIntro.url}
									className="no-underline text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
								>
									Pillar overview →
								</Link>
							)}
						</div>

						{topics.length === 0 ? (
							<p className="text-sm text-muted-foreground">No tracks match your filters in this pillar.</p>
						) : (
							<div className="grid grid-cols-1 gap-3 sm:gap-4">
								{topics.map((item: any, index: number) => (
									<motion.div
										key={item._id || index}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: pillarIndex * 0.05 + index * 0.03, duration: 0.35 }}
									>
										<Link
											href={item.url}
											className={cn(
												PAGE_CARD,
												"group no-underline relative block overflow-hidden transition-shadow hover:shadow-md",
											)}
										>
											<div className="relative space-y-3 p-4 sm:p-5">
												<div className="flex items-start justify-between gap-3">
													<div className="flex min-w-0 flex-1 items-start gap-3">
														<div className="flex-shrink-0 rounded-lg border border-border bg-muted p-1.5">
															<BookOpen className="h-3 w-3 text-foreground" aria-hidden />
														</div>
														<div className="min-w-0 flex-1">
															<h3 className="mb-1.5 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base md:text-lg">
																{item.title}
															</h3>
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
													{item.keywords?.slice(0, 3).map((keyword: string) => (
														<Badge key={keyword} variant="outline" className="bg-muted/50 text-[10px] font-normal">
															{keyword}
														</Badge>
													))}
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
														<Badge className="border-0 bg-amber-600 text-[10px] text-white">Featured</Badge>
													)}
												</div>
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						)}
					</section>
				)
			})}
		</div>
	)
}
