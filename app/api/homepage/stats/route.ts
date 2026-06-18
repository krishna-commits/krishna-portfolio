import { NextResponse } from 'next/server'
import { getSiteSettingJson } from 'lib/site-settings'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Record<string, unknown> | null>('stats', null)
		return NextResponse.json({ stats: stored ?? {} }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Stats Public API]', error)
		return NextResponse.json({ stats: {} }, { status: 200 })
	}
}
