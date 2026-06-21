export type CloudflareDailyRow = {
	date: string
	requests: number
	bytes: number
	cachedBytes: number
	cachedRequests: number
	pageViews: number
	cacheHitRate: number
	bandwidthSaved: number
}

export type CloudflareAnalyticsResult = {
	summary: {
		totalRequests: number
		totalBytes: number
		totalCachedBytes: number
		totalCachedRequests: number
		totalPageViews: number
		cacheHitRate: number
		bandwidthSaved: number
		avgRequestsPerDay: number
		days: number
	}
	dailyData: CloudflareDailyRow[]
	chartData: {
		requests: Array<{ date: string; value: number }>
		bandwidth: Array<{ date: string; value: number }>
		cacheHitRate: Array<{ date: string; value: number }>
		pageViews: Array<{ date: string; value: number }>
	}
}

async function fetchCloudflareGraphQL(
	zoneId: string,
	apiToken: string,
	startDate: string,
	endDate: string,
) {
	const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequests1dGroups(
            limit: 10000
            filter: {
              date_geq: "${startDate}"
              date_leq: "${endDate}"
            }
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum {
              requests
              bytes
              cachedBytes
              cachedRequests
              pageViews
            }
          }
        }
      }
    }
  `

	const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query }),
	})

	const body = await response.json().catch(() => ({}))

	if (!response.ok) {
		throw new Error(
			`Cloudflare API error: ${response.status} - ${JSON.stringify(body).slice(0, 300)}`,
		)
	}

	if (body.errors?.length) {
		throw new Error(body.errors.map((e: { message?: string }) => e.message).join('; '))
	}

	return body
}

export async function fetchCloudflareAnalytics(
	zoneId: string,
	apiToken: string,
	days: number,
): Promise<CloudflareAnalyticsResult> {
	const endDate = new Date()
	const startDate = new Date()
	startDate.setDate(startDate.getDate() - days)

	const startDateStr = startDate.toISOString().split('T')[0]
	const endDateStr = endDate.toISOString().split('T')[0]

	const data = await fetchCloudflareGraphQL(zoneId, apiToken, startDateStr, endDateStr)
	const zones = data?.data?.viewer?.zones || []

	if (zones.length === 0) {
		throw new Error('No zone found — check CLOUDFLARE_ZONE_ID and token Analytics:Read permission')
	}

	const httpRequests = zones[0].httpRequests1dGroups || []

	let totalRequests = 0
	let totalBytes = 0
	let totalCachedBytes = 0
	let totalCachedRequests = 0
	let totalPageViews = 0

	const dailyData: CloudflareDailyRow[] = httpRequests.map((item: {
		dimensions?: { date?: string }
		sum?: {
			requests?: number
			bytes?: number
			cachedBytes?: number
			cachedRequests?: number
			pageViews?: number
		}
	}) => {
		const requests = item.sum?.requests || 0
		const bytes = item.sum?.bytes || 0
		const cachedBytes = item.sum?.cachedBytes || 0
		const cachedRequests = item.sum?.cachedRequests || 0
		const pageViews = item.sum?.pageViews || 0

		totalRequests += requests
		totalBytes += bytes
		totalCachedBytes += cachedBytes
		totalCachedRequests += cachedRequests
		totalPageViews += pageViews

		return {
			date: item.dimensions?.date || '',
			requests,
			bytes,
			cachedBytes,
			cachedRequests,
			pageViews,
			cacheHitRate: requests > 0 ? (cachedRequests / requests) * 100 : 0,
			bandwidthSaved: cachedBytes,
		}
	})

	const cacheHitRate = totalRequests > 0 ? (totalCachedRequests / totalRequests) * 100 : 0
	const avgRequestsPerDay = dailyData.length > 0 ? totalRequests / dailyData.length : 0

	return {
		summary: {
			totalRequests,
			totalBytes,
			totalCachedBytes,
			totalCachedRequests,
			totalPageViews,
			cacheHitRate: Math.round(cacheHitRate * 100) / 100,
			bandwidthSaved: totalCachedBytes,
			avgRequestsPerDay: Math.round(avgRequestsPerDay),
			days: dailyData.length,
		},
		dailyData,
		chartData: {
			requests: dailyData.map((d) => ({ date: d.date, value: d.requests })),
			bandwidth: dailyData.map((d) => ({
				date: d.date,
				value: Math.round(d.bytes / 1024 / 1024),
			})),
			cacheHitRate: dailyData.map((d) => ({ date: d.date, value: d.cacheHitRate })),
			pageViews: dailyData.map((d) => ({ date: d.date, value: d.pageViews })),
		},
	}
}
