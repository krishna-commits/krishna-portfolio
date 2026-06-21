import { prisma } from 'lib/prisma'

type MetricsQueryResponse = {
	data?: Array<{ timestamp: string } & Record<string, string | number | null>>
	summary?: Array<Record<string, string | number | null>>
	error?: { message?: string }
}

export type VercelObservabilityResult = {
	ok: boolean
	totalRequests: number
	daily: Array<{ date: string; requests: number }>
	note?: string
	error?: string
}

export type VercelDrainAnalyticsResult = {
	ok: boolean
	pageViews: number
	uniqueDevices: number
	daily: Array<{ date: string; pageViews: number; devices: number }>
	topPaths: Array<{ path: string; views: number }>
	note?: string
	error?: string
}

export async function fetchVercelObservability(
	accessToken: string,
	teamId: string,
	projectId: string,
	days: number,
): Promise<VercelObservabilityResult> {
	const end = new Date()
	const start = new Date()
	start.setDate(start.getDate() - days)

	const body = {
		scope: {
			type: 'project',
			ownerId: teamId,
			projectIds: [projectId],
		},
		metric: 'vercel.request.count',
		aggregation: 'sum',
		startTime: start.toISOString(),
		endTime: end.toISOString(),
		granularity: { days: 1 },
	}

	try {
		const response = await fetch(
			`https://api.vercel.com/v2/observability/query?teamId=${encodeURIComponent(teamId)}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		)

		const payload = (await response.json().catch(() => ({}))) as MetricsQueryResponse & {
			error?: { message?: string }
		}

		if (!response.ok) {
			const message =
				payload.error?.message ||
				`Vercel observability API returned ${response.status} (Observability Plus may be required)`
			return { ok: false, totalRequests: 0, daily: [], error: message }
		}

		const daily =
			payload.data?.map((row) => {
				const value =
					typeof row['vercel.request.count'] === 'number'
						? row['vercel.request.count']
						: Number(row.value ?? row.sum ?? 0)
				return {
					date: row.timestamp.split('T')[0],
					requests: Number.isFinite(value) ? value : 0,
				}
			}) ?? []

		const totalRequests = daily.reduce((sum, row) => sum + row.requests, 0)

		return {
			ok: true,
			totalRequests,
			daily,
			note: 'Edge request counts from Vercel Observability (not Web Analytics pageviews)',
		}
	} catch (error) {
		return {
			ok: false,
			totalRequests: 0,
			daily: [],
			error: error instanceof Error ? error.message : 'Failed to query Vercel observability',
		}
	}
}

export async function getVercelDrainAnalytics(days: number): Promise<VercelDrainAnalyticsResult> {
	if (!prisma) {
		return {
			ok: false,
			pageViews: 0,
			uniqueDevices: 0,
			daily: [],
			topPaths: [],
			error: 'Database not configured',
			note: 'Configure a Vercel Web Analytics Drain pointing to /api/analytics/drain/vercel',
		}
	}

	const startDate = new Date()
	startDate.setDate(startDate.getDate() - days)

	try {
		const events = await prisma.analyticsDrainEvent.findMany({
			where: {
				source: 'vercel-web-analytics',
				createdAt: { gte: startDate },
			},
			orderBy: { createdAt: 'asc' },
		})

		if (events.length === 0) {
			return {
				ok: false,
				pageViews: 0,
				uniqueDevices: 0,
				daily: [],
				topPaths: [],
				note: 'No drain events yet. Add a Web Analytics Drain in Vercel → Project → Drains → /api/analytics/drain/vercel',
			}
		}

		const devices = new Set<string>()
		const pathCounts: Record<string, number> = {}
		const dailyMap: Record<string, { pageViews: number; devices: Set<string> }> = {}

		for (const event of events) {
			if (event.deviceId) devices.add(event.deviceId)

			const path = event.pathname || '/'
			pathCounts[path] = (pathCounts[path] || 0) + 1

			const date = event.createdAt.toISOString().split('T')[0]
			if (!dailyMap[date]) {
				dailyMap[date] = { pageViews: 0, devices: new Set() }
			}
			dailyMap[date].pageViews++
			if (event.deviceId) dailyMap[date].devices.add(event.deviceId)
		}

		const daily = Object.entries(dailyMap)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, data]) => ({
				date,
				pageViews: data.pageViews,
				devices: data.devices.size,
			}))

		const topPaths = Object.entries(pathCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([path, views]) => ({ path, views }))

		return {
			ok: true,
			pageViews: events.length,
			uniqueDevices: devices.size,
			daily,
			topPaths,
			note: 'Aggregated from Vercel Web Analytics Drain events stored in your database',
		}
	} catch (error) {
		return {
			ok: false,
			pageViews: 0,
			uniqueDevices: 0,
			daily: [],
			topPaths: [],
			error: error instanceof Error ? error.message : 'Failed to read drain analytics',
		}
	}
}

export type VercelDrainEventInput = {
	timestamp?: number
	deviceId?: string
	origin?: string
	path?: string
	country?: string
	referrer?: string
	eventType?: string
}

export async function storeVercelDrainEvents(events: VercelDrainEventInput[]) {
	if (!prisma || events.length === 0) return 0

	await prisma.analyticsDrainEvent.createMany({
		data: events.map((event) => ({
			source: 'vercel-web-analytics',
			eventType: event.eventType || 'pageview',
			pathname: event.path || null,
			origin: event.origin || null,
			country: event.country || null,
			referrer: event.referrer || null,
			deviceId: event.deviceId || null,
			payload: JSON.stringify(event),
			createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
		})),
	})

	return events.length
}
