'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { allProjects } from "contentlayer/generated"
import { Badge } from "app/theme/components/ui/badge"
import { ArrowRight, ExternalLink, Github, Rocket } from "lucide-react"
import { memo, useMemo } from "react"
import { cn } from "app/theme/lib/utils"
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD } from "lib/page-layout"

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
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-10"
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-3">
						<div className="flex flex-wrap items-center gap-3">
							<span className={PAGE_ICON_CHIP}>
								<Rocket className="h-5 w-5" aria-hidden />
							</span>
							<h2 className={PAGE_H1}>Security Projects</h2>
						</div>
						<p className={cn(PAGE_LEAD, "text-base sm:text-lg")}>
							Production-ready systems with automated security controls, threat detection, and defense-in-depth architectures
						</p>
					</div>
					<Link
						href="/projects"
						className="no-underline hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted lg:flex"
					>
						View all
						<ArrowRight className="h-4 w-4" aria-hidden />
					</Link>
				</div>
			</motion.div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
				{featuredProjects.map((project: any, idx: number) => (
					<ProjectCard key={project._id || idx} project={project} index={idx} />
				))}
			</div>

			<div className="mt-8 lg:hidden">
				<Link
					href="/projects"
					className="no-underline flex w-full items-center justify-center gap-2 border-t border-border pt-6 text-base font-semibold text-foreground"
				>
					View all projects
					<ArrowRight className="h-5 w-5" aria-hidden />
				</Link>
			</div>
		</section>
	)
})

const ProjectCard = memo(function ProjectCard({ project, index }: { project: any; index: number }) {
	if (!project.link) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.05, duration: 0.4 }}
			whileHover={{ y: -4 }}
			className="group"
		>
			<Link
				href={project.link}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					PAGE_CARD,
					"no-underline relative block h-full overflow-hidden p-6 transition-shadow hover:shadow-md",
				)}
				data-cursor="pointer"
			>
				<div className="space-y-4">
					<div className="flex items-start justify-between">
						<span className="inline-flex rounded-lg border border-border bg-muted p-2.5 text-foreground">
							<Github className="h-5 w-5" aria-hidden />
						</span>
						<ExternalLink className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
					</div>

					<div className="space-y-3">
						<h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
							{project.title}
						</h3>

						{project.description && (
							<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
								{project.description}
							</p>
						)}

						{project.keywords && project.keywords.length > 0 && (
							<div className="flex flex-wrap gap-2 border-t border-border pt-3">
								{project.keywords.slice(0, 3).map((keyword: string, kIdx: number) => (
									<Badge key={kIdx} variant="outline" className="bg-muted/50 text-xs font-normal">
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
}, (prevProps, nextProps) => prevProps.project._id === nextProps.project._id && prevProps.index === nextProps.index)
