/**
 * Bundle analysis utilities
 */

/**
 * Analyze bundle size
 */
export function analyzeBundleSize() {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
		return
	}

	// Get all script tags
	const scripts = Array.from(document.querySelectorAll('script[src]'))
	const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))

	console.log('=== Bundle Analysis ===')
	console.log('Scripts:', scripts.length)
	console.log('Styles:', styles.length)

	// Measure load time
	const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
	if (navigationTiming) {
		const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart
		console.log('Load Time:', loadTime, 'ms')
	}

	// Measure resource sizes
	performance.getEntriesByType('resource').forEach((resource: any) => {
		if (resource.initiatorType === 'script' || resource.initiatorType === 'link') {
			console.log(`${resource.name}: ${(resource.transferSize / 1024).toFixed(2)} KB`)
		}
	})
}

/**
 * Monitor bundle size over time
 */
export function monitorBundleSize() {
	if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
		return
	}

	// Monitor bundle size on each page load
	window.addEventListener('load', () => {
		analyzeBundleSize()
	})
}

