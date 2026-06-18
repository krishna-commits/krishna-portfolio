'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
	children: ReactNode
}

/**
 * Lightweight enter animation only.
 * Do not use AnimatePresence / exit animations on layout {children} —
 * that unmounts Next.js App Router slots and throws parallelRouterKey errors.
 */
export function PageTransition({ children }: PageTransitionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
			className="w-full"
		>
			{children}
		</motion.div>
	)
}

interface SharedElementProps {
	children: ReactNode
	className?: string
}

export function SharedElement({ children, className }: SharedElementProps) {
	return (
		<motion.div
			layoutId="shared-element"
			className={className}
			transition={{
				type: 'spring',
				stiffness: 300,
				damping: 30,
			}}
		>
			{children}
		</motion.div>
	)
}
