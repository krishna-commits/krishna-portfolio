'use client'

import { useState, useEffect } from 'react'

interface ViewportSize {
	width: number
	height: number
}

/**
 * Custom hook for viewport size
 */
export function useViewport(): ViewportSize {
	const [viewport, setViewport] = useState<ViewportSize>({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	})

	useEffect(() => {
		if (typeof window === 'undefined') return

		const handleResize = () => {
			setViewport({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener('resize', handleResize)
		handleResize()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return viewport
}

/**
 * Custom hook for breakpoints
 */
export function useBreakpoint(): {
	isMobile: boolean
	isTablet: boolean
	isDesktop: boolean
	isLarge: boolean
} {
	const { width } = useViewport()

	return {
		isMobile: width < 640,
		isTablet: width >= 640 && width < 1024,
		isDesktop: width >= 1024 && width < 1280,
		isLarge: width >= 1280,
	}
}

