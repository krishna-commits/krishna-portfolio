'use client'

import { useEffect, useState } from 'react'

/** Skip scroll/mount animations on mobile or when user prefers reduced motion. */
export function useLightMotion(): boolean {
	const [light, setLight] = useState(true)

	useEffect(() => {
		const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
		const mqMobile = window.matchMedia('(max-width: 767px)')

		const update = () => setLight(mqMotion.matches || mqMobile.matches)
		update()

		mqMotion.addEventListener('change', update)
		mqMobile.addEventListener('change', update)
		return () => {
			mqMotion.removeEventListener('change', update)
			mqMobile.removeEventListener('change', update)
		}
	}, [])

	return light
}
