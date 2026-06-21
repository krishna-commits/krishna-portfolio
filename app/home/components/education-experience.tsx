'use client'

import { motion } from "framer-motion"
import { siteConfig } from "config/site"
import { GraduationCap, Briefcase, TrendingUp, ArrowRight, Heart, BookOpen, Calendar, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "app/theme/lib/utils"
import { PAGE_CARD, PAGE_ICON_CHIP } from "lib/page-layout"
import { Badge } from "app/theme/components/ui/badge"
import useSWR from 'swr'
import { homepageFetcher, homepageSwrOptions } from 'lib/hooks/use-homepage-api'
import { mergeHomepageList } from 'lib/homepage-list-fallback'

function AvailableUponRequestLink({ className }: { className?: string }) {
	return (
		<Link href="/contact#send-a-message" className={cn('group/link block', className)}>
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50 sm:p-6"
			>
				<p className="text-xs sm:text-sm font-medium text-muted-foreground transition-colors group-hover/link:text-amber-700 dark:group-hover/link:text-amber-400 flex items-center justify-center gap-2">
					<span>Available upon request</span>
					<ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
				</p>
			</motion.div>
		</Link>
	)
}

function formatWorkUrl(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	} catch {
		return url
	}
}

export function EducationExperience() {
	const { data: educationData } = useSWR('/api/homepage/education', homepageFetcher, homepageSwrOptions)
	const education = mergeHomepageList(educationData?.education, siteConfig.education || [])
	
	const { data: workData } = useSWR('/api/homepage/work', homepageFetcher, homepageSwrOptions)
	const workExperience = mergeHomepageList(workData?.workExperience, siteConfig.work_experience || [])
	
	const { data: volunteeringData } = useSWR('/api/homepage/volunteering', homepageFetcher, homepageSwrOptions)
	const volunteering = mergeHomepageList(volunteeringData?.volunteering, siteConfig.volunteering || [])

	return (
		<section className="relative w-full" aria-label="Education and experience">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-5 sm:mb-6"
			>
				<div className="mb-3 inline-flex items-center gap-2 sm:mb-4 sm:gap-3">
					<span className={PAGE_ICON_CHIP}>
						<TrendingUp className="h-4 w-4" aria-hidden />
					</span>
					<h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
						Background
					</h2>
				</div>
				<p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
					Education and work experience
				</p>
			</motion.div>

			{/* Three Column Layout */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
				<EducationCard education={education} />
				<WorkExperienceCard workExperience={workExperience} />
				<VolunteeringCard volunteering={volunteering} />
			</div>
		</section>
	)
}

function EducationCard({ education }: { education: any[] }) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
	
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.1, duration: 0.5 }}
			className="group"
		>
			<div className={cn(PAGE_CARD, "relative h-full p-4 transition-shadow hover:shadow-md sm:p-5 md:p-6")}>
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<span className="inline-flex rounded-lg border border-border bg-muted p-2 sm:p-2.5">
							<GraduationCap className="h-3 w-3 text-foreground sm:h-4 sm:w-4" aria-hidden />
						</span>
						<h3 className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
							Education
						</h3>
					</div>
					{education && education.length > 0 ? (
						<div className="space-y-3 sm:space-y-4">
							{education.map((item: any, index: number) => {
								const isExpanded = expandedIndex === index
								return (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
										className="rounded-lg border border-border bg-muted/40 transition-colors hover:border-amber-500/20 hover:bg-amber-500/5 overflow-hidden"
									>
										<div className="p-3 sm:p-4">
											<div className="space-y-2">
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0 space-y-1">
														<p className="text-xs sm:text-sm font-bold text-foreground leading-tight">
															{item.course}
														</p>
														<p className="text-xs text-muted-foreground">
															{item.organization}
														</p>
														<p className="text-xs text-muted-foreground flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{item.time}
														</p>
													</div>
												</div>
												
												{item.thesis && (
													<div className="pt-2 border-t border-slate-200 dark:border-slate-700">
														<p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
															Thesis:
														</p>
														<p className="text-xs text-muted-foreground leading-relaxed">
															{item.thesis}
														</p>
													</div>
												)}
												
												{item.modules && item.modules.length > 0 && (
													<div className="pt-2">
														<button
															onClick={() => setExpandedIndex(isExpanded ? null : index)}
															className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
														>
															<BookOpen className="h-3 w-3" />
															<span>Modules ({item.modules.length})</span>
															{isExpanded ? (
																<ArrowRight className="h-3 w-3 rotate-90 transition-transform" />
															) : (
																<ArrowRight className="h-3 w-3 -rotate-90 transition-transform" />
															)}
														</button>
														{isExpanded && (
															<motion.div
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: "auto" }}
																exit={{ opacity: 0, height: 0 }}
																transition={{ duration: 0.3 }}
																className="mt-2 space-y-1.5"
															>
																{item.modules.map((module: string, modIdx: number) => (
																	<div
																		key={modIdx}
																		className="text-xs text-muted-foreground pl-4 flex items-start gap-2"
																	>
																		<span className="text-slate-400 dark:text-slate-500 mt-1">•</span>
																		<span>{module}</span>
																	</div>
																))}
															</motion.div>
														)}
													</div>
												)}
											</div>
										</div>
									</motion.div>
								)
							})}
						</div>
					) : (
						<Link
							href="/contact#send-a-message"
							className="group/link block"
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50"
							>
								<p className="text-xs sm:text-sm font-medium text-muted-foreground transition-colors group-hover/link:text-amber-700 dark:group-hover/link:text-amber-400 flex items-center justify-center gap-2">
									<span>Available upon request</span>
									<ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
								</p>
							</motion.div>
						</Link>
					)}
				</div>
			</div>
		</motion.div>
	)
}

