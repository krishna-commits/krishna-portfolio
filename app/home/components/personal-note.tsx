'use client'

import { motion } from "framer-motion"
import { Heart, Sparkles, Target, Zap } from "lucide-react"
import useSWR from "swr"
import { DEFAULT_PERSONAL_NOTE, mergePersonalNote } from "lib/personal-note-config"
import type { PersonalNoteCard } from "lib/personal-note-config"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const CARD_ICONS = { Target, Sparkles, Zap } as const

function cardIcon(card: PersonalNoteCard) {
	return CARD_ICONS[card.icon] ?? Target
}

export function PersonalNote() {
	const { data } = useSWR<{ personalNote?: Parameters<typeof mergePersonalNote>[0] }>(
		'/api/homepage/personal-note',
		fetcher,
		{ revalidateOnFocus: true },
	)
	const config = mergePersonalNote(data?.personalNote ?? DEFAULT_PERSONAL_NOTE)

	return (
		<section id="about" className="relative w-full" aria-label="Personal note">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12"
			>
				<div className="relative space-y-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
						<div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-md">
							<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
						</div>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
							{config.heading}
						</h2>
					</div>

					{config.useSimpleContent && config.simpleContent.trim() ? (
						<div className="prose prose-slate dark:prose-invert max-w-3xl whitespace-pre-wrap text-slate-700 dark:text-slate-300">
							{config.simpleContent}
						</div>
					) : (
						<div className="space-y-8">
							<div className="space-y-4 sm:space-y-5 max-w-3xl">
								<p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight">
									{config.mainStatement}
								</p>
								<p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
									{config.subStatement}
								</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
								{config.cards.map((card, idx) => {
									const Icon = cardIcon(card)
									return (
										<motion.div
											key={card.title + idx}
											initial={{ opacity: 0, scale: 0.9 }}
											whileInView={{ opacity: 1, scale: 1 }}
											viewport={{ once: true }}
											transition={{ delay: 0.1 * (idx + 1) }}
											whileHover={{ scale: 1.02, y: -4 }}
											className="p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:shadow-lg transition-all duration-300"
										>
											<div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 mb-3 shadow-md">
												<Icon className="h-5 w-5 text-white" />
											</div>
											<h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">{card.title}</h3>
											<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.description}</p>
										</motion.div>
									)
								})}
							</div>

							<div className="relative pt-6 border-t-2 border-slate-200 dark:border-slate-800 max-w-3xl">
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 mt-1">
										<div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20 border border-yellow-300/30 dark:border-yellow-700/30">
											<Heart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
										</div>
									</div>
									<div className="flex-1 space-y-4">
										<p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
											{config.philosophy}
										</p>
										<p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
											{config.closingStatement}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</section>
	)
}
