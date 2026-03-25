'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

export function CustomCursor() {
	const [mounted, setMounted] = useState(false)
	const [showCursor, setShowCursor] = useState(false)
	const [isHovering, setIsHovering] = useState(false)
	const [isClicking, setIsClicking] = useState(false)

	const cursorX = useMotionValue(-100)
	const cursorY = useMotionValue(-100)
	const springConfig = { damping: 25, stiffness: 300 }
	const cursorXSpring = useSpring(cursorX, springConfig)
	const cursorYSpring = useSpring(cursorY, springConfig)

	useEffect(() => {
		setMounted(true)
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
		const finePointer = window.matchMedia('(pointer: fine)')

		const sync = () => {
			setShowCursor(finePointer.matches && !reduceMotion.matches)
		}
		sync()
		reduceMotion.addEventListener('change', sync)
		finePointer.addEventListener('change', sync)
		return () => {
			reduceMotion.removeEventListener('change', sync)
			finePointer.removeEventListener('change', sync)
		}
	}, [])

	useEffect(() => {
		if (!showCursor) return

		const updateCursor = (e: MouseEvent) => {
			cursorX.set(e.clientX)
			cursorY.set(e.clientY)
		}

		const handleMouseDown = () => setIsClicking(true)
		const handleMouseUp = () => setIsClicking(false)

		const handleMouseEnter = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (
				target.tagName === 'A' ||
				target.tagName === 'BUTTON' ||
				target.closest('button') ||
				target.closest('a') ||
				target.closest('[role="button"]')
			) {
				setIsHovering(true)
			}
		}

		const handleMouseLeave = () => {
			setIsHovering(false)
		}

		window.addEventListener('mousemove', updateCursor)
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mouseup', handleMouseUp)
		document.addEventListener('mouseenter', handleMouseEnter, true)
		document.addEventListener('mouseleave', handleMouseLeave, true)

		return () => {
			window.removeEventListener('mousemove', updateCursor)
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mouseup', handleMouseUp)
			document.removeEventListener('mouseenter', handleMouseEnter, true)
			document.removeEventListener('mouseleave', handleMouseLeave, true)
		}
	}, [showCursor, cursorX, cursorY])

	if (!mounted || !showCursor) {
		return null
	}

	return (
		<>
			<motion.div
				className={cn(
					"fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference",
					"bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500",
					"border-2 border-white/20",
					isHovering && "scale-150",
					isClicking && "scale-75"
				)}
				style={{
					x: cursorXSpring,
					y: cursorYSpring,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>

			<motion.div
				className={cn(
					"fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]",
					"bg-gradient-to-br from-yellow-400/30 via-amber-500/30 to-orange-500/30",
					"blur-sm"
				)}
				style={{
					x: cursorXSpring,
					y: cursorYSpring,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>

			{isClicking && (
				<motion.div
					className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] bg-yellow-400/50"
					style={{
						x: cursorXSpring,
						y: cursorYSpring,
						translateX: '-50%',
						translateY: '-50%',
					}}
					initial={{ scale: 1, opacity: 0.8 }}
					animate={{ scale: 4, opacity: 0 }}
					transition={{ duration: 0.6 }}
				/>
			)}
		</>
	)
}
