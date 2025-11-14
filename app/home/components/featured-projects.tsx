'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { allProjects } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import { ArrowRight, ExternalLink, Github, Rocket } from "lucide-react"
import { memo, useMemo } from "react"

export const FeaturedProjects = memo(function FeaturedProjects() {
	const featuredProjects = useMemo(
		() =>
			allProjects
				.filter((p: any) => p.highlight)
				.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
				.slice(0, 6),
		[]
	)

	if (featuredProjects.length === 0) return null

	return (
		<section className="relative w-full">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-10 sm:mb-12"
			>
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
					<div className="space-y-3">
						<div className="inline-flex items-center gap-3">
							<div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-md">
								<Rocket className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
								Security Projects
							</h2>
						</div>
						<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
							Secure, production-ready systems with automated security controls, threat detection, and defense-in-depth architectures
						</p>
					</div>
					<Link
						href="/projects"
						className="hidden lg:flex items-center gap-2 px-5 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 group shadow-md hover:shadow-lg"
					>
						View all
						<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</Link>
				</div>
			</motion.div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{featuredProjects.map((project: any, idx: number) => (
					<ProjectCard key={project._id || idx} project={project} index={idx} />
				))}
			</div>

			{/* Mobile CTA */}
			<div className="lg:hidden mt-8">
				<Link
					href="/projects"
					className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 border-t-2 border-slate-200 dark:border-slate-800 pt-6 transition-colors"
				>
					View All Projects
					<ArrowRight className="h-5 w-5" />
				</Link>
			</div>
		</section>
	)
})

const ProjectCard = memo(function ProjectCard({ project, index }: { project: any; index: number }) {
	if (!project.link) return null

	const gradients = useMemo(
		() => [
			"from-blue-400 to-sky-500", // Light Blue vibrant
			"from-yellow-400 via-amber-500 to-yellow-600", // Yellow, Gold, Mustard vibrant
			"from-orange-500 via-red-500 to-orange-600", // Orange, Red, Gold vibrant
			"from-sky-400 to-blue-500", // Light Blue vibrant
			"from-yellow-500 to-amber-600", // Yellow to Gold
			"from-orange-500 to-red-500" // Orange to Red
		],
		[]
	)

	const gradient = gradients[index % gradients.length]
	const bgGradients = useMemo(
		() => [
			"from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
			"from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
			"from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
			"from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20",
			"from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
			"from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
		],
		[]
	)
	const bgGradient = bgGradients[index % bgGradients.length]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.05, duration: 0.5 }}
			whileHover={{ y: -6, scale: 1.02 }}
			className="group relative"
		>
			<Link
				href={project.link}
				target="_blank"
				rel="noopener noreferrer"
				className="block relative h-full overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg hover:shadow-xl hover:shadow-colored transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-600 glass"
			>
					<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
				
				<div className="relative space-y-4">
						<div className="flex items-start justify-between">
							<motion.div
								className={`p-3 rounded-lg bg-gradient-to-br ${gradient} shadow-md`}
								whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
								transition={{ duration: 0.5 }}
							>
								<Github className="h-5 w-5 text-white" />
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 0 }}
								whileHover={{ opacity: 1, scale: 1.1 }}
								transition={{ duration: 0.2 }}
							>
								<ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
							</motion.div>
						</div>
					
					<div className="space-y-3">
						<h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
							{project.title}
						</h3>
						
						{project.description && (
							<p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
								{project.description}
							</p>
						)}

						{project.keywords && project.keywords.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-2">
								{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
									<Badge
										key={kIdx}
										variant="secondary"
										className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0 px-3 py-1"
									>
										{keyword}
									</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	)
}, (prevProps, nextProps) => {
	// Custom comparison for memoization
	return (
		prevProps.project._id === nextProps.project._id &&
		prevProps.index === nextProps.index
	)
})
