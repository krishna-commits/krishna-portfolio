'use client'

/** Shared SWR options so admin edits show on the site after tab focus or navigation. */
export const homepageSwrOptions = {
	revalidateOnFocus: true,
	revalidateIfStale: true,
	dedupingInterval: 3_000,
} as const

export const homepageFetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => r.json())
