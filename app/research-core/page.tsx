'use client'

import ResearchCoreCard from "./components/researchcore-card"
import { ResearchCoreStartHere } from "./components/start-here-card"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import {
	PAGE_H1,
	PAGE_ICON_CHIP,
	PAGE_LEAD,
	PAGE_SHELL_WIDE,
} from "lib/page-layout"
import { useResearchCoreConfig } from "lib/hooks/use-research-core-config"

export default function ResearchCorePage() {
	const { config } = useResearchCoreConfig()

	return (
		<div className="min-h-screen bg-background">
			<div className={PAGE_SHELL_WIDE}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-10 space-y-4"
				>
					<div className="flex flex-wrap items-center gap-3">
						<span className={PAGE_ICON_CHIP}>
							<BookOpen className="h-5 w-5" aria-hidden />
						</span>
						<h1 className={PAGE_H1}>{config.pageTitle}</h1>
					</div>
					<p className={PAGE_LEAD}>{config.pageLead}</p>
				</motion.div>
				<ResearchCoreStartHere />
				<ResearchCoreCard />
			</div>
		</div>
	)
}
