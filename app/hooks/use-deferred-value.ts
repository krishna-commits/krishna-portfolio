'use client'

import { useDeferredValue as useReactDeferredValue, useState, useEffect, useTransition } from 'react'

/**
 * Custom hook for deferred values with loading state
 */
export function useDeferredValue<T>(value: T) {
	const deferredValue = useReactDeferredValue(value)
	const [isPending, startTransition] = useTransition()
	const [isDeferred, setIsDeferred] = useState(false)

	useEffect(() => {
		if (value !== deferredValue) {
			setIsDeferred(true)
			startTransition(() => {
				setIsDeferred(false)
			})
		}
	}, [value, deferredValue])

	return {
		value: deferredValue,
		isPending: isPending || isDeferred,
	}
}

/**
 * Custom hook for transitions with loading state
 */
export function useTransitionState() {
	const [isPending, startTransition] = useTransition()
	return { isPending, startTransition }
}

