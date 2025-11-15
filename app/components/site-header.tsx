'use client'

import Link from "next/link"
import { buttonVariants } from "app/theme/components/ui/button"
import { Navbar } from "./nav"
import { siteConfig } from "config/site"
import { Icons } from "app/theme/components/theme/icons"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { GlobalSearch } from "./global-search"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield } from "lucide-react"
import { useState, useEffect } from "react"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "app/theme/components/ui/sidebar"

export function SiteHeader() {
	const [scrolled, setScrolled] = useState(false)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
	const { scrollY } = useScroll()

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)
		
		const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mediaQuery.addEventListener('change', handleChange)
		
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		
		return () => {
			window.removeEventListener('scroll', handleScroll)
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	return (
		<header 
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled 
					? 'border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg' 
					: 'border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
			}`}
			role="banner"
		>
			{/* Vibrant gradient top border - Yellow, Gold, Orange, Red, Light Blue */}
			<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-400" />
			
			{/* Full width container */}
			<div className="relative w-full">
				<div className="w-full mx-auto max-w-7xl">
					<div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
						{/* Left Section: Mobile Nav + Logo + Navbar */}
						<div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 overflow-hidden">
							<MobileNav />
							
							{/* Logo */}
							<motion.div
								initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
								animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
								transition={prefersReducedMotion ? {} : { duration: 0.3, ease: "easeOut" }}
								className="flex items-center flex-shrink-0"
							>
								<Link 
									href="/" 
									className="flex items-center gap-1 touch-target group"
									aria-label="Go to homepage"
								>
									{/* Logo Container */}
									<motion.div 
										whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
										whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
										className="relative"
									>
										<div className="relative p-0.5 rounded-md bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-sm group-hover:shadow-md transition-all duration-200">
											<Shield className="h-3 w-3 text-white" />
										</div>
									</motion.div>
									
									{/* Logo Text */}
									<span className="hidden sm:inline-block font-bold text-xs sm:text-sm bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent whitespace-nowrap">
										{siteConfig.title}
									</span>
								</Link>
							</motion.div>

							{/* Divider */}
							<div className="hidden lg:block h-5 w-px bg-slate-300 dark:bg-slate-700 mx-2 flex-shrink-0" />
							
							{/* Desktop Navbar - Show on lg screens and above */}
							<Navbar className="hidden lg:flex flex-1 min-w-0" />
						</div>
						
						{/* Right Section: Social Links + Theme Toggle */}
						<div className="flex items-center gap-2 flex-shrink-0">
							<nav className="flex items-center gap-2" aria-label="Social links and tools">
								<GlobalSearch />
								
								{/* Social Links - Show on xl screens and above, hide on 2xl when secondary nav shows */}
								<motion.div 
									initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
									transition={prefersReducedMotion ? {} : { duration: 0.3, delay: 0.1, ease: "easeOut" }}
									className="hidden xl:flex 2xl:hidden items-center gap-1.5"
								>
									{/* GitHub */}
									<Link
										href={siteConfig.links.github}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="GitHub profile"
										className="touch-target group/social"
									>
										<motion.div 
											whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
											whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
											transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 17 }}
											className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700"
										>
											<Icons.gitHub className="h-4 w-4 text-slate-700 dark:text-slate-300 group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400" />
										</motion.div>
									</Link>

									{/* LinkedIn */}
									<Link
										href={siteConfig.links.linkedIn}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="LinkedIn profile"
										className="touch-target group/social"
									>
										<motion.div 
											whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
											whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
											transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 17 }}
											className="relative p-2 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/60 dark:hover:to-amber-900/60 transition-all duration-200 border border-yellow-200 dark:border-yellow-700"
										>
											<Icons.linkedIn className="h-4 w-4 fill-current text-orange-600 dark:text-orange-400" />
										</motion.div>
									</Link>

									{/* ResearchGate */}
									<Link
										href={siteConfig.links.researchgate}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="ResearchGate profile"
										className="touch-target group/social"
									>
										<motion.div 
											whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
											whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
											transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 17 }}
											className="relative p-2 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-900/40 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/60 dark:hover:to-red-900/60 transition-all duration-200 border border-red-300 dark:border-red-700"
										>
											<Icons.researchgate className="h-4 w-4 fill-current text-red-600 dark:text-red-400" />
										</motion.div>
									</Link>

									{/* ORCID */}
									<Link
										href={siteConfig.links.orcid}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="ORCID profile"
										className="touch-target group/social"
									>
										<motion.div 
											whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
											whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
											transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 400, damping: 17 }}
											className="relative p-2 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-900/60 dark:hover:to-amber-900/60 transition-all duration-200 border border-yellow-200 dark:border-yellow-700"
										>
											<Icons.orcid className="h-4 w-4 fill-current text-amber-600 dark:text-amber-400" />
										</motion.div>
									</Link>
								</motion.div>

								{/* Divider - Show when social links are visible */}
								<div className="hidden xl:block 2xl:hidden h-5 w-px bg-slate-300 dark:bg-slate-700 mx-2" />
								
								<ThemeToggle />
								<SidebarTrigger className="rotate-180 lg:hidden touch-target" aria-label="Open sidebar" />
							</nav>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
