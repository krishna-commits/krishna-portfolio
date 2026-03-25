"use client"

import { useGetGithubRepos } from "app/api/github"
import { Badge } from "app/theme/components/ui/badge"
import moment from 'moment'
import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search, X, ExternalLink, Code2, Github } from "lucide-react"
import { CopyrightFooter } from "../components/copyright-footer"
import {
	PAGE_H1,
	PAGE_ICON_CHIP,
	PAGE_LEAD,
	PAGE_SHELL_WIDE,
} from "lib/page-layout"

export default function Page() {
	const { repo, repoLoading, repoError, repoValidating, repoEmpty } = useGetGithubRepos()
	const [query, setQuery] = useState("")
	const [lang, setLang] = useState<string>("")

	if (repoLoading) {
		return (
			<div className={`min-h-screen bg-background ${PAGE_SHELL_WIDE}`}>
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
		<main className={`min-h-screen bg-background ${PAGE_SHELL_WIDE}`}>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-10 space-y-4"
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<span className={PAGE_ICON_CHIP}>
							<Code2 className="h-5 w-5" aria-hidden />
						</span>
						<h1 className={PAGE_H1}>Code Canvas</h1>
					</div>
					<p className={PAGE_LEAD}>
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
							className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
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
						className="rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
					>
						<option value="">All languages</option>
						{languages.map((l) => (
							<option key={l} value={l}>{l}</option>
						))}
					</select>
					{(query || lang) && (
						<button
							type="button"
							onClick={() => { setQuery(""); setLang("") }}
							className="rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							Clear
						</button>
					)}
				</div>
			</motion.div>

			{/* Repository Grid */}
			{repoEmpty ? (
				<div className="py-16 text-center">
					<p className="text-sm text-muted-foreground">No repositories found.</p>
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
							className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md"
						>
							<div className="relative space-y-3">
								<div className="mb-3 flex min-w-0 flex-1 items-start justify-between gap-3">
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<div className="flex-shrink-0 rounded-lg border border-border bg-muted p-1.5">
											<Github className="h-3 w-3 text-foreground" aria-hidden />
										</div>
										<Link
											href={repoItem.html_url}
											target="_blank"
											rel="noopener noreferrer"
											className="min-w-0 flex-1"
										>
											<h3 className="truncate text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base">
												{repoItem.name}
											</h3>
										</Link>
									</div>
									<ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
								</div>

								{repoItem.description && (
									<p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
										{repoItem.description}
									</p>
								)}

								<div className="flex items-center justify-between border-t border-border pt-3">
									<div className="flex items-center gap-2">
										{repoItem.language && (
											<Badge variant="outline" className="bg-muted/50 font-mono text-[10px]">
												{repoItem.language}
											</Badge>
										)}
										<span className="text-[10px] text-muted-foreground">
											{moment(repoItem.updated_at).format("MMM YY")}
										</span>
									</div>
									{repoItem.homepage && (
										<Link
											href={repoItem.homepage}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[10px] font-medium text-primary transition-colors hover:underline"
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
