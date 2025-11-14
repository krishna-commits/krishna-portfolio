'use client'

import { useState, useEffect, ReactNode, TouchEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

interface SwipeableProps {
	children: ReactNode
	onSwipeLeft?: () => void
	onSwipeRight?: () => void
	onSwipeUp?: () => void
	onSwipeDown?: () => void
	threshold?: number
	className?: string
	enabled?: boolean
}

export function Swipeable({
	children,
	onSwipeLeft,
	onSwipeRight,
	onSwipeUp,
	onSwipeDown,
	threshold = 50,
	className,
	enabled = true
}: SwipeableProps) {
	const [isMobile, setIsMobile] = useState(false)
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
	const ySpring = useSpring(y, { stiffness: 300, damping: 30 })
	const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3])

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		if (!enabled || !isMobile) {
			x.set(0)
			y.set(0)
			return
		}

		const { offset: { x: deltaX, y: deltaY }, velocity: { x: velX, y: velY } } = info
		
		// Check horizontal swipe
		if (Math.abs(deltaX) > Math.abs(deltaY) && (Math.abs(deltaX) > threshold || Math.abs(velX) > 500)) {
			if (deltaX > 0 && onSwipeRight) {
				onSwipeRight()
			} else if (deltaX < 0 && onSwipeLeft) {
				onSwipeLeft()
			}
		}
		
		// Check vertical swipe
		if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > threshold || Math.abs(velY) > 500)) {
			if (deltaY > 0 && onSwipeDown) {
				onSwipeDown()
			} else if (deltaY < 0 && onSwipeUp) {
				onSwipeUp()
			}
		}

		x.set(0)
		y.set(0)
	}

	if (!isMobile) {
		return <div className={className}>{children}</div>
	}

	return (
		<motion.div
			className={className}
			drag={enabled ? 'x' : false}
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.2}
			onDrag={(_, info) => {
				x.set(info.offset.x)
				y.set(info.offset.y)
			}}
			onDragEnd={handleDragEnd}
			style={{ x: xSpring, y: ySpring, opacity }}
			whileDrag={{ scale: 0.98 }}
		>
			{children}
		</motion.div>
	)
}

interface PullToRefreshProps {
	onRefresh: () => Promise<void>
	children: ReactNode
	className?: string
	enabled?: boolean
}

