'use client'

import { motion } from "framer-motion"
import { Heart, Sparkles, Target, Zap } from "lucide-react"

export function PersonalNote() {
	return (
		<section id="about" className="relative w-full" aria-label="Personal note">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 lg:p-12"
			>
				<div className="relative space-y-8">
					{/* Header */}
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-md">
							<Heart className="h-6 w-6 text-white" aria-hidden="true" />
						</div>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
							What Drives Me
						</h2>
					</div>

					{/* Content */}
					<div className="space-y-8">
						{/* Main Statement */}
						<div className="space-y-5 max-w-3xl">
							<p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight">
								I build <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">secure, scalable cloud systems</span> that protect organizations from evolving threats.
							</p>
							<p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
								My passion lies in combining <span className="font-semibold text-slate-900 dark:text-slate-50">security engineering</span> with <span className="font-semibold text-slate-900 dark:text-slate-50">automation</span>, creating <span className="bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent font-semibold">defense-in-depth architectures</span> that detect, prevent, and respond to attacks automatically.
							</p>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.1 }}
								whileHover={{ scale: 1.02, y: -4 }}
								className="p-5 rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 hover:shadow-lg transition-all duration-300"
							>
								<div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 mb-3 shadow-md">
									<Target className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Security-First Thinking</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									Designing systems with security as the foundation, not an afterthought. Threat modeling and risk assessment guide every architectural decision.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
								whileHover={{ scale: 1.02, y: -4 }}
								className="p-5 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20 hover:shadow-lg transition-all duration-300"
							>
								<div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 mb-3 shadow-md">
									<Sparkles className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Automated Defense</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									Building security automation that scales—from CI/CD security gates to real-time threat detection and automated incident response.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 }}
								whileHover={{ scale: 1.02, y: -4 }}
								className="p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-sky-50/50 dark:from-blue-950/20 dark:to-sky-950/20 hover:shadow-lg transition-all duration-300"
							>
								<div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-400 to-sky-500 mb-3 shadow-md">
									<Zap className="h-5 w-5 text-white" />
								</div>
								<h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Security Research</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									Contributing to security research and open-source security tools. Publishing findings and sharing knowledge with the security community.
								</p>
							</motion.div>
						</div>

						{/* Personal Philosophy */}
						<div className="relative pt-6 border-t-2 border-slate-200 dark:border-slate-800 max-w-3xl">
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0 mt-1">
									<div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 via-amber-500/20 to-orange-500/20 border border-yellow-300/30 dark:border-yellow-700/30">
										<Heart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
									</div>
								</div>
								<div className="flex-1 space-y-4">
									<p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
										When I'm not securing cloud infrastructure, I'm <span className="font-semibold text-slate-900 dark:text-slate-50">researching new attack vectors</span>, <span className="font-semibold text-slate-900 dark:text-slate-50">contributing to security tools</span>, and <span className="font-semibold text-slate-900 dark:text-slate-50">mentoring the next generation</span> of security engineers.
									</p>
									<p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
										<span className="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 bg-clip-text text-transparent">Security is a team sport</span>. We're stronger together.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	)
}
