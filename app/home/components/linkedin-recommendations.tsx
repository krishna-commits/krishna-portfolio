'use client'

import { motion } from "framer-motion"
import { Quote, Linkedin, ExternalLink, Users } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "config/site"
import useSWR from 'swr'

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
						<div className="inline-flex items-center gap-3">
							<div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
								<Users className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
								Recommendations
							</h2>
						</div>
						<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
							What colleagues and collaborators say
						</p>
					</div>
					<Link
						href={siteConfig.links.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						className="hidden lg:flex items-center gap-2 px-5 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 group shadow-md hover:shadow-lg"
					>
						View on LinkedIn
						<ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</motion.div>

			{/* Recommendations Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
			<div className="relative h-full overflow-hidden rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50/30 to-amber-50/30 dark:from-yellow-950/20 dark:to-amber-950/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-yellow-400 dark:group-hover:border-yellow-500">
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
				
				<div className="relative space-y-4 h-full flex flex-col">
					<div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-yellow-200 to-amber-200 dark:from-yellow-900/40 dark:to-amber-900/40 shadow-md w-fit">
						<Quote className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
					</div>
					
					<p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed flex-1 line-clamp-6">
						"{rec.text}"
					</p>
					
					<div className="pt-4 border-t border-yellow-200 dark:border-yellow-800 mt-auto">
						<div className="flex items-center justify-between gap-3">
							<div className="space-y-1 flex-1 min-w-0">
								<p className="font-bold text-slate-900 dark:text-slate-50 text-sm sm:text-base">
									{rec.name}
								</p>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
									{rec.title} {rec.company && `at ${rec.company}`}
								</p>
								{rec.date && (
									<p className="text-xs text-slate-500 dark:text-slate-500">
										{rec.date}
									</p>
								)}
							</div>
							{rec.linkedinUrl && (
								<Link
									href={rec.linkedinUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-800 text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-all flex-shrink-0"
									aria-label={`View ${rec.name}'s LinkedIn profile`}
								>
									<Linkedin className="h-5 w-5" />
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
