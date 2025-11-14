'use client'

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "config/site"
import { cn } from "app/theme/lib/utils"
import { Badge } from "app/theme/components/ui/badge"
import { ArrowRight, CheckCircle2, Shield, Cloud, Lock, Server } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Icons } from "app/theme/components/theme/icons"
import { useDeferredValue as useReactDeferredValue } from "react"
import { TypewriterText, GradientText, RevealText, InteractiveText } from "../../components/animated-typography"

const VIEWS = ["Academic", "Enterprise"] as const
type ViewType = (typeof VIEWS)[number]

const viewContent: Record<ViewType, { headline: string; bullets: string[] }> = {
	Academic: {
		headline: "Advancing secure, resilient cloud research ready for doctoral depth.",
		bullets: [
			"Published applied DevSecOps playbooks adopted across cross-functional teams.",
			"Led reproducible research pipelines with verifiable infrastructure artifacts.",
			"Mentored cohorts on cloud resilience and secure CI/CD methodologies.",
		],
	},
	Enterprise: {
		headline: "Delivering secure, production-grade systems with automated security controls.",
		bullets: [
			"Built security-first CI/CD pipelines reducing vulnerabilities by 85% through automated SAST/DAST integration.",
			"Implemented infrastructure security hardening across multi-cloud environments, achieving SOC2 compliance.",
			"Designed and deployed zero-trust architectures with automated threat detection, reducing incident response time by 70%.",
		],
	},
}

const CTA_LINKS = [
	{ label: "Interview Packet", href: "/contact?type=interview", icon: ArrowRight },
	{ label: "Request Collaboration Brief", href: "/contact?type=collaboration", icon: ArrowRight },
]

const expertiseAreas = [
	{
		icon: Shield,
		title: "Security-First Architecture",
		description: "Designing cloud systems with security as a foundational principle.",
		gradient: "from-sky-400 to-blue-500",
	},
	{
		icon: Server,
		title: "Infrastructure Automation",
		description: "Building scalable, resilient infrastructure with IaC and CI/CD.",
		gradient: "from-yellow-400 via-amber-500 to-yellow-600",
	},
	{
		icon: Lock,
		title: "Cybersecurity Defense",
		description: "Implementing defense-in-depth, zero-trust architectures, and automated threat detection for enterprise cloud environments.",
		gradient: "from-blue-400 to-sky-500",
	},
	{
		icon: Cloud,
		title: "Cloud-Native",
		description: "Expertise in AWS, GCP, Heroku, Azure, and Kubernetes orchestration.",
		gradient: "from-orange-500 via-red-500 to-orange-600",
	}
]

const customTags = ["DevSecOps", "Cybersecurity", "Cloud Security", "Threat Detection", "Security Automation", "Zero Trust"]

function SecurityPatternBackground() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
			{/* Animated Grid Pattern */}
			<div 
				className={cn(
					"absolute inset-0 opacity-[0.015] dark:opacity-[0.025]",
					!prefersReducedMotion && "animate-grid-move"
				)}
				style={{
					backgroundImage: `
						linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
					`,
					backgroundSize: '60px 60px, 60px 60px',
				}}
			/>
			
			{/* Gradient Mesh Background */}
			<div 
				className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
				style={{
					background: `
						radial-gradient(circle at 20% 50%, rgba(250, 204, 21, 0.3), transparent 50%),
						radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3), transparent 50%),
						radial-gradient(circle at 40% 20%, rgba(56, 189, 248, 0.2), transparent 50%)
					`
				}}
			/>
			
			{/* Floating Particles */}
			{!prefersReducedMotion && (
				<>
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20 blur-sm"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								y: [0, -30, 0],
								x: [0, Math.random() * 20 - 10, 0],
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 4 + Math.random() * 2,
								repeat: Infinity,
								delay: Math.random() * 2,
								ease: 'easeInOut'
							}}
						/>
					))}
				</>
			)}
		</div>
	)
}

