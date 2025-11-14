'use client'

import { motion } from "framer-motion"
import { Shield, Code, Cloud, Server, Eye, Container, CheckCircle2, ArrowRight } from "lucide-react"

export function SecurityFirstApproach() {
	const methodologies = [
		{
			icon: Code,
			title: "Shift Left Security",
			description: "Automated SAST/DAST scanning in CI/CD pipelines, secret detection, dependency vulnerability scanning, and security policy enforcement before code reaches production.",
			gradient: "from-blue-400 to-sky-500",
			delay: 0,
		},
		{
			icon: Server,
			title: "Infrastructure Hardening",
			description: "IaC security scanning (Trivy, Terrascan), CIS benchmark compliance, network segmentation, least-privilege IAM, and container security hardening.",
			gradient: "from-orange-500 via-red-500 to-orange-600",
			delay: 0.1,
		},
		{
			icon: Eye,
			title: "Continuous Security Monitoring",
			description: "Real-time threat detection using SIEM integration, automated incident response playbooks, security event correlation, and runtime application self-protection (RASP).",
			gradient: "from-sky-400 to-blue-500",
			delay: 0.2,
		},
	]

	const securityPipeline = [
		{ stage: "Code", icon: Code, description: "SAST, Secret Detection", color: "from-blue-400 to-sky-500" }, // Light Blue vibrant
		{ stage: "Build", icon: Container, description: "Container Scanning", color: "from-yellow-400 via-amber-500 to-yellow-600" }, // Yellow, Gold, Mustard vibrant
		{ stage: "Test", icon: CheckCircle2, description: "DAST, Security Tests", color: "from-sky-400 to-blue-500" }, // Light Blue vibrant
		{ stage: "Deploy", icon: Cloud, description: "IaC Validation", color: "from-orange-500 via-red-500 to-orange-600" }, // Orange, Red, Gold vibrant
		{ stage: "Monitor", icon: Eye, description: "Runtime Protection", color: "from-blue-400 to-sky-500" }, // Light Blue vibrant
	]

	return (
		<section id="security-approach" className="relative w-full" aria-label="Security-first approach">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-10 sm:mb-12"
			>
				<div className="inline-flex items-center gap-3 mb-4">
					<div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 shadow-md">
						<Shield className="h-6 w-6 text-white" aria-hidden="true" />
					</div>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						Security-First Approach
					</h2>
				</div>
				<div className="space-y-5 max-w-3xl">
					<p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed">
						Integrating <span className="font-semibold text-slate-900 dark:text-slate-50">security at every stage</span>, from <span className="bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent font-semibold">code commit</span> to <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">production monitoring</span>, using <span className="font-semibold text-slate-900 dark:text-slate-50">shift-left principles</span>, <span className="font-semibold text-slate-900 dark:text-slate-50">automated threat detection</span>, and <span className="font-semibold text-slate-900 dark:text-slate-50">continuous security validation</span> to build <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent font-semibold">resilient, attack-resistant systems</span>.
					</p>
				</div>
			</motion.div>

			{/* Security Pipeline Visualization */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="mb-10 sm:mb-12"
			>
				<div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10">
					<h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8 text-center">
						Security Pipeline
					</h3>
					
					{/* Pipeline Stages */}
					<div className="relative">
						{/* Connection Line - Vibrant colors: Yellow, Gold, Orange, Red, Light Blue */}
						<div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-yellow-400 via-amber-500 via-orange-500 via-red-500 to-blue-500 -translate-y-1/2 z-0 opacity-30" />
						
						<div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8 relative z-10">
							{securityPipeline.map((stage, idx) => {
								const Icon = stage.icon
								return (
									<motion.div
										key={idx}
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ delay: idx * 0.1, duration: 0.4 }}
										whileHover={{ scale: 1.05, y: -4 }}
										className="relative"
									>
										<div className={`relative p-6 rounded-xl bg-gradient-to-br ${stage.color} shadow-sm hover:shadow-md transition-all duration-300`}>
											<div className="flex flex-col items-center text-center space-y-3">
												<div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
													<Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
												</div>
												<div>
													<div className="text-sm sm:text-base font-bold text-white mb-1">
														{stage.stage}
													</div>
													<div className="text-xs text-white/90">
														{stage.description}
													</div>
												</div>
											</div>
										</div>
										{idx < securityPipeline.length - 1 && (
											<div className="hidden sm:block absolute top-1/2 -right-4 w-8 h-8 bg-white dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center z-20">
												<ArrowRight className="h-4 w-4 text-slate-400" />
											</div>
										)}
									</motion.div>
								)
							})}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Methodologies Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{methodologies.map((method, idx) => {
					const Icon = method.icon
					return (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ delay: method.delay, duration: 0.5 }}
							whileHover={{ scale: 1.02, y: -4 }}
							className="relative p-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300"
						>
							<div className="space-y-4">
								<div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${method.gradient} shadow-md`}>
									<Icon className="h-6 w-6 text-white" aria-hidden="true" />
								</div>
								
								<div className="space-y-3">
									<h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
										{method.title}
									</h3>
									<p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
										{method.description}
									</p>
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>
		</section>
	)
}
