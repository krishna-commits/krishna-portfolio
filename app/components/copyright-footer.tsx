'use client'

import { motion } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

interface CopyrightFooterProps {
	className?: string
}

export function CopyrightFooter({ className }: CopyrightFooterProps) {
	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className={cn(
				"relative w-full py-6 sm:py-8 border-t border-slate-200 dark:border-slate-800",
				"bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/30",
				className
			)}
		>
			<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
				<div className="flex items-center justify-center">
					<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center font-medium">
						© Krishna Neupane Since @ 1995. All rights reserved.
					</p>
				</div>
			</div>
		</motion.footer>
	)
}

