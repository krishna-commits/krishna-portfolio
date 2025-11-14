'use client'

import { useMemo, useCallback, useRef, DependencyList } from 'react'

/**
 * Custom hook for stable memoization with dependency tracking
 */
export function useStableMemo<T>(
	factory: () => T,
	deps: DependencyList
): T {
	const ref = useRef<{ deps: DependencyList; value: T }>()

	if (!ref.current || !areDepsEqual(ref.current.deps, deps)) {
		ref.current = { deps, value: factory() }
	}

	return ref.current.value
}

/**
 * Custom hook for stable callbacks
 */
export function useStableCallback<T extends (...args: any[]) => any>(
	callback: T,
	deps: DependencyList
): T {
	return useCallback(callback, deps) as T
}

/**
 * Helper function to compare dependency arrays
 */
function areDepsEqual(deps1: DependencyList, deps2: DependencyList): boolean {
	if (deps1.length !== deps2.length) {
		return false
	}

	for (let i = 0; i < deps1.length; i++) {
		if (deps1[i] !== deps2[i]) {
			return false
		}
	}

	return true
}

