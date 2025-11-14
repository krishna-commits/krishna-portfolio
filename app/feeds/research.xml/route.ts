import { NextResponse } from 'next/server'
import { allResearchCores } from 'contentlayer/generated'

const siteUrl = 'https://Krishnaneupane.com'

function escapeXml(unsafe: string) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

export async function GET() {
	const items = allResearchCores
		.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
		.map((doc: any) => {
			const link = `${siteUrl}${doc.url}`
			const title = escapeXml(doc.title)
			const description = escapeXml(doc.description ?? '')
			const pubDate = doc.date ? new Date(doc.date).toUTCString() : new Date().toUTCString()
			return `
      <item>
        <title>${title}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${pubDate}</pubDate>
        <description>${description}</description>
      </item>
    `
		})
		.join('')

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Research Core Updates</title>
    <link>${siteUrl}</link>
    <description>Latest entries and updates from the Research Core</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`

	return new NextResponse(rss, {
		status: 200,
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
		},
	})
}

