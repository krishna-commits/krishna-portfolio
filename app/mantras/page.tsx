'use client'

import MantrasCard from "./components/mantras-card"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import {
	PAGE_H1,
	PAGE_ICON_CHIP,
	PAGE_LEAD,
	PAGE_SHELL_WIDE,
} from "lib/page-layout"

export default function MantrasPage() {
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
							<Sparkles className="h-5 w-5" aria-hidden />
						</span>
						<h1 className={PAGE_H1}>Mantras</h1>
					</div>
					<p className={PAGE_LEAD}>
						Personal principles, insights, and guiding philosophies that shape my approach to research, engineering, and continuous learning.
					</p>
				</motion.div>
				<MantrasCard />
			</div>
		</div>
	)
}
