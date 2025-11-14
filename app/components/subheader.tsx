'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "app/theme/lib/utils"
import { motion } from "framer-motion"

// Subheader is now optional - can be hidden on mobile or when navbar is comprehensive
// Set SHOW_SUBHEADER to false to hide it completely
const SHOW_SUBHEADER = false // Set to true if you want to show subheader

export function Subheader() {
	const lastScroll = useRef(0)
	const [hidden, setHidden] = useState(false)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		// Check for reduced motion preference
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	useEffect(() => {
		if (prefersReducedMotion) return
		
		const onScroll = () => {
			const y = window.scrollY || 0
			setHidden(y > 120 && y > lastScroll.current)
			lastScroll.current = y
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [prefersReducedMotion])

	// Don't render if disabled
	if (!SHOW_SUBHEADER) return null

	const links = [
		{ href: "/research-core", label: "Research", description: "Publications" },
		{ href: "/projects", label: "Projects", description: "Portfolio" },
		{ href: "/blog", label: "Blog", description: "Articles" },
		{ href: "/contact", label: "Contact", description: "Connect" },
	]

	return (
		<motion.div
			initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
			animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
			transition={prefersReducedMotion ? {} : { duration: 0.3 }}
			className={cn(
				"sticky top-20 sm:top-[5.5rem] lg:top-24 z-40 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-slate-950/50 transition-transform duration-300",
				!prefersReducedMotion && hidden ? "-translate-y-full" : "translate-y-0"
			)}
			role="navigation"
			aria-label="Quick navigation"
		>
			{/* Full width container matching header/footer */}
			<div className="relative w-full">
				<div className="w-full mx-auto">
					<div className="h-10 sm:h-11 flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
						{links.map((link, idx) => {
							const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
							return (
								<motion.div
									key={link.href}
									initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.3, delay: idx * 0.05 }}
								>
									<Link
										href={link.href}
										className={cn(
											"rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border-2 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
											isActive
												? "border-blue-400 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40 text-blue-700 dark:text-blue-300 shadow-md"
												: "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:border-slate-300 dark:hover:border-slate-700"
										)}
										aria-current={isActive ? "page" : undefined}
									>
										{link.label}
									</Link>
								</motion.div>
							)
						})}
					</div>
				</div>
			</div>
		</motion.div>
	)
}
