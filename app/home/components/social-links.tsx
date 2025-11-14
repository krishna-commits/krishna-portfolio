'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { siteConfig } from "config/site"
import { Instagram, ExternalLink, Share2, Mail, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "app/theme/components/ui/button"
import { Icons } from "app/theme/components/theme/icons"
import { cn } from "app/theme/lib/utils"

const socialLinks = [
	{ 
		name: "GitHub", 
		url: siteConfig.links.github, 
		icon: Icons.gitHub,
		iconType: "component",
		gradient: "from-slate-700 to-slate-900",
		hoverGradient: "from-blue-400 to-sky-500",
		bgGradient: "from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40",
		borderClass: "border-slate-300 dark:border-slate-700 group-hover/social:border-blue-400 dark:group-hover/social:border-blue-500",
		textClass: "text-slate-700 dark:text-slate-300 group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400",
		description: "Open source contributions",
		ariaLabel: "GitHub profile"
	},
	{ 
		name: "LinkedIn", 
		url: siteConfig.links.linkedIn, 
		icon: Icons.linkedIn,
		iconType: "component",
		gradient: "from-yellow-400 via-amber-500 to-yellow-600",
		hoverGradient: "from-yellow-500 via-amber-600 to-orange-500",
		bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40",
		borderClass: "border-yellow-300 dark:border-yellow-700 group-hover/social:border-yellow-500 dark:group-hover/social:border-yellow-400",
		textClass: "text-yellow-700 dark:text-yellow-400 group-hover/social:text-yellow-800 dark:group-hover/social:text-yellow-300",
		description: "Professional network",
		ariaLabel: "LinkedIn profile"
	},
	{ 
		name: "ResearchGate", 
		url: siteConfig.links.researchgate, 
		icon: Icons.researchgate,
		iconType: "component",
		gradient: "from-orange-500 via-red-500 to-orange-600",
		hoverGradient: "from-orange-600 via-red-600 to-red-600",
		bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-900/40",
		borderClass: "border-orange-300 dark:border-orange-700 group-hover/social:border-orange-500 dark:group-hover/social:border-orange-400",
		textClass: "text-orange-700 dark:text-orange-400 group-hover/social:text-orange-800 dark:group-hover/social:text-orange-300",
		description: "Research publications",
		ariaLabel: "ResearchGate profile"
	},
	{ 
		name: "ORCID", 
		url: siteConfig.links.orcid, 
		icon: Icons.orcid,
		iconType: "component",
		gradient: "from-yellow-400 via-amber-500 to-yellow-600",
		hoverGradient: "from-yellow-500 via-amber-600 to-orange-500",
		bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40",
		borderClass: "border-amber-300 dark:border-amber-700 group-hover/social:border-amber-500 dark:group-hover/social:border-amber-400",
		textClass: "text-amber-700 dark:text-amber-400 group-hover/social:text-amber-800 dark:group-hover/social:text-amber-300",
		description: "Research profile",
		ariaLabel: "ORCID profile"
	},
	{ 
		name: "Medium", 
		url: siteConfig.links.medium, 
		icon: ExternalLink,
		iconType: "lucide",
		gradient: "from-blue-400 to-sky-500",
		hoverGradient: "from-blue-500 to-sky-600",
		bgGradient: "from-blue-50 to-sky-50 dark:from-blue-900/40 dark:to-sky-900/40",
		borderClass: "border-blue-300 dark:border-blue-700 group-hover/social:border-blue-500 dark:group-hover/social:border-blue-400",
		textClass: "text-blue-700 dark:text-blue-400 group-hover/social:text-blue-800 dark:group-hover/social:text-blue-300",
		description: "Technical articles",
		ariaLabel: "Medium profile"
	},
	{ 
		name: "Instagram", 
		url: siteConfig.links.instagram, 
		icon: Instagram,
		iconType: "lucide",
		gradient: "from-sky-400 via-blue-500 to-orange-500",
		hoverGradient: "from-sky-500 via-blue-600 to-orange-600",
		bgGradient: "from-sky-50 to-blue-50 dark:from-sky-900/40 dark:to-blue-900/40",
		borderClass: "border-sky-300 dark:border-sky-700 group-hover/social:border-sky-500 dark:group-hover/social:border-sky-400",
		textClass: "text-sky-700 dark:text-sky-400 group-hover/social:text-sky-800 dark:group-hover/social:text-sky-300",
		description: "Personal updates",
		ariaLabel: "Instagram profile"
	}
]

export function SocialLinks() {
	return (
		<section className="relative w-full" aria-labelledby="social-heading">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-8 sm:mb-10"
			>
				<div className="inline-flex items-center gap-3 mb-3">
					<motion.div
						whileHover={{ scale: 1.1, rotate: 5 }}
						className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg"
					>
						<Share2 className="h-5 w-5 text-white" />
					</motion.div>
					<div>
						<h2 id="social-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
							Connect & Collaborate
						</h2>
						<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-3xl mt-2 leading-relaxed">
							Let's build secure, scalable solutions together. Connect with me on these platforms or reach out directly.
						</p>
					</div>
				</div>
			</motion.div>

			{/* Social Links Grid - Enhanced Styling */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mb-8">
				{socialLinks.map((social, idx) => {
					const Icon = social.icon
					const isComponent = social.iconType === "component"
					
					return (
						<Link
							key={idx}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.ariaLabel}
							className="group/social touch-target"
						>
							<motion.div
								initial={{ opacity: 0, y: 20, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								transition={{ 
									delay: idx * 0.08, 
									duration: 0.4,
									type: "spring",
									stiffness: 200,
									damping: 20
								}}
								whileHover={{ 
									y: -8, 
									scale: 1.05,
									transition: { duration: 0.2 }
								}}
								whileTap={{ scale: 0.95 }}
								className={cn(
									"relative overflow-hidden rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-2xl p-5 sm:p-6 cursor-pointer",
									`bg-gradient-to-br ${social.bgGradient}`,
									social.borderClass
								)}
							>
								{/* Animated gradient top border */}
								<div className={cn(
									"absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r transition-all duration-300",
									social.gradient
								)} />
								
								{/* Subtle background pattern */}
								<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 group-hover/social:opacity-50 transition-opacity duration-300" />
								
								{/* Glow effect on hover */}
								<div className={cn(
									"absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover/social:opacity-20 blur-xl transition-opacity duration-300",
									social.hoverGradient
								)} />
								
								{/* Content */}
								<div className="relative space-y-3 text-center z-10">
									{/* Icon Container */}
									<motion.div
										whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
										transition={{ duration: 0.5 }}
										className={cn(
											"inline-flex p-3.5 rounded-xl bg-gradient-to-br shadow-lg group-hover/social:shadow-xl transition-all duration-300 mx-auto",
											social.gradient
										)}
									>
										{isComponent ? (
											<Icon className={cn(
												"h-6 w-6 transition-colors duration-300",
												social.name === "GitHub" 
													? "text-slate-100 group-hover/social:text-white"
													: "fill-current text-white"
											)} />
										) : (
											<Icon className="h-6 w-6 text-white" />
										)}
									</motion.div>
									
									{/* Text Content */}
									<div className="space-y-1">
										<h3 className={cn(
											"text-sm sm:text-base font-bold transition-colors duration-300",
											social.textClass
										)}>
											{social.name}
										</h3>
										<p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
											{social.description}
										</p>
									</div>
								</div>
								
								{/* Hover indicator */}
								<motion.div
									initial={{ scale: 0, opacity: 0 }}
									whileHover={{ scale: 1, opacity: 1 }}
									className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg border-2 border-white dark:border-slate-900"
								/>
							</motion.div>
						</Link>
					)
				})}
			</div>

			{/* CTA Section - Enhanced */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="relative overflow-hidden rounded-2xl border-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/80 to-white dark:from-slate-900 dark:via-slate-950/80 dark:to-slate-950 p-8 sm:p-10 shadow-xl"
			>
				{/* Animated gradient top border */}
				<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-400" />
				
				{/* Background pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(250,204,21,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
				
				{/* Glowing orbs */}
				<motion.div
					animate={{
						x: [0, 50, 0],
						y: [0, -30, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						repeatType: 'loop',
						ease: 'easeInOut',
					}}
					className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400/10 dark:bg-yellow-400/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						x: [0, -50, 0],
						y: [0, 30, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						repeatType: 'loop',
						ease: 'easeInOut',
					}}
					className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl"
				/>
				
				{/* Content */}
				<div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
					<div className="flex items-center gap-4">
						<motion.div
							whileHover={{ scale: 1.1, rotate: 5 }}
							className="p-4 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-xl"
						>
							<MessageSquare className="h-7 w-7 text-white" />
						</motion.div>
						<div>
							<h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
								Ready to Start a Project?
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
								Let's discuss how we can work together to build something amazing
							</p>
						</div>
					</div>
					<Link href="/contact" className="touch-target">
						<motion.div 
							whileHover={{ scale: 1.05, y: -2 }} 
							whileTap={{ scale: 0.95 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
							<Button className="relative bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl px-8 py-4 text-base font-bold transition-all duration-300">
								<Mail className="h-5 w-5 mr-2" />
								Get In Touch
								<ArrowRight className="h-5 w-5 ml-2" />
							</Button>
						</motion.div>
					</Link>
				</div>
			</motion.div>
		</section>
	)
}
