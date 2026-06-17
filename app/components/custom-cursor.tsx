'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from 'app/theme/lib/utils'

type CursorMode = 'default' | 'pointer' | 'text'

const INTERACTIVE_SELECTOR =
	'a, button, [role="button"], [data-cursor="pointer"], .cursor-pointer, summary, label[for]'

const TEXT_SELECTOR =
	'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]'

function resolveMode(target: HTMLElement): CursorMode {
	if (target.closest(TEXT_SELECTOR)) return 'text'
	if (target.closest(INTERACTIVE_SELECTOR)) return 'pointer'
	return 'default'
}

export function CustomCursor() {
	const [mounted, setMounted] = useState(false)
	const [showCursor, setShowCursor] = useState(false)
	const [mode, setMode] = useState<CursorMode>('default')
	const [isClicking, setIsClicking] = useState(false)

	const cursorX = useMotionValue(-100)
	const cursorY = useMotionValue(-100)
	const springConfig = { damping: 28, stiffness: 380, mass: 0.4 }
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
		if (!showCursor) {
			document.body.classList.remove('custom-cursor-active')
			return
		}
		document.body.classList.add('custom-cursor-active')
		return () => document.body.classList.remove('custom-cursor-active')
	}, [showCursor])

	useEffect(() => {
		if (!showCursor) return

		const updateCursor = (e: MouseEvent) => {
			cursorX.set(e.clientX)
			cursorY.set(e.clientY)
			setMode(resolveMode(e.target as HTMLElement))
		}

		const handleMouseDown = () => setIsClicking(true)
		const handleMouseUp = () => setIsClicking(false)

		window.addEventListener('mousemove', updateCursor, { passive: true })
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			window.removeEventListener('mousemove', updateCursor)
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [showCursor, cursorX, cursorY])

	if (!mounted || !showCursor) {
		return null
	}

	const isPointer = mode === 'pointer'
	const isText = mode === 'text'
	const visible = !isText

	return (
		<>
			<motion.div
				aria-hidden
				className={cn(
					'pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border will-change-transform',
					isPointer
						? 'h-10 w-10 border-amber-500/45 bg-amber-500/5'
						: 'h-8 w-8 border-border/70 bg-transparent',
					!visible && 'opacity-0',
				)}
				style={{
					x: cursorXSpring,
					y: cursorYSpring,
					translateX: '-50%',
					translateY: '-50%',
				}}
				animate={{
					scale: isPointer ? 1.2 : isClicking ? 0.85 : 1,
				}}
				transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			/>

			<motion.div
				aria-hidden
				className={cn(
					'pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-amber-600 dark:bg-amber-500 will-change-transform',
					isPointer ? 'h-2 w-2' : 'h-1.5 w-1.5',
					isClicking && 'scale-75',
					!visible && 'opacity-0',
				)}
				style={{
					x: cursorXSpring,
					y: cursorYSpring,
					translateX: '-50%',
					translateY: '-50%',
				}}
			/>

			{isClicking && visible && (
				<motion.div
					aria-hidden
					className="pointer-events-none fixed top-0 left-0 z-[9997] h-8 w-8 rounded-full border border-amber-500/40"
					style={{
						x: cursorXSpring,
						y: cursorYSpring,
						translateX: '-50%',
						translateY: '-50%',
					}}
					initial={{ scale: 0.6, opacity: 0.6 }}
					animate={{ scale: 2.2, opacity: 0 }}
					transition={{ duration: 0.45, ease: 'easeOut' }}
				/>
			)}
		</>
	)
}
