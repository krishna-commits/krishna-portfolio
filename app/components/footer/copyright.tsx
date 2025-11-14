'use client'

import { siteConfig } from "config/site";
import Link from "next/link";
import { Icons } from "app/theme/components/theme/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Mail, ArrowUp, Heart, Sparkles, Code2, BookOpen, GraduationCap, FolderKanban } from "lucide-react";
import { Button } from "app/theme/components/ui/button";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export default function Copyright(){
	const [showScrollTop, setShowScrollTop] = useState(false);
	const { scrollYProgress } = useScroll();
	const footerOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 400);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const quickLinks = [
		{ href: "/", label: "Home", icon: Shield, color: "from-yellow-400 via-amber-500 to-yellow-600" },
		{ href: "/research-core", label: "Research Core", icon: GraduationCap, color: "from-orange-500 via-red-500 to-orange-600" },
		{ href: "/codecanvas", label: "Code Canvas", icon: Code2, color: "from-blue-400 to-sky-500" },
		{ href: "/blog", label: "Blog", icon: BookOpen, color: "from-orange-500 via-red-500 to-orange-600" },
		{ href: "/projects", label: "Projects", icon: FolderKanban, color: "from-yellow-500 to-amber-600" },
		{ href: "/contact", label: "Contact", icon: Mail, color: "from-sky-400 to-blue-500" },
	];

	const socialLinks = [
		{ 
			href: siteConfig.links.github, 
			icon: Icons.gitHub, 
			label: "GitHub",
			color: "from-slate-700 to-slate-900",
			bgColor: "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
			hoverColor: "group-hover/social:from-blue-400 group-hover/social:to-sky-500"
		},
		{ 
			href: siteConfig.links.linkedIn, 
			icon: Icons.linkedIn, 
			label: "LinkedIn",
			color: "from-yellow-400 via-amber-500 to-yellow-600",
			bgColor: "from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-800/40",
			hoverColor: "group-hover/social:from-yellow-500 group-hover/social:to-amber-600"
		},
		{ 
			href: siteConfig.links.researchgate, 
			icon: Icons.researchgate, 
			label: "ResearchGate",
			color: "from-orange-500 via-red-500 to-orange-600",
			bgColor: "from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-800/40",
			hoverColor: "group-hover/social:from-orange-600 group-hover/social:to-red-600"
		},
		{ 
			href: siteConfig.links.orcid, 
			icon: Icons.orcid, 
			label: "ORCID",
			color: "from-yellow-400 via-amber-500 to-yellow-600",
			bgColor: "from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-800/40",
			hoverColor: "group-hover/social:from-yellow-500 group-hover/social:to-amber-600"
		},
	];

	return (
		<motion.footer 
			style={{ opacity: footerOpacity }}
			className="relative mt-auto border-t-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950 backdrop-blur-2xl overflow-hidden"
		>
			{/* Animated gradient top border - Vibrant colors: Yellow, Gold, Orange, Red, Light Blue */}
			<div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden">
				<motion.div
					className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-400"
					style={{
						width: '200%',
						x: useTransform(scrollYProgress, [0, 1], ['0%', '-50%']),
					}}
				/>
			</div>

			{/* Animated background pattern */}
			<div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
			</div>

			{/* Glowing orbs - Vibrant colors */}
			<motion.div
				className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 dark:bg-yellow-400/20 rounded-full blur-3xl"
				animate={{
					x: [0, 100, 0],
					y: [0, -50, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					repeatType: 'loop',
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl"
				animate={{
					x: [0, -100, 0],
					y: [0, 50, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					repeatType: 'loop',
					ease: 'easeInOut',
				}}
			/>
			
			{/* Full width layout - no container margins, only internal padding */}
			<div className="relative w-full">
				<div className="w-full mx-auto">
					<div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 xl:py-28">
						{/* Main Footer Content */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 xl:gap-16 mb-12 sm:mb-14 lg:mb-16">
							{/* Brand Section - Enhanced */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, type: "spring" }}
								className="md:col-span-5 space-y-5 sm:space-y-6"
							>
								{/* Logo */}
								<div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
									<motion.div
										whileHover={{ scale: 1.1, rotate: 5 }}
										className="relative"
									>
										<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/50 via-amber-500/50 to-orange-500/50 blur-xl opacity-50" />
										<div className="relative p-3 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 via-orange-500 to-red-500 shadow-2xl border-2 border-white/20">
											<Shield className="h-7 w-7 text-white" />
										</div>
									</motion.div>
									<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-yellow-700 to-slate-900 dark:from-slate-100 dark:via-amber-300 dark:to-slate-100 bg-clip-text text-transparent">
										{siteConfig.title}
									</h3>
								</div>
								
								<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
									{siteConfig.home.description}
								</p>
								
								{/* Made with love */}
								<motion.div 
									className="flex items-center gap-3 pt-2"
									whileHover={{ scale: 1.05 }}
								>
									<span className="text-base text-slate-500 dark:text-slate-500 font-medium">Made with</span>
									<motion.div
										animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
										transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
									>
										<Heart className="h-5 w-5 text-red-500 fill-red-500" />
									</motion.div>
									<span className="text-base text-slate-500 dark:text-slate-500 font-medium">by {siteConfig.name}</span>
									<motion.div
										animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
										transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
										className="ml-2"
									>
										<Sparkles className="h-5 w-5 text-amber-500" />
									</motion.div>
								</motion.div>
							</motion.div>

							{/* Quick Links - Enhanced with Icons */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
								className="md:col-span-4 space-y-5 sm:space-y-6"
							>
								<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
									Quick Links
								</h4>
								<nav className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
									{quickLinks.map((link, idx) => {
										const Icon = link.icon;
										return (
											<Link
												key={link.href}
												href={link.href}
												className="group"
											>
												<motion.div
													whileHover={{ x: 5, scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm hover:shadow-md"
												>
													<div className={`p-2 rounded-lg bg-gradient-to-br ${link.color} shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
														<Icon className="h-4 w-4 text-white" />
													</div>
													<span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
														{link.label}
													</span>
												</motion.div>
											</Link>
										);
									})}
								</nav>
							</motion.div>

							{/* Social & Contact - Enhanced */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
								className="md:col-span-3 space-y-5 sm:space-y-6"
							>
								<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
									Connect
								</h4>
								
								{/* Enhanced Social Links */}
								<div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
									{socialLinks.map((social, idx) => {
										const Icon = social.icon;
										return (
											<Link
												key={idx}
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												aria-label={`${social.label} profile`}
												className="group/social"
											>
												<motion.div 
													whileHover={{ scale: 1.1, y: -3, rotate: idx % 2 === 0 ? 5 : -5 }}
													whileTap={{ scale: 0.95 }}
													transition={{ type: "spring", stiffness: 400, damping: 17 }}
													className={`relative p-3.5 sm:p-4 rounded-xl bg-gradient-to-br ${social.bgColor} ${social.hoverColor} transition-all duration-300 border-2 border-slate-200/50 dark:border-slate-700/50 group-hover/social:border-opacity-100 shadow-lg group-hover/social:shadow-xl group-hover/social:shadow-blue-500/20`}
												>
													<Icon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-300 ${
														social.label === 'GitHub' 
															? 'text-slate-700 dark:text-slate-300 group-hover/social:text-blue-600 dark:group-hover/social:text-blue-400' 
															: social.label === 'LinkedIn'
															? 'fill-current text-yellow-700 dark:text-yellow-400 group-hover/social:text-yellow-800 dark:group-hover/social:text-yellow-300'
															: social.label === 'ResearchGate'
															? 'fill-current text-orange-600 dark:text-orange-400 group-hover/social:text-red-600 dark:group-hover/social:text-red-400'
															: 'fill-current text-amber-600 dark:text-amber-400 group-hover/social:text-amber-700 dark:group-hover/social:text-amber-300'
													} relative z-10 mx-auto`} />
													<motion.div
														className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.color} opacity-0 group-hover/social:opacity-20 blur-md`}
														transition={{ duration: 0.3 }}
													/>
												</motion.div>
											</Link>
										);
									})}
        </div>

								{/* Enhanced Contact Button */}
								<Link href="/contact" className="block">
									<motion.div 
										whileHover={{ scale: 1.05, y: -3 }} 
										whileTap={{ scale: 0.95 }}
										className="relative"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
										<Button className="relative w-full bg-gradient-to-r from-yellow-400 via-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold transition-all duration-300">
											<Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
											Get In Touch
										</Button>
									</motion.div>
								</Link>
							</motion.div>
      </div>

						{/* Bottom Bar - Enhanced */}
						<motion.div 
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="pt-8 sm:pt-10 lg:pt-12 border-t-2 border-slate-200/50 dark:border-slate-800/50"
						>
							<div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
								<motion.p 
									className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-semibold text-center sm:text-left"
									whileHover={{ scale: 1.05 }}
								>
									&copy; {new Date().getFullYear()} {siteConfig.copyright.text}. All rights reserved.
								</motion.p>
								
								{/* Enhanced Scroll to Top */}
								<AnimatePresence>
									{showScrollTop && (
										<motion.button
											initial={{ opacity: 0, scale: 0, rotate: -180 }}
											animate={{ opacity: 1, scale: 1, rotate: 0 }}
											exit={{ opacity: 0, scale: 0, rotate: 180 }}
											whileHover={{ scale: 1.15, y: -5, rotate: -5 }}
											whileTap={{ scale: 0.9 }}
											onClick={scrollToTop}
											className="relative p-3.5 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 via-orange-500 to-red-500 text-white shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 border-2 border-white/20"
											aria-label="Scroll to top"
										>
											<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 opacity-0 hover:opacity-100 blur-md transition-opacity" />
											<ArrowUp className="h-5 w-5 relative z-10" />
										</motion.button>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.footer>
	)
}
