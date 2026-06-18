'use client'

import Link from 'next/link'
import { BookOpen, Map, ClipboardCheck, Layers, Shield, ArrowRight } from 'lucide-react'
import { PAGE_CARD } from 'lib/page-layout'
import { useResearchCoreConfig } from 'lib/hooks/use-research-core-config'
import type { StartHereLink } from 'lib/research-core-config'

const ICON_MAP = {
	BookOpen,
	Map,
	ClipboardCheck,
	Layers,
	Shield,
} as const

function linkIcon(icon: StartHereLink['icon']) {
	const Icon = ICON_MAP[icon] ?? BookOpen
	return Icon
}

export function ResearchCoreStartHere() {
	const { config } = useResearchCoreConfig()
	const { startHere } = config

	if (!startHere.links.length) return null

	return (
		<div className={`${PAGE_CARD} p-5 sm:p-6 mb-10 border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20`}>
			<p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300 mb-1">
				{startHere.badge}
			</p>
			<h2 className="text-lg font-semibold text-foreground mb-2">{startHere.heading}</h2>
			<p className="text-sm text-muted-foreground mb-4 max-w-2xl">{startHere.lead}</p>
			<div className="grid gap-3 sm:grid-cols-3">
				{startHere.links.map(({ href, title, description, icon }) => {
					const Icon = linkIcon(icon)
					return (
						<Link
							key={href + title}
							href={href}
							className="group flex flex-col rounded-xl border border-border bg-card p-4 no-underline shadow-sm transition-shadow hover:shadow-md"
						>
							<Icon className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-2" aria-hidden />
							<span className="font-medium text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400">
								{title}
							</span>
							<span className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</span>
							<span className="mt-auto pt-3 inline-flex items-center text-xs font-medium text-amber-700 dark:text-amber-400">
								Open <ArrowRight className="ml-1 h-3 w-3" />
							</span>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
