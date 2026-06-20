'use client'

import { useState, useEffect, useCallback, memo } from "react"
import Image from "next/image"
import { cn } from "app/theme/lib/utils"
import { Badge } from "app/theme/components/ui/badge"
import { CheckCircle2, Shield, ArrowRight, Mail, ChevronDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useDeferredValue as useReactDeferredValue } from "react"
import { RevealText } from "../../components/animated-typography"
import { useHero } from "lib/hooks/use-homepage-data"

const VIEWS = ["Academic", "Enterprise"] as const
type ViewType = (typeof VIEWS)[number]

export const HeroSection = memo(function HeroSection() {
	const { hero } = useHero()

	const [activeView, setActiveView] = useState<ViewType>("Enterprise")
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const [descExpanded, setDescExpanded] = useState(false)
	const [moreOpen, setMoreOpen] = useState(false)

	const deferredView = useReactDeferredValue(activeView)

	const handleViewChange = useCallback((view: ViewType) => {
		setActiveView(view)
	}, [])

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)

		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)

		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	return (
		<section
			id="home"
			className="relative w-full overflow-hidden scroll-mt-24 bg-gradient-to-b from-amber-50/50 to-transparent pt-2 dark:from-amber-950/10 dark:to-transparent"
			aria-label="Hero section"
		>
			<div className="relative w-full z-10">
				<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 md:py-10">
					<div className="space-y-4 sm:space-y-5">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start">
							<div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, ease: "easeOut" }}
									className="flex items-center gap-1.5 flex-wrap"
								>
									<Badge className="border-0 bg-amber-600 px-2 py-1 text-xs font-semibold text-white shadow-sm dark:bg-amber-600">
										<Shield className="mr-1 h-3 w-3" aria-hidden="true" />
										{hero.badgePrimary}
									</Badge>
									<Badge variant="outline" className="border-border bg-muted/50 px-2 py-1 text-xs font-semibold text-foreground">
										{hero.badgeSecondary}
									</Badge>
								</motion.div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.1, ease: "easeOut" }}
									className="space-y-1.5 sm:space-y-2"
								>
									<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
										<RevealText variant="slide-up">{hero.name}</RevealText>
									</h1>
									<p className="text-lg font-semibold leading-snug text-amber-600 dark:text-amber-400 sm:text-xl">
										{hero.headlineLine1}
										<span className="text-muted-foreground font-medium"> · </span>
										{hero.headlineLine2}
									</p>
									<p className="text-sm font-medium text-muted-foreground sm:text-base">
										{hero.locationLine}
									</p>
									<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose mt-1.5">
										{hero.subtitle}
									</p>
								</motion.div>

								<div className="md:hidden">
									<button
										type="button"
										onClick={() => setDescExpanded((v) => !v)}
										className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 dark:text-amber-400"
										aria-expanded={descExpanded}
									>
										{descExpanded ? 'Hide details' : 'Read more'}
										<ChevronDown className={cn('h-4 w-4 transition-transform', descExpanded && 'rotate-180')} aria-hidden />
									</button>
									{descExpanded && (
										<p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose">
											{hero.description}
										</p>
									)}
								</div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.2, ease: "easeOut" }}
									className="flex flex-wrap items-center gap-2 pt-0.5"
								>
									<Link
										href="/contact"
										className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
									>
										<Mail className="h-4 w-4" aria-hidden />
										Get In Touch
										<ArrowRight className="h-4 w-4" aria-hidden />
									</Link>
									<Link
										href="/projects"
										className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
									>
										View Projects
										<ArrowRight className="h-4 w-4" aria-hidden />
									</Link>
									<Link
										href="/research-core"
										className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
									>
										Research Core
										<ArrowRight className="h-4 w-4" aria-hidden />
									</Link>
									<div className="relative sm:hidden">
										<button
											type="button"
											onClick={() => setMoreOpen((v) => !v)}
											className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-semibold text-foreground"
											aria-expanded={moreOpen}
											aria-haspopup="true"
										>
											<MoreHorizontal className="h-4 w-4" aria-hidden />
											More
										</button>
										{moreOpen && (
											<div className="absolute left-0 top-full z-20 mt-1 min-w-[11rem] rounded-lg border border-border bg-card py-1 shadow-lg">
												<Link
													href="/research-core"
													className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
													onClick={() => setMoreOpen(false)}
												>
													Research Core
												</Link>
											</div>
										)}
									</div>
								</motion.div>
							</div>

							<div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.45, delay: 0.15, ease: "easeOut" }}
									className="relative"
								>
									<div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] mx-auto aspect-square">
										<div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-md bg-card">
											{hero.profileImage ? (
												<Image
													src={hero.profileImage}
													alt={`${hero.name} - ${hero.bio}`}
													fill
													className="object-cover object-center"
													priority
													quality={95}
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
													<Shield className="h-12 w-12 text-slate-400" aria-hidden="true" />
												</div>
											)}
										</div>
									</div>
								</motion.div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.25, ease: "easeOut" }}
									className="space-y-2"
								>
									<div className="flex items-center justify-between p-1 rounded-xl bg-muted/60 border border-border" role="tablist" aria-label="View toggle">
										{VIEWS.map((view) => (
											<button
												type="button"
												key={view}
												onClick={() => handleViewChange(view)}
												className={cn(
													"flex-1 min-h-11 px-3 rounded-lg text-xs font-semibold transition-colors duration-200",
													activeView === view
														? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm"
														: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
												)}
												role="tab"
												aria-selected={activeView === view}
												aria-controls={`${view.toLowerCase()}-panel`}
											>
												{view}
											</button>
										))}
									</div>

									<AnimatePresence mode="wait">
										<motion.div
											key={deferredView}
											initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
											animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
											exit={prefersReducedMotion ? {} : { opacity: 0, y: -5 }}
											transition={prefersReducedMotion ? {} : { duration: 0.2, ease: "easeInOut" }}
											className="p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm"
											role="tabpanel"
											id={`${deferredView.toLowerCase()}-panel`}
										>
											<p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
												{hero.viewContent[deferredView].headline}
											</p>
											<ul className="space-y-2" role="list">
												{hero.viewContent[deferredView].bullets.map((bullet, idx) => (
													<li key={idx} className="flex gap-2 text-slate-700 dark:text-slate-300">
														<CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
														<span className="text-xs leading-relaxed font-medium">{bullet}</span>
													</li>
												))}
											</ul>
										</motion.div>
									</AnimatePresence>
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
})
