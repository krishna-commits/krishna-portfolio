'use client'

import { useState, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

interface RippleButtonProps {
	children: ReactNode
	onClick?: () => void
	className?: string
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
}

export function RippleButton({
	children,
	onClick,
	className,
	disabled = false,
	type = 'button'
}: RippleButtonProps) {
	const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return

		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		const newRipple = {
			id: Date.now(),
			x,
			y
		}

		setRipples([...ripples, newRipple])

		setTimeout(() => {
			setRipples(prev => prev.filter(r => r.id !== newRipple.id))
		}, 600)

		onClick?.()
	}

	return (
		<motion.button
			type={type}
			onClick={handleClick}
			disabled={disabled}
			className={cn(
				"relative overflow-hidden rounded-lg px-6 py-3 font-semibold text-white",
				"bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500",
				"hover:shadow-lg active:scale-[0.98] transition-all duration-200",
				disabled && "opacity-50 cursor-not-allowed",
				className
			)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			{children}
			{ripples.map(ripple => (
				<motion.span
					key={ripple.id}
					className="absolute rounded-full bg-white/30 pointer-events-none"
					style={{
						left: ripple.x,
						top: ripple.y,
					}}
					initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
					animate={{ width: 200, height: 200, opacity: 0 }}
					transition={{ duration: 0.6 }}
				/>
			))}
		</motion.button>
	)
}

interface AnimatedLinkProps {
	children: ReactNode
	href: string
	className?: string
}

export function AnimatedLink({ children, href, className }: AnimatedLinkProps) {
	return (
		<motion.a
			href={href}
			className={cn(
				"relative inline-block text-blue-600 dark:text-blue-400 font-medium",
				className
			)}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			<span className="relative">
				{children}
				<motion.span
					className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"
					initial={{ scaleX: 0, originX: 0 }}
					whileHover={{ scaleX: 1 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
				/>
			</span>
		</motion.a>
	)
}

interface HoverCardProps {
	children: ReactNode
	className?: string
	hoverScale?: number
}

export function HoverCard({ children, className, hoverScale = 1.02 }: HoverCardProps) {
	return (
		<motion.div
			className={cn(
				"rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
				"shadow-sm transition-shadow duration-300",
				className
			)}
			whileHover={{ 
				scale: hoverScale,
				boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
			}}
			transition={{ duration: 0.2 }}
		>
			{children}
		</motion.div>
	)
}

