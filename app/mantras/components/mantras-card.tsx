'use client'

import { cn } from "app/theme/lib/utils";
import { allMantras } from "contentlayer/generated";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";
import { PAGE_CARD } from "lib/page-layout";

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
						className={cn(
							PAGE_CARD,
							"overflow-hidden transition-all duration-300 hover:shadow-md",
						)}
					>
						<div className="border-b border-border p-4 sm:p-5">
							<Link href={`${parent.url}`} className="group">
								<div className="mb-2 flex items-start gap-2">
									<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
										<Sparkles className="h-3.5 w-3.5" aria-hidden />
									</span>
									<h2 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg md:text-xl">
										{parent.title}
									</h2>
								</div>
							</Link>
							<p className="ml-10 text-xs leading-relaxed tracking-tight text-muted-foreground sm:text-sm">
								{parent.description}
							</p>
						</div>

						<div className="space-y-3 p-4 sm:p-5">
							{sortedMantras.map((child, cIndex) => (
								child.parent === parent.title && child.grand_parent == null && (
									<motion.div
										key={`${pIndex}-${cIndex}`}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: (pIndex * 0.1) + (cIndex * 0.05) }}
										className="overflow-hidden rounded-xl border border-border bg-muted/30 transition-shadow hover:shadow-sm"
									>
										<div className="p-3 sm:p-4">
											<div className="mb-2 flex items-center justify-between gap-3">
												<Link
													href={child.url}
													className="text-sm font-semibold text-foreground transition-colors hover:text-primary hover:underline sm:text-base"
												>
													{child.title}
												</Link>
												<span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
													Section
												</span>
											</div>
											<p className="mb-3 text-xs leading-relaxed text-muted-foreground">{child.description}</p>

											<div className="space-y-2 border-t border-border pt-3">
												{sortedMantras.map((grand, gIndex) => (
													grand.parent === child.title && grand.grand_parent === parent.title && (
														<motion.div
															key={`${pIndex}-${cIndex}-${gIndex}`}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ duration: 0.3, delay: (pIndex * 0.1) + (cIndex * 0.05) + (gIndex * 0.03) }}
															className="flex items-start gap-2.5"
														>
															<div className="mt-0.5 shrink-0">
																{grand.completed ? (
																	<motion.div
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		transition={{ type: "spring", stiffness: 500, damping: 30 }}
																	>
																		<CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden />
																	</motion.div>
																) : (
																	<Circle className="h-3 w-3 text-muted-foreground" aria-hidden />
																)}
															</div>
															<div className="min-w-0 flex-1">
																<Link
																	href={grand.url}
																	className="block text-xs font-medium text-foreground transition-colors hover:text-primary hover:underline sm:text-sm"
																>
																	{grand.title}
																</Link>
																<p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{grand.description}</p>
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
