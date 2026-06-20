'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Briefcase, Mail, ArrowRight } from 'lucide-react'
import { cn } from 'app/theme/lib/utils'

export function HireMeBar() {
	const [visible, setVisible] = useState(false)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mq.matches)

		const onScroll = () => setVisible(window.scrollY > 420)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	if (!visible) return null

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 z-40 border-t border-amber-400/40 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90 dark:border-amber-500/20 dark:bg-background/95 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]',
				!prefersReducedMotion && 'animate-in fade-in slide-in-from-bottom-2 duration-200',
			)}
			role="region"
			aria-label="Open to work"
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-2 lg:px-0">
				<div className="hidden items-center gap-2 min-[480px]:flex">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
						<Briefcase className="h-3.5 w-3.5" aria-hidden />
						Open to Work
					</span>
					<span className="text-sm text-muted-foreground">Remote Senior DevSecOps &amp; platform security roles</span>
				</div>
				<p className="text-xs font-semibold text-foreground sm:hidden">Open to Work</p>
				<Link
					href="/contact"
					className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
				>
					<Mail className="h-4 w-4" aria-hidden />
					Get In Touch
					<ArrowRight className="h-4 w-4" aria-hidden />
				</Link>
			</div>
		</div>
	)
}
