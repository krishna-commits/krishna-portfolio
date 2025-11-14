'use client'

import { useEffect } from 'react'

/**
 * Custom hook for performance monitoring
 */
export function usePerformanceMetrics() {
	useEffect(() => {
		if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
			return
		}

		// Measure Web Vitals
		const measureWebVitals = () => {
			// Largest Contentful Paint (LCP)
			new PerformanceObserver((list) => {
				const entries = list.getEntries()
				const lastEntry = entries[entries.length - 1] as any
				console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
			}).observe({ entryTypes: ['largest-contentful-paint'] })

			// First Input Delay (FID)
			new PerformanceObserver((list) => {
				const entries = list.getEntries()
				entries.forEach((entry: any) => {
					console.log('FID:', entry.processingStart - entry.startTime)
				})
			}).observe({ entryTypes: ['first-input'] })

			// Cumulative Layout Shift (CLS)
			let clsValue = 0
			new PerformanceObserver((list) => {
				const entries = list.getEntries()
				entries.forEach((entry: any) => {
					if (!entry.hadRecentInput) {
						clsValue += entry.value
					}
				})
				console.log('CLS:', clsValue)
			}).observe({ entryTypes: ['layout-shift'] })

			// Time to First Byte (TTFB)
			const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
			if (navigationTiming) {
				const ttfb = navigationTiming.responseStart - navigationTiming.requestStart
				console.log('TTFB:', ttfb)
			}
		}

		measureWebVitals()
	}, [])
}

/**
 * Custom hook for measuring component render time
 */
export function useRenderTime(componentName: string) {
	useEffect(() => {
		if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
			return
		}

		const startTime = performance.now()

		return () => {
			const endTime = performance.now()
			const renderTime = endTime - startTime
			console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
		}
	}, [componentName])
}

