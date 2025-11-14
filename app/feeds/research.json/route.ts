import { NextResponse } from 'next/server'
import { allResearchCores } from 'contentlayer/generated'

export async function GET() {
	const items = allResearchCores
		.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
		.map((doc: any) => ({
			title: doc.title,
			url: doc.url,
			description: doc.description ?? '',
			date: doc.date ?? null,
			venue: doc.venue ?? null,
			citationCount: doc.citationCount ?? 0,
			keywords: doc.keywords ?? [],
			collaborators: doc.collaborators ?? [],
			highlight: doc.highlight ?? false,
			parent: doc.parent ?? null,
			grand_parent: doc.grand_parent ?? null,
			order: doc.order ?? null,
			completed: doc.completed ?? false,
		}))

	return NextResponse.json(
		{
			version: 1,
			generatedAt: new Date().toISOString(),
			count: items.length,
			items,
		},
		{ status: 200 }
	)
}

