'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
	children: ReactNode
}

const pageVariants = {
	initial: {
		opacity: 0,
		y: 20,
		scale: 0.98
	},
	animate: {
		opacity: 1,
		y: 0,
		scale: 1
	},
	exit: {
		opacity: 0,
		y: -20,
		scale: 0.98
	}
}

const pageTransition = {
	type: 'tween',
	ease: [0.25, 0.1, 0.25, 1],
	duration: 0.4
}

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname()

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={pathname}
				initial="initial"
				animate="animate"
				exit="exit"
				variants={pageVariants}
				transition={pageTransition}
				className="w-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
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
				damping: 30
			}}
		>
			{children}
		</motion.div>
	)
}

