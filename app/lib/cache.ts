/**
 * Client-side caching utilities
 */

const CACHE_PREFIX = 'portfolio_'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
	data: T
	timestamp: number
	expiry: number
}

/**
 * Get cached data
 */
export function getCachedData<T>(key: string): T | null {
	if (typeof window === 'undefined') {
		return null
	}

	try {
		const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
		if (!cached) {
			return null
		}

		const entry: CacheEntry<T> = JSON.parse(cached)
		const now = Date.now()

		if (now > entry.timestamp + entry.expiry) {
			localStorage.removeItem(`${CACHE_PREFIX}${key}`)
			return null
		}

		return entry.data
	} catch (error) {
		console.error('[Cache] Error getting cached data:', error)
		return null
	}
}

/**
 * Set cached data
 */
export function setCachedData<T>(key: string, data: T, expiry: number = CACHE_EXPIRY): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
			expiry,
		}

		localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry))
	} catch (error) {
		console.error('[Cache] Error setting cached data:', error)
	}
}

/**
 * Clear cached data
 */
export function clearCachedData(key: string): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.removeItem(`${CACHE_PREFIX}${key}`)
	} catch (error) {
		console.error('[Cache] Error clearing cached data:', error)
	}
}

/**
 * Clear all cached data
 */
export function clearAllCachedData(): void {
	if (typeof window === 'undefined') {
		return
	}

	try {
		const keys = Object.keys(localStorage)
		keys.forEach((key) => {
			if (key.startsWith(CACHE_PREFIX)) {
				localStorage.removeItem(key)
			}
		})
	} catch (error) {
		console.error('[Cache] Error clearing all cached data:', error)
	}
}

/**
 * Check if cached data exists and is valid
 */
export function isCachedDataValid(key: string): boolean {
	if (typeof window === 'undefined') {
		return false
	}

	try {
		const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
		if (!cached) {
			return false
		}

		const entry: CacheEntry<unknown> = JSON.parse(cached)
		const now = Date.now()

		return now <= entry.timestamp + entry.expiry
	} catch (error) {
		return false
	}
}

