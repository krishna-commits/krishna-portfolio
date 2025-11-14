"use client"

import { useGetGithubRepos } from "app/api/github"
import { Badge } from "app/theme/components/ui/badge"
import moment from 'moment'
import { Icons } from "app/theme/components/theme/icons"
import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, X, ExternalLink, Code2, Github } from "lucide-react"
import { CopyrightFooter } from "../components/copyright-footer"

export default function Page() {
	const { repo, repoLoading, repoError, repoValidating, repoEmpty } = useGetGithubRepos()
	const [query, setQuery] = useState("")
	const [lang, setLang] = useState<string>("")

	if (repoLoading) {
		return (
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
				<div className="space-y-8">
					<div className="space-y-3">
						<div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
						<div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-28 bg-slate-100 dark:bg-slate-900 rounded-lg animate-pulse" />
						))}
					</div>
				</div>
			</div>
		)
	}

	const languages = useMemo(() => {
		const set = new Set<string>()
		;(repo || []).forEach((r: any) => r.language && set.add(r.language))
		return Array.from(set).sort()
	}, [repo])

	const filtered = useMemo(() => {
		return (repo || []).filter((r: any) => {
			const matchesQuery = query ? (r.name + " " + (r.description || "")).toLowerCase().includes(query.toLowerCase()) : true
			const matchesLang = lang ? r.language === lang : true
			return matchesQuery && matchesLang
		})
	}, [repo, query, lang])

	return (
		<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-4 mb-8 sm:mb-10"
			>
				<div className="space-y-2">
					<div className="inline-flex items-center gap-1.5 mb-2">
						<div className="p-1.5 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-200 shadow-sm">
							<Code2 className="h-3 w-3 text-white dark:text-slate-900" />
						</div>
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
							Code Canvas
						</h1>
					</div>
					<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed">
						A curated collection of repositories demonstrating production-ready engineering practices, research implementations, and open-source contributions.
					</p>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search repositories..."
							className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
						/>
						{query && (
							<button
								onClick={() => setQuery("")}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
					<select
						value={lang}
						onChange={(e) => setLang(e.target.value)}
						className="px-3 py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
					>
						<option value="">All languages</option>
						{languages.map((l) => (
							<option key={l} value={l}>{l}</option>
						))}
					</select>
					{(query || lang) && (
						<button
							onClick={() => { setQuery(""); setLang("") }}
							className="px-3 py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
						>
							Clear
						</button>
					)}
				</div>
			</motion.div>

			{/* Repository Grid */}
			{repoEmpty ? (
				<div className="text-center py-16">
					<p className="text-sm text-slate-500 dark:text-slate-400">No repositories found.</p>
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
				>
					{filtered.map((repoItem: any, index: number) => (
						<motion.div
							key={repoItem.id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05, duration: 0.4 }}
							whileHover={{ y: -2, scale: 1.01 }}
							className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
						>
							<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
							<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
							
							<div className="relative space-y-3">
								<div className="flex items-start justify-between gap-3 mb-3">
									<div className="flex items-center gap-2 min-w-0 flex-1">
										<div className="p-1.5 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-200 shadow-sm flex-shrink-0">
											<Github className="h-3 w-3 text-white dark:text-slate-900" />
										</div>
										<Link
											href={repoItem.html_url}
											target="_blank"
											rel="noopener noreferrer"
											className="min-w-0 flex-1"
										>
											<h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
												{repoItem.name}
											</h3>
										</Link>
									</div>
									<ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
								</div>

								{repoItem.description && (
									<p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
										{repoItem.description}
									</p>
								)}

								<div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
									<div className="flex items-center gap-2">
										{repoItem.language && (
											<Badge variant="outline" className="text-[10px] font-mono border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
												{repoItem.language}
											</Badge>
										)}
										<span className="text-[10px] text-slate-500 dark:text-slate-500">
											{moment(repoItem.updated_at).format("MMM YY")}
										</span>
									</div>
									{repoItem.homepage && (
										<Link
											href={repoItem.homepage}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
										>
											Live
										</Link>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Copyright Footer */}
			<div className="mt-12">
				<CopyrightFooter />
			</div>
		</main>
	)
}
