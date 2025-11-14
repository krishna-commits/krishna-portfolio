'use client'

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText, BookOpen, Code, ArrowRight, Filter, Clock } from "lucide-react"
import { allResearchCores, allProjects, allBlogPosts } from "contentlayer/generated"
import useSWR from 'swr'
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

type SearchResult = {
	type: 'research' | 'project' | 'blog'
	title: string
	description?: string
	url: string
	content?: string
	tags?: string[]
	date?: string
	score?: number
}

export function GlobalSearch() {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchResult[]>([])
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [searchType, setSearchType] = useState<'all' | 'research' | 'project' | 'blog'>('all')
	const searchRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	// Keyboard shortcut: Cmd/Ctrl + K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setIsOpen(true)
			}
			if (e.key === 'Escape') {
				setIsOpen(false)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			return () => document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	// Advanced search with API
	useEffect(() => {
		if (!query.trim()) {
			setResults([])
			return
		}

			// Debounce search
			const timeoutId = setTimeout(async () => {
				try {
					const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=10`)
					if (!response.ok) {
						throw new Error('Search failed')
					}
					const data = await response.json()
					setResults(data.results || [])
					setSelectedIndex(0)
				} catch (error) {
				console.error('Search error:', error)
				// Fallback to client-side search
				const searchResults: SearchResult[] = []
				const lowerQuery = query.toLowerCase()

				// Search Research Core
				allResearchCores
					.filter((r: any) => r.parent == null && r.grand_parent == null)
					.forEach((item: any) => {
						if (
							item.title?.toLowerCase().includes(lowerQuery) ||
							item.description?.toLowerCase().includes(lowerQuery)
						) {
							searchResults.push({
								type: 'research',
								title: item.title,
								description: item.description,
								url: item.url,
							})
						}
					})

				// Search Projects
				allProjects.forEach((item: any) => {
					if (
						item.title?.toLowerCase().includes(lowerQuery) ||
						item.description?.toLowerCase().includes(lowerQuery)
					) {
						searchResults.push({
							type: 'project',
							title: item.title,
							description: item.description,
							url: item.link || '#',
						})
					}
				})

				// Search Blog Posts (from Contentlayer)
				if (allBlogPosts && Array.isArray(allBlogPosts)) {
					allBlogPosts.forEach((item: any) => {
						if (
							item.title?.toLowerCase().includes(lowerQuery) ||
							item.description?.toLowerCase().includes(lowerQuery)
						) {
							searchResults.push({
								type: 'blog',
								title: item.title,
								description: item.description,
								url: item.url || `/blog/${item.slugAsParams}`,
								tags: item.keywords,
								date: item.date,
							})
						}
					})
				}

				setResults(searchResults.slice(0, 10))
				setSelectedIndex(0)
			}
		}, 300) // 300ms debounce

		return () => clearTimeout(timeoutId)
	}, [query, searchType])

	const handleSelect = (url: string) => {
		if (url.startsWith('http')) {
			window.open(url, '_blank')
		} else {
			router.push(url)
		}
		setIsOpen(false)
		setQuery("")
	}

	const getIcon = (type: string) => {
		switch (type) {
			case 'research':
				return BookOpen
			case 'project':
				return Code
			case 'blog':
				return FileText
			default:
				return FileText
		}
	}

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectedIndex((prev) => Math.max(prev - 1, 0))
			} else if (e.key === 'Enter' && results[selectedIndex]) {
				e.preventDefault()
				handleSelect(results[selectedIndex].url)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, results, selectedIndex])

	return (
		<div className="relative" ref={searchRef}>
			{/* Search Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-1 px-1.5 py-1 text-xs text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
				aria-label="Search"
			>
				<Search className="h-3 w-3" />
				<span className="hidden 2xl:inline text-xs">⌘K</span>
			</button>

			{/* Search Modal */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, y: -20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -20, scale: 0.95 }}
							className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
						>
							<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
								{/* Search Input */}
								<div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
									<Search className="h-5 w-5 text-slate-400" />
									<input
										type="text"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Search research, projects, articles..."
										className="flex-1 bg-transparent text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none text-sm"
										autoFocus
									/>
									{query && (
										<button
											onClick={() => setQuery("")}
											className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>

								{/* Search Filters */}
								{query && (
									<div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
										<Filter className="h-4 w-4 text-slate-400" />
										<div className="flex items-center gap-2 flex-wrap">
											{(['all', 'research', 'project', 'blog'] as const).map((type) => (
												<button
													key={type}
													onClick={() => setSearchType(type)}
													className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
														searchType === type
															? 'bg-blue-500 text-white'
															: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
													}`}
												>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</button>
											))}
										</div>
									</div>
								)}

								{/* Results */}
								<div className="max-h-96 overflow-y-auto">
									{query && results.length === 0 ? (
										<div className="p-8 text-center text-slate-500 dark:text-slate-400">
											No results found
										</div>
									) : query && results.length > 0 ? (
										<div className="p-2">
											{results.map((result, idx) => {
												const Icon = getIcon(result.type)
												return (
													<button
														key={idx}
														onClick={() => handleSelect(result.url)}
														onMouseEnter={() => setSelectedIndex(idx)}
														className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
															selectedIndex === idx
																? 'bg-slate-100 dark:bg-slate-800'
																: 'hover:bg-slate-50 dark:hover:bg-slate-900'
														}`}
													>
														<Icon className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-sm font-medium text-slate-900 dark:text-slate-50 line-clamp-1">
																	{result.title}
																</span>
																<span className="text-xs text-slate-500 dark:text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
																	{result.type}
																</span>
																{result.score && (
																	<span className="text-xs text-slate-400 dark:text-slate-600 ml-auto">
																		{Math.round(result.score)}%
																	</span>
																)}
															</div>
															{result.description && (
																<p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-1">
																	{result.description}
																</p>
															)}
															{result.content && (
																<p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-1">
																	{result.content}...
																</p>
															)}
															<div className="flex items-center gap-2 mt-1">
																{result.tags && result.tags.length > 0 && (
																	<div className="flex items-center gap-1 flex-wrap">
																		{result.tags.slice(0, 3).map((tag, idx) => (
																			<span key={idx} className="text-[10px] text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
																				{tag}
																			</span>
																		))}
																	</div>
																)}
																{result.date && (
																	<span className="text-[10px] text-slate-400 dark:text-slate-600 flex items-center gap-1">
																		<Clock className="h-3 w-3" />
																		{new Date(result.date).toLocaleDateString()}
																	</span>
																)}
															</div>
														</div>
														<ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
													</button>
												)
											})}
										</div>
									) : (
										<div className="p-8 text-center text-slate-500 dark:text-slate-400">
											Start typing to search...
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