function WorkExperienceCard({ workExperience }: { workExperience: any[] }) {
	const showPublicList = siteConfig.work_experience_public_list === true
	const hasEntries = workExperience.length > 0

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.15, duration: 0.5 }}
			className="group"
		>
			<div className={cn(PAGE_CARD, "relative h-full p-4 transition-shadow hover:shadow-md sm:p-5 md:p-6")}>
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<span className="inline-flex rounded-lg border border-border bg-muted p-2 sm:p-2.5">
							<Briefcase className="h-3 w-3 text-foreground sm:h-4 sm:w-4" aria-hidden />
						</span>
						<h3 className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
							Work Experience
						</h3>
					</div>
					{showPublicList && hasEntries ? (
						<div className="space-y-3 sm:space-y-4">
							{workExperience.map((item: any, index: number) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="p-3 sm:p-4 rounded-lg border border-border bg-muted/40 hover:border-amber-500/20 hover:bg-amber-500/5 transition-colors"
								>
									{item.imageUrl && (
										<Image
											src={item.imageUrl}
											width={40}
											height={40}
											alt={item.organization}
											className="rounded-lg object-cover flex-shrink-0 mb-2"
										/>
									)}
									<div className="flex-1 min-w-0 space-y-1.5">
										<p className="text-xs sm:text-sm font-bold text-foreground leading-tight">
											{item.organization}
										</p>
										<p className="text-xs text-muted-foreground">{item.role}</p>
										<p className="text-xs text-muted-foreground flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											{item.time}
										</p>
										{item.url && (
											<Link
												href={item.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block truncate"
											>
												{formatWorkUrl(item.url)}
											</Link>
										)}
									</div>
								</motion.div>
							))}
							<AvailableUponRequestLink className="pt-1" />
						</div>
					) : (
						<AvailableUponRequestLink />
					)}
				</div>
			</div>
		</motion.div>
	)
}

function VolunteeringCard({ volunteering }: { volunteering: any[] }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.2, duration: 0.5 }}
			className="group"
		>
			<div className={cn(PAGE_CARD, "relative h-full p-4 transition-shadow hover:shadow-md sm:p-5 md:p-6")}>
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<span className="inline-flex rounded-lg border border-border bg-muted p-2 sm:p-2.5">
							<Heart className="h-3 w-3 text-foreground sm:h-4 sm:w-4" aria-hidden />
						</span>
						<h3 className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
							Volunteering
						</h3>
					</div>
					{volunteering && volunteering.length > 0 ? (
						<div className="space-y-3 sm:space-y-4">
							{volunteering.map((item: any, index: number) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="p-3 sm:p-4 rounded-lg border border-border bg-muted/40 hover:border-amber-500/20 hover:bg-amber-500/5 transition-colors"
								>
									<div className="space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0 space-y-1">
												<p className="text-xs sm:text-sm font-bold text-foreground leading-tight">
													{item.organization}
												</p>
												<p className="text-xs text-muted-foreground">
													{item.role}
												</p>
												<p className="text-xs text-muted-foreground flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{item.time}
												</p>
												{item.duration && (
													<p className="text-xs text-muted-foreground">
														{item.duration}
													</p>
												)}
											</div>
										</div>
										{item.type && (
											<Badge 
												variant="secondary" 
												className="text-xs font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
											>
												{item.type}
											</Badge>
										)}
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<Link
							href="/contact#send-a-message"
							className="group/link block"
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50"
							>
								<p className="text-xs sm:text-sm font-medium text-muted-foreground group-hover/link:text-amber-700 dark:group-hover/link:text-amber-400 transition-colors flex items-center justify-center gap-2">
									<span>Available upon request</span>
									<ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
								</p>
							</motion.div>
						</Link>
					)}
				</div>
			</div>
		</motion.div>
	)
}
