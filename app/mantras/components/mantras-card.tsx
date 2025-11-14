'use client'

import { cn } from "app/theme/lib/utils";
import { allMantras } from "contentlayer/generated";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";

export default function MantrasCard() {
    const sortedMantras = allMantras.sort(function (a: any, b: any) { return a.order - b.order });

  return (
		<div className="grid grid-cols-1 gap-3 sm:gap-4">
			{sortedMantras.map((parent, pIndex) => (
				parent.parent == null && parent.grand_parent == null && (
					<motion.div
						key={pIndex}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: pIndex * 0.1 }}
						className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 hover:shadow-md transition-all duration-300"
					>
						<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] opacity-10" />
						
						<div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
							<Link href={`${parent.url}`} className="group">
								<div className="flex items-start gap-2 mb-2">
									<div className="p-1.5 rounded-md bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white shadow-sm flex-shrink-0 mt-0.5">
										<Sparkles className="h-3 w-3" />
									</div>
									<h2 className={cn("text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors")}>
										{parent.title}
									</h2>
								</div>
							</Link>
							<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 tracking-tight leading-relaxed ml-8">
								{parent.description}
							</p>
						</div>

						<div className="p-4 sm:p-5 space-y-3">
							{sortedMantras.map((child, cIndex) => (
								child.parent === parent.title && child.grand_parent == null && (
									<motion.div
										key={`${pIndex}-${cIndex}`}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: (pIndex * 0.1) + (cIndex * 0.05) }}
										className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:shadow-sm transition-all duration-300"
									>
										<div className="p-3 sm:p-4">
											<div className="flex items-center justify-between gap-3 mb-2">
												<Link href={child.url} className="hover:underline text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
													{child.title}
												</Link>
												<span className="text-[10px] rounded-full px-2 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800">
													Section
												</span>
											</div>
											<p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{child.description}</p>

											<div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
												{sortedMantras.map((grand, gIndex) => (
													grand.parent === child.title && grand.grand_parent === parent.title && (
														<motion.div
															key={`${pIndex}-${cIndex}-${gIndex}`}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ duration: 0.3, delay: (pIndex * 0.1) + (cIndex * 0.05) + (gIndex * 0.03) }}
															className="flex items-start gap-2.5 group/item"
														>
															<div className="mt-0.5 flex-shrink-0">
																{grand.completed ? (
																	<motion.div
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		transition={{ type: "spring", stiffness: 500, damping: 30 }}
																	>
																		<CheckCircle2 className="h-3 w-3 text-emerald-500" />
																	</motion.div>
																) : (
																	<Circle className="h-3 w-3 text-amber-500" />
																)}
															</div>
															<div className="flex-1 min-w-0">
																<Link href={grand.url} className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 hover:underline hover:text-amber-600 dark:hover:text-amber-400 transition-colors block">
																	{grand.title}
																</Link>
																<p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{grand.description}</p>
															</div>
														</motion.div>
													)
												))}
											</div>
										</div>
									</motion.div>
								)
							))}
						</div>
					</motion.div>
				)
			))}
      </div>
  )
}