export const HeroSection = memo(function HeroSection() {
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
			className="relative w-full min-h-[60vh] flex items-center overflow-hidden pt-4"
			aria-label="Hero section"
		>
			<SecurityPatternBackground />
			
			<div className="relative w-full z-10">
				<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl py-8 sm:py-12 lg:py-16">
					<div className="space-y-6 sm:space-y-8 lg:space-y-10">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
							<div className="lg:col-span-7 space-y-4 sm:space-y-5">
								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, ease: "easeOut" }}
									className="flex items-center gap-1.5 flex-wrap"
								>
									<Badge className="px-2 py-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-white border-0 shadow-sm text-xs font-semibold">
										<Shield className="h-3 w-3 mr-1" aria-hidden="true" />
										Senior DevSecOps Engineer
									</Badge>
									<Badge variant="outline" className="px-2 py-1 border border-orange-400 dark:border-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-xs font-semibold">
										Researcher
									</Badge>
								</motion.div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.1, ease: "easeOut" }}
									className="space-y-1.5 sm:space-y-2"
								>
									<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-tight">
										<RevealText variant="slide-up" className="block text-slate-900 dark:text-slate-50 mb-1">
											Securing Cloud Infrastructure
										</RevealText>
										<RevealText variant="slide-up" delay={0.1} className="block">
											<GradientText gradient="from-yellow-400 via-amber-500 to-orange-500">
												DevSecOps & Cybersecurity Expert
											</GradientText>
										</RevealText>
									</h1>
									<p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mt-2">
										6+ years building security-first cloud systems, automating threat detection, and implementing zero-trust architectures across AWS, GCP, Heroku, Azure, and Kubernetes.
									</p>
								</motion.div>

								<motion.p
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.2, ease: "easeOut" }}
									className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl"
								>
									{siteConfig.home.description.trim()}
								</motion.p>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.3, ease: "easeOut" }}
									className="flex flex-wrap gap-1.5"
									aria-label="Technology tags"
								>
									{customTags.map((tag, idx) => (
										<Badge
											key={idx}
											variant="secondary"
											className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
										>
											{tag}
										</Badge>
									))}
								</motion.div>

								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.4, delay: 0.4, ease: "easeOut" }}
									className="flex flex-wrap gap-2 pt-1"
								>
									{CTA_LINKS.map((cta, idx) => {
										const Icon = cta.icon
										return (
											<motion.div
												key={idx}
												whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
												whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
												transition={{ type: 'spring', stiffness: 400, damping: 17 }}
											>
												<Link
													href={cta.href}
													className={cn(
														"group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 overflow-hidden",
														idx === 0
															? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-sm hover:shadow-lg shadow-colored"
															: "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 shadow-hover"
													)}
													aria-label={cta.label}
												>
													{/* Ripple Effect Background */}
													<span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
													<span className="relative z-10 flex items-center gap-1.5">
														{cta.label}
														<Icon className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
													</span>
												</Link>
											</motion.div>
										)
									})}
								</motion.div>
							</div>

							<div className="lg:col-span-5 space-y-2 sm:space-y-3">
								<motion.div
									initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, rotateY: -15 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, rotateY: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
									style={prefersReducedMotion ? {} : { x, y }}
									className="relative perspective-1000"
								>
									{/* Glow Effect */}
									<motion.div
										className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20 blur-2xl -z-10"
										animate={prefersReducedMotion ? {} : {
											scale: [1, 1.1, 1],
											opacity: [0.5, 0.7, 0.5],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: 'easeInOut'
										}}
									/>
									<div className="relative w-full max-w-[300px] mx-auto aspect-square">
										<motion.div
											className="relative w-full h-full rounded-xl overflow-hidden border-2 border-yellow-300 dark:border-yellow-700 shadow-2xl"
											whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
											transition={{ type: 'spring', stiffness: 300, damping: 20 }}
										>
											{siteConfig.profile_image ? (
												<Image
													src={siteConfig.profile_image}
													alt={`${siteConfig.name} - ${siteConfig.bio}`}
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
									<div className="flex items-center justify-between p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" role="tablist" aria-label="View toggle">
										{VIEWS.map((view) => (
											<button
												key={view}
												onClick={() => handleViewChange(view)}
												className={cn(
													"flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
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
											className="p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
											role="tabpanel"
											id={`${deferredView.toLowerCase()}-panel`}
											aria-labelledby={`${deferredView.toLowerCase()}-tab`}
										>
											<h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">
												{viewContent[deferredView].headline}
											</h3>
											<ul className="space-y-2" role="list">
												{viewContent[deferredView].bullets.map((bullet, idx) => (
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
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
							aria-label="Expertise areas"
						>
							{expertiseAreas.map((area, idx) => {
								const Icon = area.icon
								return (
									<motion.div
										key={idx}
										whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
										className="p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-300"
									>
										<div className={cn("inline-flex p-2 rounded-md bg-gradient-to-br", area.gradient, "mb-2 shadow-sm")}>
											<Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
										</div>
										<h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50 mb-1.5">
											{area.title}
										</h3>
										<p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
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

