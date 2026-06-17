'use client'

import { motion } from "framer-motion"
import { Quote, Linkedin, ExternalLink, Users } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "config/site"
import useSWR from 'swr'
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD } from "lib/page-layout"
import { cn } from "app/theme/lib/utils"

interface Recommendation {
	name: string
	title: string
	company?: string
	text: string
	date?: string
	linkedinUrl?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function LinkedInRecommendations() {
	const { data } = useSWR('/api/homepage/recommendations', fetcher)
	const recommendations = (data?.recommendations || siteConfig.linkedin_recommendations || []) as Recommendation[]
	
	// Normalize recommendations data - use siteConfig LinkedIn URL as fallback
	const normalizedRecommendations: Recommendation[] = recommendations.map((rec: Recommendation) => ({
		...rec,
		linkedinUrl: rec.linkedinUrl || siteConfig.links.linkedIn,
	}))
	
	if (normalizedRecommendations.length === 0) return null

	return (
		<section className="relative w-full">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-8 sm:mb-10"
			>
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
					<div className="space-y-3">
						<div className="flex flex-wrap items-center gap-3">
							<span className={PAGE_ICON_CHIP}>
								<Users className="h-5 w-5" aria-hidden />
							</span>
							<h2 className={PAGE_H1}>Recommendations</h2>
						</div>
						<p className={cn(PAGE_LEAD, "text-base sm:text-lg")}>
							What colleagues and collaborators say
						</p>
					</div>
					<Link
						href={siteConfig.links.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						className="no-underline hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted lg:flex"
					>
						View on LinkedIn
						<ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</motion.div>

			{/* Recommendations Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{normalizedRecommendations.map((rec: Recommendation, idx: number) => (
					<RecommendationCard key={idx} rec={rec} index={idx} />
				))}
			</div>

			{/* Mobile CTA */}
			<div className="lg:hidden mt-8">
				<Link
					href={siteConfig.links.linkedIn}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border-t-2 border-slate-200 dark:border-slate-800 pt-6 transition-colors"
				>
					View on LinkedIn
					<ExternalLink className="h-5 w-5" />
				</Link>
			</div>
		</section>
	)
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			whileHover={{ y: -4 }}
			className="group relative"
		>
			<div className={cn(PAGE_CARD, "relative flex h-full flex-col overflow-hidden p-6 transition-shadow hover:shadow-md")}>
				<div className="relative flex h-full flex-col space-y-4">
					<span className="inline-flex w-fit rounded-lg border border-border bg-muted p-2.5 text-foreground">
						<Quote className="h-5 w-5" aria-hidden />
					</span>

					<p className="line-clamp-6 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
						&ldquo;{rec.text}&rdquo;
					</p>

					<div className="mt-auto border-t border-border pt-4">
						<div className="flex items-center justify-between gap-3">
							<div className="min-w-0 flex-1 space-y-1">
								<p className="text-sm font-semibold text-foreground sm:text-base">{rec.name}</p>
								<p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
									{rec.title} {rec.company && `at ${rec.company}`}
								</p>
								{rec.date && <p className="text-xs text-muted-foreground">{rec.date}</p>}
							</div>
							{rec.linkedinUrl && (
								<Link
									href={rec.linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="no-underline shrink-0 rounded-lg border border-border bg-muted p-2.5 text-foreground transition-colors hover:bg-muted/80"
									aria-label={`View ${rec.name}'s LinkedIn profile`}
								>
									<Linkedin className="h-5 w-5" aria-hidden />
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
