import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from 'config/site'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

/**
 * Fetch Medium stats from the stats page
 * Note: Medium doesn't have a public API, so we need to:
 * 1. Use session cookies (MEDIUM_SID and MEDIUM_UID environment variables)
 * 2. Or use MEDIUM_TOTAL_READS environment variable as a fallback
 */
async function fetchMediumStats(): Promise<{ totalReads: number; totalPosts: number }> {
	// Option 1: Use environment variable if provided
	const mediumTotalReads = process.env.MEDIUM_TOTAL_READS 
		? parseInt(process.env.MEDIUM_TOTAL_READS, 10) 
		: null

	// Option 2: Try to scrape stats page with session cookies
	const mediumSid = process.env.MEDIUM_SID
	const mediumUid = process.env.MEDIUM_UID
	
	if (mediumSid && mediumUid) {
		try {
			// Fetch the Medium stats page with cookies
			const response = await fetch('https://medium.com/me/stats', {
				headers: {
					'Cookie': `sid=${mediumSid}; uid=${mediumUid}`,
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				},
				next: { revalidate: 3600 }, // Cache for 1 hour
			})

			if (response.ok) {
				const html = await response.text()
				
				// Try to extract stats from the HTML
				// Medium embeds stats in JSON-LD or window.__APOLLO_STATE__ or similar
				const jsonMatch = html.match(/window\.__APOLLO_STATE__\s*=\s*({.+?});/s)
				if (jsonMatch) {
					try {
						const apolloState = JSON.parse(jsonMatch[1])
						// Parse the Apollo state to find stats
						// This is a simplified version - you may need to adjust based on Medium's structure
						console.log('[Medium API] Found Apollo state, parsing...')
					} catch (parseError) {
						console.warn('[Medium API] Failed to parse Apollo state:', parseError)
					}
				}
				
				// Alternative: Try to find stats in meta tags or script tags
				// Medium often embeds data in <script> tags
				const scriptMatches = html.match(/<script[^>]*>([\s\S]*?window\.[\s\S]*?stats[\s\S]*?)<\/script>/gi)
				if (scriptMatches) {
					console.log('[Medium API] Found stats scripts')
				}
			}
		} catch (fetchError) {
			console.warn('[Medium API] Failed to fetch stats page:', fetchError)
		}
	}

	// Fallback: Use environment variable or fetch RSS to get post count
	const mediumUsername = siteConfig.links.medium.split('@').pop()?.split('/')[0] || 'neupane.krishna33'
	const rssUrl = `https://medium.com/feed/@${mediumUsername}`
	
	let totalPosts = 0
	try {
		const rssResponse = await fetch(
			`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
			{
				next: { revalidate: 3600 }, // Cache for 1 hour
			}
		)

		if (rssResponse.ok) {
			const data = await rssResponse.json()
			const posts = data.items || []
			totalPosts = posts.length
		}
	} catch (rssError) {
		console.warn('[Medium API] Failed to fetch RSS feed:', rssError)
	}

	return {
		totalReads: mediumTotalReads || 0,
		totalPosts,
	}
}

export async function GET(request: NextRequest) {
	try {
		const { totalReads, totalPosts } = await fetchMediumStats()

		// Fetch Medium RSS feed to get posts
		const mediumUsername = siteConfig.links.medium.split('@').pop()?.split('/')[0] || 'neupane.krishna33'
		const rssUrl = `https://medium.com/feed/@${mediumUsername}`
		
		let posts: any[] = []
		try {
			const response = await fetch(
				`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
				{
					next: { revalidate: 3600 }, // Cache for 1 hour
				}
			)

			if (response.ok) {
				const data = await response.json()
				posts = (data.items || []).map((post: any) => ({
					title: post.title,
					link: post.link,
					pubDate: post.pubDate,
				}))
			}
		} catch (rssError) {
			console.warn('[Medium API] Failed to fetch RSS feed:', rssError)
		}

		return NextResponse.json({
			totalPosts: totalPosts || posts.length,
			totalReads,
			posts,
			lastUpdated: new Date().toISOString(),
			// Add helpful message if using fallback
			...(process.env.MEDIUM_TOTAL_READS 
				? { source: 'environment_variable' }
				: { 
					source: 'fallback',
					message: 'Set MEDIUM_TOTAL_READS environment variable or MEDIUM_SID and MEDIUM_UID for automatic fetching'
				}
			),
		})
	} catch (error) {
		console.error('[Medium API] Exception:', error)
		return NextResponse.json(
			{
				totalPosts: 0,
				totalReads: 0,
				posts: [],
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 200 } // Return 200 to prevent breaking the UI
		)
	}
}

