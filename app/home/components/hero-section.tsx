'use client'

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import Image from "next/image"
import { cn } from "app/theme/lib/utils"
import { Badge } from "app/theme/components/ui/badge"
import { CheckCircle2, Shield, Cloud, Lock, Server, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useDeferredValue as useReactDeferredValue } from "react"
import { RevealText } from "../../components/animated-typography"
import { useHero } from "lib/hooks/use-homepage-data"
import { useResearchCoreConfig } from "lib/hooks/use-research-core-config"
import type { HeroExpertiseArea } from "lib/hero-config"

const VIEWS = ["Academic", "Enterprise"] as const
type ViewType = (typeof VIEWS)[number]

const HERO_ICON_MAP = {
	Shield,
	Server,
	Lock,
	Cloud,
} as const

function expertiseIcon(area: HeroExpertiseArea) {
	return HERO_ICON_MAP[area.icon] ?? Shield
}

function SecurityPatternBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			<div
				className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
				style={{
					backgroundImage: `
						linear-gradient(to right, rgb(148 163 184 / 0.12) 1px, transparent 1px),
						linear-gradient(to bottom, rgb(148 163 184 / 0.12) 1px, transparent 1px)
					`,
					backgroundSize: '48px 48px',
				}}
			/>
		</div>
	)
}

export const HeroSection = memo(function HeroSection() {
	const { config: researchConfig } = useResearchCoreConfig()
	const { hero } = useHero()

	const [activeView, setActiveView] = useState<ViewType>("Enterprise")
	const [mounted, setMounted] = useState(false)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)
	
	const springConfig = useMemo(() => ({ damping: 25, stiffness: 200 }), [])
	const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)
	const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), springConfig)

	const deferredView = useReactDeferredValue(activeView)

	const handleViewChange = useCallback((view: ViewType) => {
		setActiveView(view)
	}, [])

	useEffect(() => {
		setMounted(true)
		
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	useEffect(() => {
		if (!mounted || typeof window === 'undefined' || prefersReducedMotion) {
			return
		}
		
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e
			const { innerWidth, innerHeight } = window
			mouseX.set((clientX / innerWidth - 0.5) * 2)
			mouseY.set((clientY / innerHeight - 0.5) * 2)
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mounted, mouseX, mouseY, prefersReducedMotion])

	return (
		<section
			id="home"
			className="relative w-full min-h-[60vh] flex items-center overflow-hidden scroll-mt-24 pt-4"
			aria-label="Hero section"
		>
			<SecurityPatternBackground />
			
			<div className="relative w-full z-10">
					<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
					<div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
							<div className="lg:col-span-7 space-y-3 sm:space-y-4 md:space-y-5">
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
										<RevealText variant="slide-up" className="block mb-1 sm:mb-2">
											{hero.headlineLine1}
										</RevealText>
										<RevealText variant="slide-up" delay={0.1} className="block text-amber-600 dark:text-amber-400">
											{hero.headlineLine2}
										</RevealText>
									</h1>
									<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose mt-3 sm:mt-4">
										{hero.subtitle}
									</p>
								</motion.div>

								<motion.p
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.2, ease: "easeOut" }}
									className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose"
								>
									{hero.description}
								</motion.p>

								{researchConfig.heroCta.enabled && (
									<motion.div
										initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
										animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
										transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.25, ease: "easeOut" }}
									>
										<Link
											href={researchConfig.heroCta.href}
											className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
										>
											{researchConfig.heroCta.label}
											<ArrowRight className="h-4 w-4" aria-hidden />
										</Link>
									</motion.div>
								)}

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.3, ease: "easeOut" }}
									className="flex flex-wrap gap-1.5"
									aria-label="Technology tags"
								>
									{hero.customTags.map((tag, idx) => (
										<Badge
											key={idx}
											variant="secondary"
											className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
										>
											{tag}
										</Badge>
									))}
								</motion.div>
							</div>

							<div className="lg:col-span-5 space-y-3 sm:space-y-4 md:space-y-5">
								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.45, delay: 0.15, ease: "easeOut" }}
									style={prefersReducedMotion ? {} : { x, y }}
									className="relative"
								>
									<div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[300px] mx-auto aspect-square">
										<motion.div
											className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-md bg-card"
											whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
											transition={{ type: 'spring', stiffness: 400, damping: 28 }}
										>
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
										</motion.div>
									</div>
								</motion.div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.4, ease: "easeOut" }}
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
											aria-labelledby={`${deferredView.toLowerCase()}-tab`}
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

						<motion.div
							initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
							animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
							transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.5, ease: "easeOut" }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
							aria-label="Expertise areas"
						>
							{hero.expertiseAreas.map((area, idx) => {
								const Icon = expertiseIcon(area)
								return (
									<motion.div
										key={idx}
										whileHover={prefersReducedMotion ? {} : { y: -2 }}
										className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5"
									>
										<div className="inline-flex p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 mb-3">
											<Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
										</div>
										<p className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
											{area.title}
										</p>
										<p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
											{area.description}
										</p>
									</motion.div>
								)
							})}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	)
})

