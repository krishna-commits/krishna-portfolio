"use client"

import { Badge } from "app/theme/components/ui/badge"
import moment from "moment"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, ArrowRight, Clock, BookOpen } from "lucide-react"
import { StaggerContainer, StaggerItem } from "../components/scroll-animations"
import { CopyrightFooter } from "../components/copyright-footer"
import { ReadingTime, ShareButtons, RelatedArticles } from "../components/blog-enhancements"
import { PullToRefresh } from "../components/mobile-interactions"

export default function BlogPage() {
	const [posts, setPosts] = useState<any[]>([])
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(
					`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@neupane.krishna33`
				)
				
				if (!response.ok) {
					throw new Error('Failed to fetch posts')
				}
				
				const data = await response.json()
				setPosts(data.items || [])
				setError(null)
			} catch (err) {
				setError('Failed to load blog posts. Please try again later.')
				setPosts([])
			} finally {
				setLoading(false)
			}
		}
		fetchPosts()
	}, [])

	const estimateReadingMinutes = (text: string) => {
		if (!text) return 3
		const words = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
		return Math.max(1, Math.round(words / 200))
	}

	const filteredPosts = posts.filter((post) =>
		post.title?.toLowerCase().includes(searchQuery.toLowerCase())
	)

	if (loading) {
		return (
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
				<div className="space-y-8">
					<div className="space-y-3">
						<div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
						<div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
					</div>
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />
						))}
					</div>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
				<div className="text-center py-16">
					<p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-xs sm:text-sm"
					>
						Retry
					</button>
				</div>
			</main>
		)
	}

	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-4 mb-8 sm:mb-10"
			>
				<div className="space-y-2">
					<div className="inline-flex items-center gap-1.5 mb-2">
						<div className="p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 shadow-sm">
							<BookOpen className="h-3 w-3 text-white" />
						</div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
							Writing
						</h1>
					</div>
					<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
						Technical insights, research reflections, and engineering practices documented for continuous learning and knowledge sharing.
					</p>
				</div>

				{/* Search */}
				<div className="relative pt-2">
					<label htmlFor="blog-search" className="sr-only">
						Search articles
					</label>
					<Search className="absolute left-2.5 top-6 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
					<input
						id="blog-search"
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search articles..."
						aria-label="Search blog articles"
						className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm border-b border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							aria-label="Clear search"
							className="absolute right-2.5 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 touch-target transition-colors"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			</motion.div>

			{/* Posts */}
			<div className="space-y-0.5">
				{filteredPosts.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-sm text-slate-500 dark:text-slate-400">
							{searchQuery ? 'No articles found matching your search.' : 'No articles available yet.'}
						</p>
					</div>
				) : (
					<StaggerContainer staggerDelay={0.05}>
						{filteredPosts.map((post, idx) => (
							<StaggerItem key={post.guid} variant="slide-up">
								<motion.article
									whileHover={{ x: 4, scale: 1.01 }}
									className="group border-b border-slate-200 dark:border-slate-800 py-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 hover:shadow-md transition-all duration-300 rounded-lg px-2 -mx-2"
								>
							<Link
								href={post?.link ? new URL(post.link).toString() : '/'}
								target="_blank"
								rel="noopener noreferrer"
								className="block"
								aria-label={`Read article: ${post.title}`}
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 space-y-2.5">
										<div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
											<time dateTime={post.pubDate}>
												{moment(post.pubDate).format("MMM D, YYYY")}
											</time>
											<span aria-hidden="true">·</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" aria-hidden="true" />
												{estimateReadingMinutes(post.content || post.contentSnippet)} min read
											</span>
										</div>
										<h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
											{post?.title}
										</h2>
										{post.categories && post.categories.length > 0 && (
											<div className="flex flex-wrap items-center gap-1.5">
												{post.categories.slice(0, 3).map((cat: string) => (
													<Badge
														key={cat}
														variant="secondary"
														className="text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0"
													>
														{cat}
													</Badge>
												))}
											</div>
										)}
									</div>
									<ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" aria-hidden="true" />
								</div>
							</Link>
						</motion.article>
						</StaggerItem>
					))}
					</StaggerContainer>
				)}
			</div>

			{/* Copyright Footer */}
			<CopyrightFooter />
		</main>
	)
}
