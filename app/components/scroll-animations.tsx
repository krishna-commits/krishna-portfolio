'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

interface ScrollAnimationProps {
	children: ReactNode
	className?: string
	delay?: number
	duration?: number
	variant?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate'
}

export function ScrollAnimation({
	children,
	className,
	delay = 0,
	duration = 0.5,
	variant = 'fade'
}: ScrollAnimationProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })

	const variants = {
		fade: {
			initial: { opacity: 0 },
			animate: { opacity: 1 }
		},
		'slide-up': {
			initial: { opacity: 0, y: 50 },
			animate: { opacity: 1, y: 0 }
		},
		'slide-down': {
			initial: { opacity: 0, y: -50 },
			animate: { opacity: 1, y: 0 }
		},
		'slide-left': {
			initial: { opacity: 0, x: 50 },
			animate: { opacity: 1, x: 0 }
		},
		'slide-right': {
			initial: { opacity: 0, x: -50 },
			animate: { opacity: 1, x: 0 }
		},
		scale: {
			initial: { opacity: 0, scale: 0.9 },
			animate: { opacity: 1, scale: 1 }
		},
		rotate: {
			initial: { opacity: 0, rotate: -10 },
			animate: { opacity: 1, rotate: 0 }
		}
	}

	const selectedVariant = variants[variant]

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={selectedVariant.initial}
			animate={isInView ? selectedVariant.animate : selectedVariant.initial}
			transition={{
				duration,
				delay,
				ease: [0.25, 0.1, 0.25, 1]
			}}
		>
			{children}
		</motion.div>
	)
}

interface StaggerContainerProps {
	children: ReactNode
	className?: string
	staggerDelay?: number
}

export function StaggerContainer({
	children,
	className,
	staggerDelay = 0.1
}: StaggerContainerProps) {
	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: '-50px' }}
			transition={{ staggerChildren: staggerDelay }}
		>
			{children}
		</motion.div>
	)
}

interface StaggerItemProps {
	children: ReactNode
	className?: string
	variant?: 'fade' | 'slide-up' | 'scale'
}

export function StaggerItem({
	children,
	className,
	variant = 'fade'
}: StaggerItemProps) {
	const itemVariants = {
		hidden: {
			opacity: 0,
			y: variant === 'slide-up' ? 20 : 0,
			scale: variant === 'scale' ? 0.9 : 1
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1
		}
	}

	return (
		<motion.div
			className={className}
			variants={itemVariants}
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
		>
			{children}
		</motion.div>
	)
}

interface ParallaxSectionProps {
	children: ReactNode
	className?: string
	speed?: number
}

export function ParallaxSection({
	children,
	className,
	speed = 0.5
}: ParallaxSectionProps) {
	const ref = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start']
	})

	const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

	return (
		<motion.div
			ref={ref}
			className={className}
			style={{ y, opacity }}
		>
			{children}
		</motion.div>
	)
}

interface CounterProps {
	value: number
	duration?: number
	className?: string
	prefix?: string
	suffix?: string
	decimals?: number
}

export function AnimatedCounter({
	value,
	duration = 2,
	className,
	prefix = '',
	suffix = '',
	decimals = 0
}: CounterProps) {
	const [displayValue, setDisplayValue] = useState(0)
	const ref = useRef<HTMLSpanElement>(null)
	const isInView = useInView(ref, { once: true })

	useEffect(() => {
		if (!isInView) return

		let startTime: number | null = null
		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime
			const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
			
			const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
			const easedProgress = easeOutCubic(progress)
			
			setDisplayValue(value * easedProgress)

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				setDisplayValue(value)
			}
		}

		requestAnimationFrame(animate)
	}, [value, duration, isInView])

	return (
		<span ref={ref} className={className}>
			{prefix}
			{displayValue.toFixed(decimals).toLocaleString()}
			{suffix}
		</span>
	)
}

