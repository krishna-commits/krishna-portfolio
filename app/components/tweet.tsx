'use client'

import { Tweet } from 'react-tweet'
import { useState, useEffect } from 'react'

export function TweetEmbed({ id }: { id: string }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className="flex items-center justify-center p-8 border border-slate-200 dark:border-slate-800 rounded-lg">
				<p className="text-sm text-slate-500 dark:text-slate-400">Loading tweet...</p>
			</div>
		)
	}

	return (
		<div className="my-6">
			<Tweet id={id} />
		</div>
	)
}
