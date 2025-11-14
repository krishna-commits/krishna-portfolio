'use client'

import { useEffect } from 'react'
import { measureWebVitals } from 'app/lib/performance'

/**
 * Performance monitoring component
 */
export function PerformanceMonitor() {
	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		// Measure Web Vitals on mount
		measureWebVitals()

		// Measure page load time
		if (document.readyState === 'complete') {
			const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
			console.log('[Performance] Page load time:', loadTime, 'ms')
		} else {
			window.addEventListener('load', () => {
				const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
				console.log('[Performance] Page load time:', loadTime, 'ms')
			})
		}
	}, [])

	return null
}

