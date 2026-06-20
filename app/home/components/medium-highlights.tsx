'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { ExternalLink, FileText } from 'lucide-react'
import { siteConfig } from 'config/site'
import { cn } from 'app/theme/lib/utils'
import { PAGE_H1, PAGE_LEAD, PAGE_CARD_LIGHT } from 'lib/page-layout'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type MediumPost = {
	title: string
	link: string
	pubDate: string
}

function formatDate(pubDate: string): string {
	try {
		return new Date(pubDate).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	} catch {
		return ''
	}
}

export function MediumHighlights() {
	const { data, isLoading } = useSWR('/api/medium', fetcher, { revalidateOnFocus: false })
	const posts = ((data?.posts ?? []) as MediumPost[]).slice(0, 3)

	if (isLoading) {
		return (
			<div className={cn(PAGE_CARD_LIGHT, 'p-4 sm:p-5')}>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-28 animate-pulse rounded-xl bg-amber-50/80 dark:bg-muted/40" aria-hidden />
					))}
				</div>
			</div>
		)
	}

	if (posts.length === 0) return null

	return (
		<section className="relative w-full" aria-labelledby="medium-highlights-heading">
			<div className={cn(PAGE_CARD_LIGHT, 'overflow-hidden p-4 sm:p-5')}>
				<div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center justify-center rounded-xl border border-amber-300/50 bg-amber-100 p-2 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
								<FileText className="h-4 w-4" aria-hidden />
							</span>
							<h2 id="medium-highlights-heading" className={cn(PAGE_H1, 'text-xl sm:text-2xl')}>
								Latest on Medium
							</h2>
						</div>
						<p className={cn(PAGE_LEAD, 'text-sm')}>Recent engineering articles and security write-ups.</p>
					</div>
					<Link
						href={siteConfig.links.medium}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
					>
						View all
						<ExternalLink className="h-4 w-4" aria-hidden />
					</Link>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{posts.map((post, idx) => (
						<motion.article
							key={post.link}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: idx * 0.05, duration: 0.35 }}
						>
							<Link
								href={post.link}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex h-full flex-col gap-2 rounded-xl border border-amber-200/60 bg-white p-4 no-underline shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-border dark:bg-card sm:p-5"
							>
								<p className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 group-hover:text-amber-800 dark:text-foreground dark:group-hover:text-amber-300">
									{post.title}
								</p>
								{post.pubDate && (
									<p className="mt-auto text-xs text-muted-foreground">{formatDate(post.pubDate)}</p>
								)}
							</Link>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	)
}
