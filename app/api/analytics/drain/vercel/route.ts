import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsEnv } from 'lib/analytics-env'
import { storeVercelDrainEvents, type VercelDrainEventInput } from 'lib/vercel-analytics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function parseDrainPayload(raw: unknown): VercelDrainEventInput[] {
	if (!raw) return []

	if (Array.isArray(raw)) {
		return raw.map(normalizeDrainEvent).filter(Boolean) as VercelDrainEventInput[]
	}

	if (typeof raw === 'object') {
		const obj = raw as Record<string, unknown>
		if (Array.isArray(obj.events)) {
			return obj.events.map(normalizeDrainEvent).filter(Boolean) as VercelDrainEventInput[]
		}
		const single = normalizeDrainEvent(obj)
		return single ? [single] : []
	}

	return []
}

function normalizeDrainEvent(item: unknown): VercelDrainEventInput | null {
	if (!item || typeof item !== 'object') return null
	const row = item as Record<string, unknown>

	return {
		timestamp: typeof row.timestamp === 'number' ? row.timestamp : undefined,
		deviceId: typeof row.deviceId === 'string' ? row.deviceId : undefined,
		origin: typeof row.origin === 'string' ? row.origin : undefined,
		path: typeof row.path === 'string' ? row.path : undefined,
		country: typeof row.country === 'string' ? row.country : undefined,
		referrer: typeof row.referrer === 'string' ? row.referrer : undefined,
		eventType: typeof row.eventType === 'string' ? row.eventType : 'pageview',
	}
}

function parseNdjson(body: string): VercelDrainEventInput[] {
	return body
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			try {
				return normalizeDrainEvent(JSON.parse(line))
			} catch {
				return null
			}
		})
		.filter(Boolean) as VercelDrainEventInput[]
}

async function authorizeDrain(request: NextRequest): Promise<boolean> {
	const secret = await getAnalyticsEnv('VERCEL_ANALYTICS_DRAIN_SECRET')
	if (!secret) return true

	const auth = request.headers.get('authorization') || ''
	const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : auth
	const headerSecret = request.headers.get('x-vercel-drain-secret')

	return bearer === secret || headerSecret === secret
}

/** Receives Vercel Web Analytics Drain events (JSON array or NDJSON). */
export async function POST(request: NextRequest) {
	try {
		if (!(await authorizeDrain(request))) {
			return NextResponse.json({ error: 'Unauthorized drain request' }, { status: 401 })
		}

		const contentType = request.headers.get('content-type') || ''
		const rawBody = await request.text()

		let events: VercelDrainEventInput[] = []

		if (contentType.includes('application/x-ndjson') || rawBody.includes('\n{')) {
			events = parseNdjson(rawBody)
		} else {
			try {
				events = parseDrainPayload(JSON.parse(rawBody))
			} catch {
				events = parseNdjson(rawBody)
			}
		}

		const stored = await storeVercelDrainEvents(events)

		return NextResponse.json({ ok: true, received: events.length, stored }, { status: 200 })
	} catch (error) {
		console.error('[Vercel Analytics Drain]', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Drain ingest failed' },
			{ status: 500 },
		)
	}
}

export async function GET() {
	return NextResponse.json({
		ok: true,
		message: 'Vercel Web Analytics drain endpoint. Configure in Vercel → Project → Drains.',
	})
}
