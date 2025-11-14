'use client'

import ResearchCoreCard from "./components/researchcore-card"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function ResearchCorePage() {
	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-4 mb-8 sm:mb-10"
			>
				<div className="inline-flex items-center gap-1.5 mb-2">
					<div className="p-1.5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
						<BookOpen className="h-3 w-3 text-white" />
					</div>
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
						Research Core
					</h1>
				</div>
				<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light max-w-3xl leading-relaxed">
					Academic findings, conference highlights, coding practices, and theoretical summaries in a structured, research-focused format for continuous learning and exploration.
				</p>
			</motion.div>
			<ResearchCoreCard />
		</div>
	)
}
