'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Target, Zap } from 'lucide-react'
import useSWR from 'swr'
import { DEFAULT_PERSONAL_NOTE, mergePersonalNote } from 'lib/personal-note-config'
import type { PersonalNoteCard } from 'lib/personal-note-config'
import { PAGE_CARD, PAGE_H1, PAGE_LEAD } from 'lib/page-layout'
import { cn } from 'app/theme/lib/utils'

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
		<div className="relative w-full" aria-label="About Krishna">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className={cn(
					PAGE_CARD,
					'relative overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10',
					'ring-1 ring-amber-500/10',
				)}
			>
				<div
					className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] via-transparent to-transparent"
					aria-hidden
				/>

				<div className="relative space-y-8">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
						<div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 shadow-sm sm:p-3">
							<Heart className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
						</div>
						<h2 className={PAGE_H1}>{config.heading}</h2>
					</div>

					{config.useSimpleContent && config.simpleContent.trim() ? (
						<div className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{config.simpleContent}</div>
					) : (
						<div className="space-y-8">
							<div className="max-w-3xl space-y-4">
								<p className="text-lg font-semibold leading-snug text-foreground sm:text-xl md:text-2xl">
									{config.mainStatement}
								</p>
								<p className={cn(PAGE_LEAD, 'text-sm sm:text-base')}>{config.subStatement}</p>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
								{config.cards.map((card, idx) => {
									const Icon = cardIcon(card)
									return (
										<motion.div
											key={card.title + idx}
											initial={{ opacity: 0, y: 12 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ delay: 0.08 * (idx + 1) }}
											className="rounded-xl border border-border bg-muted/30 p-5 transition-colors hover:border-amber-500/25 hover:bg-amber-500/5"
										>
											<div className="mb-3 inline-flex rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5">
												<Icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
											</div>
											<h3 className="mb-2 text-base font-semibold text-foreground">{card.title}</h3>
											<p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
										</motion.div>
									)
								})}
							</div>

							<div className="max-w-3xl border-t border-border pt-6">
								<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{config.philosophy}</p>
								<p className="mt-3 text-base font-semibold text-foreground sm:text-lg">{config.closingStatement}</p>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	)
}
