"use client"

import * as React from "react"
import Link from "next/link"
import { siteConfig } from "config/site"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "app/theme/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { Icons } from "app/theme/components/theme/icons"
import { Home, Code2, BookOpen, GraduationCap, Lightbulb, FolderKanban, Mail, Shield, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "app/theme/components/ui/button"

const items: Array<{ 
	title: string
	href: string
	icon: any
	description?: string
	ariaLabel: string
	gradient: string
}> = [
	{ 
		title: "Home", 
		href: "/", 
		icon: Home,
		description: "Overview and introduction", 
		ariaLabel: "Navigate to home page",
		gradient: "from-yellow-400 via-amber-500 to-yellow-600" // Yellow, Gold, Mustard vibrant
	},
	{ 
		title: "Projects", 
		href: "/projects", 
		icon: FolderKanban,
		description: "Portfolio showcase", 
		ariaLabel: "Navigate to projects page",
		gradient: "from-yellow-500 to-amber-600" // Yellow to Gold
	},
	{ 
		title: "Code Canvas", 
		href: "/codecanvas", 
		icon: Code2,
		description: "Technical projects and code", 
		ariaLabel: "Navigate to code canvas page",
		gradient: "from-blue-400 to-sky-500" // Light Blue vibrant
	},
	{ 
		title: "Blog", 
		href: "/blog", 
		icon: BookOpen,
		description: "Articles and insights", 
		ariaLabel: "Navigate to blog page",
		gradient: "from-orange-500 via-red-500 to-orange-600" // Orange, Red, Gold vibrant
	},
	{ 
		title: "Research Core", 
		href: "/research-core", 
		icon: GraduationCap,
		description: "Academic research and publications", 
		ariaLabel: "Navigate to research core page",
		gradient: "from-red-500 via-orange-500 to-red-600" // Red, Orange, Red vibrant
	},
	{ 
		title: "Mantras", 
		href: "/mantras", 
		icon: Lightbulb,
		description: "Philosophy and principles", 
		ariaLabel: "Navigate to mantras page",
		gradient: "from-blue-400 to-sky-500" // Light Blue vibrant
	},
	{ 
		title: "Contact", 
		href: "/contact", 
		icon: Mail,
		description: "Get in touch", 
		ariaLabel: "Navigate to contact page",
		gradient: "from-sky-400 to-blue-500" // Light Blue vibrant
	},
]

export function MobileNav() {
	const pathname = usePathname()
	const [open, setOpen] = React.useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					aria-label="Open navigation menu"
					className="lg:hidden touch-target relative p-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all"
				>
					<Menu className="h-3 w-3 text-slate-700 dark:text-slate-300" />
				</motion.button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[90%] sm:w-[420px] p-0 border-r-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50 overflow-y-auto">
				{/* Enhanced Header */}
				<div className="relative px-6 py-8 border-b-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/30">
					<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-400" />
					<SheetHeader className="relative">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg"
								>
									<Shield className="h-6 w-6 text-white" />
								</motion.div>
								<div>
									<SheetTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 via-yellow-700 to-slate-900 dark:from-slate-100 dark:via-yellow-300 dark:to-slate-100 bg-clip-text text-transparent">
										{siteConfig.title}
									</SheetTitle>
									<SheetDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
										Navigate the site
									</SheetDescription>
								</div>
							</div>
							<SheetClose asChild>
								<motion.button
									whileHover={{ scale: 1.1, rotate: 90 }}
									whileTap={{ scale: 0.9 }}
									className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
									aria-label="Close menu"
								>
									<X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
								</motion.button>
							</SheetClose>
						</div>
					</SheetHeader>
				</div>
				
				{/* Navigation Items */}
				<nav className="p-6 space-y-3" aria-label="Mobile navigation">
					{items.map((item, idx) => {
						// Normalize pathname for blog posts and project pages
						const normalizedPathname = pathname?.includes('/blog/') ? '/blog' : 
						                          pathname?.includes('/projects') ? '/projects' : pathname;
						const active = normalizedPathname === item.href || (item.href !== '/' && normalizedPathname?.startsWith(item.href))
						const Icon = item.icon
						return (
							<SheetClose key={item.href} asChild>
								<Link
									href={item.href}
									aria-label={item.ariaLabel}
									aria-current={active ? "page" : undefined}
									className="block group"
								>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.05 }}
										whileHover={{ x: 5, scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className={`relative rounded-xl p-4 transition-all duration-300 ${
											active 
												? `bg-gradient-to-r ${item.gradient} text-white shadow-xl` 
												: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700"
										}`}
									>
										<div className="flex items-center gap-4">
											<div className={`p-3 rounded-xl ${
												active 
													? "bg-white/20 shadow-lg" 
													: `bg-gradient-to-br ${item.gradient} shadow-md`
											} flex-shrink-0`}>
												<Icon className={`h-5 w-5 ${
													active ? "text-white" : "text-white"
												}`} />
											</div>
											<div className="flex-1 min-w-0">
												<div className={`font-bold text-base ${
													active ? "text-white" : "text-slate-900 dark:text-slate-100"
												}`}>
													{item.title}
												</div>
												{item.description && (
													<div className={`text-xs mt-1 ${
														active 
															? "text-white/90" 
															: "text-slate-600 dark:text-slate-400"
													}`}>
														{item.description}
													</div>
												)}
											</div>
											{active && (
												<motion.div
													initial={{ scale: 0, rotate: -180 }}
													animate={{ scale: 1, rotate: 0 }}
													className="w-2.5 h-2.5 bg-white rounded-full shadow-lg flex-shrink-0"
												/>
											)}
											{!active && (
												<ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
											)}
										</div>
									</motion.div>
								</Link>
							</SheetClose>
						)
					})}
				</nav>
				
				{/* Enhanced Social Links Section */}
				<div className="px-6 py-6 border-t-2 border-slate-200 dark:border-slate-800">
					<div className="mb-4">
						<h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">Connect Socially</h3>
						<p className="text-xs text-slate-600 dark:text-slate-400">Follow me on these platforms</p>
					</div>
					<div className="grid grid-cols-4 gap-3">
						<Link
							href={siteConfig.links.github}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social"
							aria-label="GitHub profile"
						>
							<motion.div
								whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
								whileTap={{ scale: 0.9 }}
								className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 border-2 border-slate-200 dark:border-slate-700 group-hover/social:border-blue-400/50 dark:group-hover/social:border-blue-500/50 transition-all shadow-md hover:shadow-lg"
							>
								<Icons.gitHub className="h-6 w-6 text-slate-700 dark:text-slate-300 group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400 transition-colors mx-auto" />
							</motion.div>
						</Link>
						<Link
							href={siteConfig.links.linkedIn}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social"
							aria-label="LinkedIn profile"
						>
							<motion.div
								whileHover={{ scale: 1.1, y: -3, rotate: -5 }}
								whileTap={{ scale: 0.9 }}
								className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-800/40 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-800/60 dark:hover:to-amber-700/60 border-2 border-yellow-200 dark:border-yellow-700 group-hover/social:border-yellow-400 dark:group-hover/social:border-yellow-500 transition-all shadow-md hover:shadow-lg"
							>
								<Icons.linkedIn className="h-6 w-6 fill-current text-yellow-700 dark:text-yellow-400 group-hover/social:text-yellow-800 dark:group-hover/social:text-yellow-300 transition-colors mx-auto" />
							</motion.div>
						</Link>
						<Link
							href={siteConfig.links.researchgate}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social"
							aria-label="ResearchGate profile"
						>
							<motion.div
								whileHover={{ scale: 1.1, y: -3 }}
								whileTap={{ scale: 0.9 }}
								className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-800/40 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-800/60 dark:hover:to-red-700/60 border-2 border-red-300 dark:border-red-700 group-hover/social:border-red-400 dark:group-hover/social:border-red-500 transition-all shadow-md hover:shadow-lg"
							>
								<Icons.researchgate className="h-6 w-6 fill-current text-red-600 dark:text-red-400 group-hover/social:text-red-700 dark:group-hover/social:text-red-300 transition-colors mx-auto" />
							</motion.div>
						</Link>
						<Link
							href={siteConfig.links.orcid}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social"
							aria-label="ORCID profile"
						>
							<motion.div
								whileHover={{ scale: 1.1, y: -3 }}
								whileTap={{ scale: 0.9 }}
								className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-800/40 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-800/60 dark:hover:to-amber-700/60 border-2 border-amber-300 dark:border-amber-700 group-hover/social:border-amber-400 dark:group-hover/social:border-amber-500 transition-all shadow-md hover:shadow-lg"
							>
								<Icons.orcid className="h-6 w-6 fill-current text-amber-600 dark:text-amber-400 group-hover/social:text-amber-700 dark:group-hover/social:text-amber-300 transition-colors mx-auto" />
							</motion.div>
						</Link>
					</div>
				</div>
				
				{/* Enhanced Contact CTA */}
				<div className="px-6 py-6 border-t-2 border-slate-200 dark:border-slate-800">
					<SheetClose asChild>
						<Link href="/contact" className="block">
							<motion.div
								whileHover={{ scale: 1.02, y: -2 }}
								whileTap={{ scale: 0.98 }}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl blur-xl opacity-50" />
								<Button className="relative w-full bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl px-6 py-4 text-base font-bold">
									<Mail className="h-5 w-5 mr-2.5" />
									Get In Touch
									<ArrowRight className="h-5 w-5 ml-2.5" />
								</Button>
							</motion.div>
						</Link>
					</SheetClose>
				</div>
				
				{/* Theme Toggle */}
				<div className="px-6 py-6 border-t-2 border-slate-200 dark:border-slate-800">
					<div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
						<div>
							<span className="text-sm font-bold text-slate-900 dark:text-slate-50 block">Theme</span>
							<span className="text-xs text-slate-600 dark:text-slate-400">Switch between light and dark</span>
						</div>
						<ThemeToggle />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
