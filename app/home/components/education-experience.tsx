'use client'

import { motion } from "framer-motion"
import { siteConfig } from "config/site"
import { GraduationCap, Briefcase, TrendingUp, ArrowRight, Heart, BookOpen, Calendar, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "app/theme/lib/utils"
import { Badge } from "app/theme/components/ui/badge"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function EducationExperience() {
	const { data: educationData } = useSWR('/api/homepage/education', fetcher)
	const education = educationData?.education || siteConfig.education || []
	
	const { data: workData } = useSWR('/api/homepage/work', fetcher)
	const workExperience = workData?.workExperience || siteConfig.work_experience || []
	
	const { data: volunteeringData } = useSWR('/api/homepage/volunteering', fetcher)
	const volunteering = volunteeringData?.volunteering || siteConfig.volunteering || []

	return (
		<section className="relative w-full" aria-label="Education and experience">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-6 sm:mb-8"
			>
				<div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
					<motion.div
						animate={{ rotate: [0, 360] }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg"
					>
						<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
					</motion.div>
					<h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						Background
					</h2>
				</div>
				<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
					Education and work experience
				</p>
			</motion.div>

			{/* Three Column Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
			<div className="relative h-full p-4 sm:p-5 md:p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-400 to-sky-500 shadow-md">
							<GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
						</div>
						<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-50">
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
										className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors overflow-hidden"
									>
										<div className="p-3 sm:p-4">
											<div className="space-y-2">
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0 space-y-1">
														<p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">
															{item.course}
														</p>
														<p className="text-xs text-slate-600 dark:text-slate-400">
															{item.organization}
														</p>
														<p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
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
														<p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
															{item.thesis}
														</p>
													</div>
												)}
												
												{item.modules && item.modules.length > 0 && (
													<div className="pt-2">
														<button
															onClick={() => setExpandedIndex(isExpanded ? null : index)}
															className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
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
																		className="text-xs text-slate-600 dark:text-slate-400 pl-4 flex items-start gap-2"
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
								className="p-6 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50/50 to-sky-50/50 dark:from-blue-950/30 dark:to-sky-950/30 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 text-center transition-all duration-300 cursor-pointer"
							>
								<p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors flex items-center justify-center gap-2">
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
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.15, duration: 0.5 }}
			className="group"
		>
			<div className="relative h-full p-4 sm:p-5 md:p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-md">
							<Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
						</div>
						<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-50">
							Work Experience
						</h3>
					</div>
					{workExperience && workExperience.length > 0 ? (
						<div className="space-y-3 sm:space-y-4">
							{workExperience.map((item: any, index: number) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
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
										<p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">
											{item.organization}
										</p>
										<p className="text-xs text-slate-600 dark:text-slate-400">{item.role}</p>
										<p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
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
												{item.url}
											</Link>
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
								className="p-6 rounded-lg border-2 border-dashed border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/30 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50/70 dark:hover:bg-yellow-950/40 text-center transition-all duration-300 cursor-pointer"
							>
								<p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover/link:text-yellow-600 dark:group-hover/link:text-yellow-400 transition-colors flex items-center justify-center gap-2">
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

function VolunteeringCard({ volunteering }: { volunteering: any[] }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.2, duration: 0.5 }}
			className="group"
		>
			<div className="relative h-full p-4 sm:p-5 md:p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
				<div className="space-y-4 sm:space-y-5">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
							<Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
						</div>
						<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-50">
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
									className="p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
								>
									<div className="space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0 space-y-1">
												<p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">
													{item.organization}
												</p>
												<p className="text-xs text-slate-600 dark:text-slate-400">
													{item.role}
												</p>
												<p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{item.time}
												</p>
												{item.duration && (
													<p className="text-xs text-slate-500 dark:text-slate-500">
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
								className="p-6 rounded-lg border-2 border-dashed border-rose-300 dark:border-rose-700 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/30 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 text-center transition-all duration-300 cursor-pointer"
							>
								<p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover/link:text-rose-600 dark:group-hover/link:text-rose-400 transition-colors flex items-center justify-center gap-2">
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
