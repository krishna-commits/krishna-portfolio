'use client'

import { motion } from "framer-motion"
import { Shield, Code, Cloud, Server, Eye, Container, CheckCircle2, ArrowRight } from "lucide-react"
import { PAGE_CARD, PAGE_ICON_CHIP } from "lib/page-layout"
import { cn } from "app/theme/lib/utils"

export function SecurityFirstApproach() {
	const methodologies = [
		{
			icon: Code,
			title: "Shift Left Security",
			description:
				"Automated SAST/DAST scanning in CI/CD pipelines, secret detection, dependency vulnerability scanning, and security policy enforcement before code reaches production.",
			delay: 0,
		},
		{
			icon: Server,
			title: "Infrastructure Hardening",
			description:
				"IaC security scanning (Trivy, Terrascan), CIS benchmark compliance, network segmentation, least-privilege IAM, and container security hardening.",
			delay: 0.1,
		},
		{
			icon: Eye,
			title: "Continuous Security Monitoring",
			description:
				"Real-time threat detection using SIEM integration, automated incident response playbooks, security event correlation, and runtime application self-protection (RASP).",
			delay: 0.2,
		},
	]

	const securityPipeline = [
		{ stage: "Code", icon: Code, description: "SAST, Secret Detection" },
		{ stage: "Build", icon: Container, description: "Container Scanning" },
		{ stage: "Test", icon: CheckCircle2, description: "DAST, Security Tests" },
		{ stage: "Deploy", icon: Cloud, description: "IaC Validation" },
		{ stage: "Monitor", icon: Eye, description: "Runtime Protection" },
	]

	return (
		<section id="security-approach" className="relative w-full" aria-label="Security-first approach">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-8 sm:mb-10 md:mb-12"
			>
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
					<span className={PAGE_ICON_CHIP}>
						<Shield className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
					</span>
					<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
						Security-First Approach
					</h2>
				</div>
				<p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
					Integrating <span className="font-semibold text-foreground">security at every stage</span>, from{" "}
					<span className="font-semibold text-primary">code commit</span> to{" "}
					<span className="font-semibold text-primary">production monitoring</span>, using shift-left principles,
					automated threat detection, and continuous validation to build resilient systems.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="mb-10 sm:mb-12"
			>
				<div className={cn(PAGE_CARD, "p-5 sm:p-6 md:p-8 lg:p-10")}>
					<h3 className="mb-6 text-center text-lg font-semibold text-foreground sm:mb-8 sm:text-xl md:text-2xl">
						Security Pipeline
					</h3>

					<div className="relative">
						<div
							className="absolute top-1/2 left-0 right-0 z-0 hidden h-px -translate-y-1/2 bg-border sm:block"
							aria-hidden
						/>

						<div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:grid-cols-5">
							{securityPipeline.map((stage, idx) => {
								const Icon = stage.icon
								return (
									<motion.div
										key={idx}
										initial={{ opacity: 0, scale: 0.95 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ delay: idx * 0.1, duration: 0.4 }}
										whileHover={{ y: -2 }}
										className="relative"
										data-cursor="pointer"
									>
										<div className="rounded-xl border border-border bg-muted/30 p-4 transition-shadow hover:shadow-sm sm:p-5">
											<div className="flex flex-col items-center space-y-3 text-center">
												<span className="inline-flex rounded-lg border border-border bg-background p-2.5 text-foreground">
													<Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
												</span>
												<div>
													<div className="mb-1 text-sm font-semibold text-foreground sm:text-base">
														{stage.stage}
													</div>
													<div className="text-xs text-muted-foreground">{stage.description}</div>
												</div>
											</div>
										</div>
										{idx < securityPipeline.length - 1 && (
											<div className="absolute top-1/2 -right-3 z-20 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background sm:flex">
												<ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden />
											</div>
										)}
									</motion.div>
								)
							})}
						</div>
					</div>
				</div>
			</motion.div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
				{methodologies.map((method, idx) => {
					const Icon = method.icon
					return (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ delay: method.delay, duration: 0.5 }}
							whileHover={{ y: -2 }}
							className={cn(PAGE_CARD, "p-6 transition-shadow hover:shadow-md")}
							data-cursor="pointer"
						>
							<div className="space-y-4">
								<span className="inline-flex rounded-lg border border-border bg-muted p-3 text-foreground">
									<Icon className="h-6 w-6" aria-hidden />
								</span>
								<div className="space-y-3">
									<h3 className="text-xl font-semibold text-foreground">{method.title}</h3>
									<p className="text-base leading-relaxed text-muted-foreground">{method.description}</p>
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>
		</section>
	)
}
