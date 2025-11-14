import { NextResponse } from 'next/server'
import { siteConfig } from 'config/site'

export async function GET() {
	try {
		const orcidId = siteConfig.links.orcid.split('/').pop()
		
		if (!orcidId) {
			return NextResponse.json({ error: 'ORCID ID not found' }, { status: 400 })
		}

		// ORCID Public API endpoint (no authentication required for public works)
		const response = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
			headers: {
				'Accept': 'application/json',
			},
			next: { revalidate: 3600 }, // Cache for 1 hour
		})

		if (!response.ok) {
			// If API fails, return empty data instead of error
			return NextResponse.json({ works: [], count: 0 }, { status: 200 })
		}

		const data = await response.json()
		const works = data.group || []
		
		return NextResponse.json({
			works,
			count: works.length,
		}, { status: 200 })
	} catch (error) {
		console.error('ORCID API error:', error)
		// Return empty data on error to prevent breaking the UI
		return NextResponse.json({ works: [], count: 0 }, { status: 200 })
	}
}

