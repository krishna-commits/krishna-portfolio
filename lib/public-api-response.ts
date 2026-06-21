import { NextResponse } from 'next/server'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0, must-revalidate' }

/** JSON for public homepage APIs — avoid stale CDN/browser cache after admin edits. */
export function publicJson<T>(body: T, status = 200) {
	return NextResponse.json(body, { status, headers: NO_STORE })
}
