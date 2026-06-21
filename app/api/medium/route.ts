import { NextRequest, NextResponse } from 'next/server'
import { fetchMediumStats, getMediumRssUsername } from 'lib/medium-stats'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(_request: NextRequest) {
	try {
		const stats = await fetchMediumStats()

		const mediumUsername = await getMediumRssUsername()
		const rssUrl = `https://medium.com/feed/@${mediumUsername}`

		let posts: { title: string; link: string; pubDate: string }[] = []
		try {
			const response = await fetch(
				`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
				{ next: { revalidate: 3600 } },
			)
			if (response.ok) {
				const data = await response.json()
				posts = (data.items || []).map((post: { title: string; link: string; pubDate: string }) => ({
					title: post.title,
					link: post.link,
					pubDate: post.pubDate,
				}))
			}
		} catch (rssError) {
			console.warn('[Medium API] Failed to fetch RSS feed:', rssError)
		}

		return NextResponse.json({
			totalPosts: stats.totalPosts || posts.length,
			totalReads: stats.totalReads,
			posts,
			source: stats.source,
			lastUpdated: stats.fetchedAt,
		})
	} catch (error) {
		console.error('[Medium API] Exception:', error)
		return NextResponse.json(
			{
				totalPosts: 0,
				totalReads: 0,
				posts: [],
				source: 'error',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 500 },
		)
	}
}

