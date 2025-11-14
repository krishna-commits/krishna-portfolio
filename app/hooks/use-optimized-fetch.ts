'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCachedData, setCachedData, isCachedDataValid } from 'app/lib/cache'

interface UseOptimizedFetchOptions {
	cacheKey?: string
	cacheExpiry?: number
	enabled?: boolean
}

interface UseOptimizedFetchResult<T> {
	data: T | null
	loading: boolean
	error: Error | null
	refetch: () => void
}

/**
 * Optimized fetch hook with caching
 */
export function useOptimizedFetch<T>(
	url: string,
	options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchResult<T> {
	const { cacheKey, cacheExpiry = 5 * 60 * 1000, enabled = true } = options
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchData = useCallback(async () => {
		if (!enabled) {
			return
		}

		// Check cache first
		if (cacheKey && isCachedDataValid(cacheKey)) {
			const cachedData = getCachedData<T>(cacheKey)
			if (cachedData) {
				setData(cachedData)
				setLoading(false)
				return
			}
		}

		try {
			setLoading(true)
			setError(null)

			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()

			// Cache the data
			if (cacheKey) {
				setCachedData(cacheKey, result, cacheExpiry)
			}

			setData(result)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'))
		} finally {
			setLoading(false)
		}
	}, [url, cacheKey, cacheExpiry, enabled])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return {
		data,
		loading,
		error,
		refetch: fetchData,
	}
}

