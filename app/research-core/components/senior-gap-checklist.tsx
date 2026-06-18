'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from 'app/theme/lib/utils'
import { useResearchCoreConfig } from 'lib/hooks/use-research-core-config'

type Score = 0 | 1 | 2

const STORAGE_KEY = 'senior-platform-gap-scores'

const SCORE_LABELS: Record<Score, string> = {
	0: 'Not in place',
	1: 'Partial',
	2: 'Automated & tested',
}

function interpretation(total: number, max: number): string {
	const ratio = max > 0 ? total / max : 0
	if (ratio >= 0.82) return 'Staff-ready platform posture; focus on mentoring and strategy.'
	if (ratio >= 0.53) return 'Strong operator; close gaps in lowest-scoring section first.'
	return 'Prioritize automation and security gates before new tool adoption.'
}

export function SeniorGapChecklist() {
	const { config } = useResearchCoreConfig()
	const items = config.seniorGapChecklist.items
	const maxScore = items.length * 2

	const [scores, setScores] = useState<Record<string, Score>>({})
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) setScores(JSON.parse(raw))
		} catch {
			// ignore
		}
		setLoaded(true)
	}, [])

	const persist = useCallback((next: Record<string, Score>) => {
		setScores(next)
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	}, [])

	const setScore = useCallback(
		(id: string, score: Score) => {
			persist({ ...scores, [id]: score })
		},
		[scores, persist],
	)

	const total = useMemo(
		() => items.reduce((sum, item) => sum + (scores[item.id] ?? 0), 0),
		[scores, items],
	)

	const sections = useMemo(() => {
		const map = new Map<string, typeof items>()
		for (const item of items) {
			const list = map.get(item.section) ?? []
			list.push(item)
			map.set(item.section, list)
		}
		return Array.from(map.entries())
	}, [items])

	if (!loaded || items.length === 0) return null

	return (
		<div className="not-prose my-8 space-y-8">
			<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
				<div>
					<p className="text-sm font-medium text-foreground">Your score</p>
					<p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
						{total}{' '}
						<span className="text-base font-normal text-muted-foreground">/ {maxScore}</span>
					</p>
				</div>
				<p className="max-w-md text-sm text-muted-foreground">
					{interpretation(total, maxScore)}
				</p>
				<button
					type="button"
					onClick={() => persist({})}
					className="text-xs text-muted-foreground underline-offset-2 hover:underline"
				>
					Reset checklist
				</button>
			</div>

			{sections.map(([section, sectionItems]) => (
				<div key={section} className="space-y-3">
					<h3 className="text-base font-semibold text-foreground">{section}</h3>
					<div className="overflow-x-auto rounded-xl border border-border">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/50 text-left">
									<th className="px-3 py-2 font-medium">Capability</th>
									<th className="px-2 py-2 text-center w-14">0</th>
									<th className="px-2 py-2 text-center w-14">1</th>
									<th className="px-2 py-2 text-center w-14">2</th>
									<th className="hidden sm:table-cell px-3 py-2 font-medium">Research Core</th>
								</tr>
							</thead>
							<tbody>
								{sectionItems.map((item) => (
									<tr key={item.id} className="border-b border-border last:border-0">
										<td className="px-3 py-2 text-foreground">{item.label}</td>
										{([0, 1, 2] as const).map((score) => (
											<td key={score} className="px-2 py-2 text-center">
												<button
													type="button"
													title={SCORE_LABELS[score]}
													aria-label={`${item.label}: ${SCORE_LABELS[score]}`}
													onClick={() => setScore(item.id, score)}
													className={cn(
														'h-8 w-8 rounded-full border text-xs font-medium transition-colors',
														(scores[item.id] ?? null) === score
															? 'border-amber-600 bg-amber-600 text-white'
															: 'border-border bg-background hover:bg-muted',
													)}
												>
													{score}
												</button>
											</td>
										))}
										<td className="hidden sm:table-cell px-3 py-2">
											<Link
												href={item.href}
												className="text-amber-700 hover:underline dark:text-amber-400"
											>
												{item.linkLabel}
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			))}
		</div>
	)
}
