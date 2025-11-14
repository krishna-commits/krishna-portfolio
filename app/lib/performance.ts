/**
 * Performance monitoring utilities
 */

export function measurePerformance(name: string, fn: () => void) {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
		return fn()
	}

	const start = performance.now()
	const result = fn()
	const end = performance.now()
	const duration = end - start

	console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)

	return result
}

export async function measureAsyncPerformance<T>(
	name: string,
	fn: () => Promise<T>
): Promise<T> {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
		return fn()
	}

	const start = performance.now()
	const result = await fn()
	const end = performance.now()
	const duration = end - start

	console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)

	return result
}

/**
 * Measure Web Vitals
 */
export function measureWebVitals() {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
		return
	}

	// Largest Contentful Paint (LCP)
	if ('PerformanceObserver' in window) {
		new PerformanceObserver((list) => {
			const entries = list.getEntries()
			const lastEntry = entries[entries.length - 1] as any
			const lcp = lastEntry.renderTime || lastEntry.loadTime
			console.log('[Web Vitals] LCP:', lcp)
		}).observe({ entryTypes: ['largest-contentful-paint'] })

		// First Input Delay (FID)
		new PerformanceObserver((list) => {
			const entries = list.getEntries()
			entries.forEach((entry: any) => {
				const fid = entry.processingStart - entry.startTime
				console.log('[Web Vitals] FID:', fid)
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
			console.log('[Web Vitals] CLS:', clsValue)
		}).observe({ entryTypes: ['layout-shift'] })
	}

	// Time to First Byte (TTFB)
	const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
	if (navigationTiming) {
		const ttfb = navigationTiming.responseStart - navigationTiming.requestStart
		console.log('[Web Vitals] TTFB:', ttfb)
	}
}

/**
 * Measure React component render time
 */
export function measureComponentRender(componentName: string) {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
		return () => {}
	}

	const start = performance.now()

	return () => {
		const end = performance.now()
		const renderTime = end - start
		console.log(`[Component] ${componentName} render time: ${renderTime.toFixed(2)}ms`)
	}
}

