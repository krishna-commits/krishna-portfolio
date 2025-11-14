'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from 'app/theme/lib/utils'

interface TypewriterTextProps {
	text: string
	className?: string
	speed?: number
	delay?: number
	onComplete?: () => void
}

export function TypewriterText({
	text,
	className,
	speed = 50,
	delay = 0,
	onComplete
}: TypewriterTextProps) {
	const [displayedText, setDisplayedText] = useState('')
	const [isComplete, setIsComplete] = useState(false)
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-50px' })

	useEffect(() => {
		if (!isInView) return

		let timeout: NodeJS.Timeout
		let currentIndex = 0

		const typeNextChar = () => {
			if (currentIndex < text.length) {
				setDisplayedText(text.slice(0, currentIndex + 1))
				currentIndex++
				timeout = setTimeout(typeNextChar, speed)
			} else {
				setIsComplete(true)
				onComplete?.()
			}
		}

		const startTimeout = setTimeout(() => {
			typeNextChar()
		}, delay)

		return () => {
			clearTimeout(startTimeout)
			clearTimeout(timeout)
		}
	}, [text, speed, delay, isInView, onComplete])

	return (
		<span ref={ref} className={className}>
			{displayedText}
			{!isComplete && (
				<motion.span
					animate={{ opacity: [1, 0] }}
					transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
					className="inline-block w-0.5 h-5 bg-current ml-1"
				/>
			)}
		</span>
	)
}

interface GradientTextProps {
	children: ReactNode
	className?: string
	gradient?: string
	animate?: boolean
}

export function GradientText({
	children,
	className,
	gradient = "from-yellow-400 via-amber-500 to-orange-500",
	animate = true
}: GradientTextProps) {
	return (
		<span
			className={cn(
				"bg-gradient-to-r bg-clip-text text-transparent",
				gradient,
				animate && "bg-[length:200%_100%] animate-gradient",
				className
			)}
		>
			{children}
		</span>
	)
}

interface Text3DEffectProps {
	children: ReactNode
	className?: string
	intensity?: number
}

export function Text3DEffect({
	children,
	className,
	intensity = 5
}: Text3DEffectProps) {
	return (
		<span
			className={cn(
				"inline-block relative",
				className
			)}
			style={{
				textShadow: `
					0 ${intensity}px 0 rgba(0, 0, 0, 0.1),
					0 ${intensity * 2}px 0 rgba(0, 0, 0, 0.05),
					0 ${intensity * 3}px ${intensity * 2}px rgba(0, 0, 0, 0.1)
				`
			}}
		>
			{children}
		</span>
	)
}

interface RevealTextProps {
	children: ReactNode
	className?: string
	variant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'blur'
	delay?: number
}

export function RevealText({
	children,
	className,
	variant = 'fade',
	delay = 0
}: RevealTextProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })

	const variants = {
		fade: {
			initial: { opacity: 0 },
			animate: { opacity: 1 }
		},
		'slide-up': {
			initial: { opacity: 0, y: 20 },
			animate: { opacity: 1, y: 0 }
		},
		'slide-down': {
			initial: { opacity: 0, y: -20 },
			animate: { opacity: 1, y: 0 }
		},
		scale: {
			initial: { opacity: 0, scale: 0.9 },
			animate: { opacity: 1, scale: 1 }
		},
		blur: {
			initial: { opacity: 0, filter: 'blur(10px)' },
			animate: { opacity: 1, filter: 'blur(0px)' }
		}
	}

	const selectedVariant = variants[variant]

	return (
		<motion.span
			ref={ref}
			className={className}
			initial={selectedVariant.initial}
			animate={isInView ? selectedVariant.animate : selectedVariant.initial}
			transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
		>
			{children}
		</motion.span>
	)
}

interface InteractiveTextProps {
	children: ReactNode
	className?: string
}

export function InteractiveText({ children, className }: InteractiveTextProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isHovered, setIsHovered] = useState(false)
	const textRef = useRef<HTMLSpanElement>(null)

	const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
		if (!textRef.current) return
		const rect = textRef.current.getBoundingClientRect()
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		})
	}

	return (
		<motion.span
			ref={textRef}
			className={cn("inline-block relative cursor-pointer", className)}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.05 }}
		>
			{children}
			{isHovered && (
				<motion.span
					className="absolute inset-0 blur-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-50 -z-10"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ 
						opacity: 0.5,
						scale: 1.2,
						x: mousePosition.x - 50,
						y: mousePosition.y - 50
					}}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				/>
			)}
		</motion.span>
	)
}

