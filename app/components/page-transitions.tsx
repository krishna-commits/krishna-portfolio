'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
	children: ReactNode
}

/**
 * Lightweight enter animation only.
 * Skipped on homepage — initial opacity:0 delays LCP.
 */
export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname()
	const prefersReducedMotion = useReducedMotion()
	const skipAnimation = pathname === '/' || prefersReducedMotion

	if (skipAnimation) {
		return <div className="w-full">{children}</div>
	}

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