export function PullToRefresh({
	onRefresh,
	children,
	className,
	enabled = true
}: PullToRefreshProps) {
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [pullDistance, setPullDistance] = useState(0)
	const [startY, setStartY] = useState(0)
	const [isPulling, setIsPulling] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleTouchStart = (e: TouchEvent) => {
		if (!enabled || !isMobile || window.scrollY > 0) return
		setStartY(e.touches[0].clientY)
		setIsPulling(true)
	}

	const handleTouchMove = (e: TouchEvent) => {
		if (!enabled || !isMobile || !isPulling || window.scrollY > 0) return
		
		const currentY = e.touches[0].clientY
		const distance = Math.max(0, currentY - startY)
		
		if (distance > 0) {
			e.preventDefault()
			setPullDistance(Math.min(distance, 100))
		}
	}

	const handleTouchEnd = async () => {
		if (!enabled || !isMobile || !isPulling) return
		
		setIsPulling(false)
		
		if (pullDistance > 60) {
			setIsRefreshing(true)
			await onRefresh()
			setIsRefreshing(false)
		}
		
		setPullDistance(0)
		setStartY(0)
	}

	if (!isMobile) {
		return <div className={className}>{children}</div>
	}

	const rotation = (pullDistance / 100) * 360
	const opacity = Math.min(1, pullDistance / 60)

	return (
		<div
			className={cn("relative", className)}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{/* Pull to Refresh Indicator */}
			{isPulling && (
				<motion.div
					className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex items-center justify-center gap-2 z-50"
					style={{ y: -pullDistance }}
					initial={{ opacity: 0 }}
					animate={{ opacity }}
				>
					<motion.div
						animate={{ rotate: isRefreshing ? 360 : rotation }}
						transition={{ 
							rotate: isRefreshing 
								? { duration: 1, repeat: Infinity, ease: 'linear' }
								: { type: 'spring', stiffness: 300, damping: 30 }
						}}
						className={cn(
							"p-2 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg",
							pullDistance > 60 && "bg-emerald-500"
						)}
					>
						<RefreshCw className="h-5 w-5 text-white" />
					</motion.div>
					<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
						{pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
					</span>
				</motion.div>
			)}
			
			{/* Content */}
			<motion.div
				style={{ y: isPulling ? Math.min(pullDistance, 60) : 0 }}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			>
				{children}
			</motion.div>
		</div>
	)
}

interface HapticFeedbackProps {
	children: ReactNode
	intensity?: 'light' | 'medium' | 'heavy'
	className?: string
}

export function HapticFeedback({
	children,
	intensity = 'medium',
	className
}: HapticFeedbackProps) {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		
		const checkMobile = () => {
			setIsMobile(
				window.innerWidth < 768 || 
				'ontouchstart' in window ||
				(navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
			)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleInteraction = (e: React.TouchEvent | React.MouseEvent) => {
		if (!isMobile || typeof navigator === 'undefined' || !('vibrate' in navigator)) return
		
		const intensities = {
			light: 10,
			medium: 20,
			heavy: 30
		}
		
		try {
			(navigator as any).vibrate(intensities[intensity])
		} catch (error) {
			console.warn('Vibration not supported')
		}
	}

	return (
		<div
			className={className}
			onTouchStart={handleInteraction}
			onMouseDown={handleInteraction}
		>
			{children}
		</div>
	)
}

interface SwipeableCarouselProps {
	children: ReactNode[]
	className?: string
	autoPlay?: boolean
	autoPlayInterval?: number
}

export function SwipeableCarousel({
	children,
	className,
	autoPlay = false,
	autoPlayInterval = 5000
}: SwipeableCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	useEffect(() => {
		if (!autoPlay) return
		
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % children.length)
		}, autoPlayInterval)

		return () => clearInterval(interval)
	}, [autoPlay, autoPlayInterval, children.length])

	const handleSwipeLeft = () => {
		setCurrentIndex((prev) => (prev + 1) % children.length)
	}

	const handleSwipeRight = () => {
		setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
	}

	if (!isMobile) {
		return <div className={className}>{children}</div>
	}

	return (
		<div className={cn("relative overflow-hidden", className)}>
			<Swipeable
				onSwipeLeft={handleSwipeLeft}
				onSwipeRight={handleSwipeRight}
				className="w-full"
			>
				<div className="flex" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
					{children.map((child, idx) => (
						<div key={idx} className="w-full flex-shrink-0">
							{child}
						</div>
					))}
				</div>
			</Swipeable>

			{/* Indicators */}
			<div className="flex items-center justify-center gap-2 mt-4">
				{children.map((_, idx) => (
					<button
						key={idx}
						onClick={() => setCurrentIndex(idx)}
						className={cn(
							"w-2 h-2 rounded-full transition-all duration-300",
							currentIndex === idx
								? "bg-yellow-400 w-8"
								: "bg-slate-300 dark:bg-slate-700"
						)}
						aria-label={`Go to slide ${idx + 1}`}
					/>
				))}
			</div>

			{/* Navigation Buttons */}
			<button
				onClick={handleSwipeRight}
				className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
				aria-label="Previous slide"
			>
				<ChevronLeft className="h-5 w-5 text-slate-900 dark:text-slate-50" />
			</button>
			<button
				onClick={handleSwipeLeft}
				className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
				aria-label="Next slide"
			>
				<ChevronRight className="h-5 w-5 text-slate-900 dark:text-slate-50" />
			</button>
		</div>
	)
}

