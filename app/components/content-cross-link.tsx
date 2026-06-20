'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, FileText } from 'lucide-react'
import { cn } from 'app/theme/lib/utils'
import { PAGE_CARD } from 'lib/page-layout'

type CrossLinkProps = {
	variant: 'blog-to-research' | 'research-to-blog'
	className?: string
}

const COPY = {
	'blog-to-research': {
		icon: BookOpen,
		title: 'Deep-dive technical notes',
		description:
			'Long-form guides, roadmaps, and security playbooks live in Research Core  structured for hands-on learning, not Medium-length posts.',
		href: '/research-core',
		cta: 'Explore Research Core',
	},
	'research-to-blog': {
		icon: FileText,
		title: 'Shorter articles on Medium',
		description:
			'Essays, reflections, and quick technical write-ups are published on Medium  complementary to the structured Research Core library.',
		href: '/blog',
		cta: 'Read on Medium',
	},
}

export function ContentCrossLink({ variant, className }: CrossLinkProps) {
	const copy = COPY[variant]
	const Icon = copy.icon

	return (
		<div className={cn(PAGE_CARD, 'p-5 sm:p-6', className)}>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<span className="inline-flex rounded-lg border border-border bg-muted p-2.5">
						<Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
					</span>
					<div>
						<p className="text-sm font-semibold text-foreground sm:text-base">{copy.title}</p>
						<p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">{copy.description}</p>
					</div>
				</div>
				<Link
					href={copy.href}
					className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 dark:hover:bg-amber-500"
				>
					{copy.cta}
					<ArrowRight className="h-4 w-4" aria-hidden />
				</Link>
			</div>
		</div>
	)
}
