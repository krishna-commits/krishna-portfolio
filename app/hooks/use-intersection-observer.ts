'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for Intersection Observer
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
	options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
	const [isIntersecting, setIsIntersecting] = useState(false)
	const [hasIntersected, setHasIntersected] = useState(false)
	const ref = useRef<T>(null)

	useEffect(() => {
		const element = ref.current
		if (!element) return

		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting)
			if (entry.isIntersecting && !hasIntersected) {
				setHasIntersected(true)
			}
		}, {
			threshold: options?.threshold || 0.1,
			rootMargin: options?.rootMargin || '0px',
			...options,
		})

		observer.observe(element)

		return () => {
			observer.unobserve(element)
		}
	}, [options, hasIntersected])

	return [ref, isIntersecting || hasIntersected]
}

/**
 * Custom hook for lazy loading with Intersection Observer
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
	options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
	const [shouldLoad, setShouldLoad] = useState(false)
	const ref = useRef<T>(null)

	useEffect(() => {
		const element = ref.current
		if (!element || shouldLoad) return

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setShouldLoad(true)
				observer.unobserve(element)
			}
		}, {
			threshold: options?.threshold || 0.01,
			rootMargin: options?.rootMargin || '50px',
			...options,
		})

		observer.observe(element)

		return () => {
			observer.unobserve(element)
		}
	}, [shouldLoad, options])

	return [ref, shouldLoad]
}

