import type { ContentType } from 'app/lib/content-utils'
import {
	allBlogPosts,
	allMantras,
	allProjects,
	allResearchCores,
} from 'contentlayer/generated'
import {
	getMdxDocumentBySlug,
	listMdxDocuments,
	type MdxDocumentRecord,
} from 'lib/mdx-document-store'
import { markdownBodyToHtml } from 'lib/mdx-markdown-html'

export type ContentListItem = {
	filepath: string
	slug: string
	title: string
	description?: string
	date?: string
	keywords?: string[]
	highlight?: boolean
	link?: string
	source: 'db' | 'contentlayer'
	updatedAt?: string
	[key: string]: unknown
}

export type ResolvedContentPost = ContentListItem & {
	body?: string
	bodyHtml?: string
	renderKind: 'contentlayer' | 'html'
	bodyCode?: string
}

function slugFromFilepath(filepath: string): string {
	return filepath.replace(/\.mdx$/, '')
}

function contentlayerCollection(type: ContentType) {
	switch (type) {
		case 'blog':
			return allBlogPosts
		case 'project':
			return allProjects
		case 'research':
			return allResearchCores
		case 'mantra':
			return allMantras
		default:
			return []
	}
}

function contentlayerToListItem(type: ContentType, doc: (typeof allResearchCores)[number]): ContentListItem {
	const slug =
		'slugAsParams' in doc && doc.slugAsParams
			? String(doc.slugAsParams)
			: slugFromFilepath(String(doc._raw.flattenedPath).split('/').slice(1).join('/'))
	return {
		filepath: `${slug}.mdx`,
		slug,
		title: String(doc.title ?? slug),
		description: doc.description ? String(doc.description) : undefined,
		date: doc.date ? String(doc.date) : undefined,
		keywords: Array.isArray(doc.keywords) ? doc.keywords.map(String) : undefined,
		highlight: 'highlight' in doc ? Boolean(doc.highlight) : undefined,
		link: 'link' in doc && doc.link ? String(doc.link) : undefined,
		source: 'contentlayer',
	}
}

function dbToListItem(doc: MdxDocumentRecord): ContentListItem {
	const fm = doc.frontmatter
	const slug = slugFromFilepath(doc.filepath)
	return {
		filepath: doc.filepath,
		slug,
		title: String(fm.title ?? slug),
		description: fm.description ? String(fm.description) : undefined,
		date: fm.date ? String(fm.date) : undefined,
		keywords: Array.isArray(fm.keywords) ? fm.keywords.map(String) : undefined,
		highlight: fm.highlight != null ? Boolean(fm.highlight) : undefined,
		link: fm.link ? String(fm.link) : undefined,
		source: 'db',
		updatedAt: doc.updatedAt.toISOString(),
		...fm,
	}
}

/** DB rows override contentlayer entries with the same slug. */
export async function listContent(type: ContentType): Promise<ContentListItem[]> {
	const dbDocs = await listMdxDocuments(type)
	const dbBySlug = new Map(dbDocs.map((d) => [slugFromFilepath(d.filepath), dbToListItem(d)]))

	for (const doc of contentlayerCollection(type)) {
		const item = contentlayerToListItem(type, doc as (typeof allResearchCores)[number])
		if (!dbBySlug.has(item.slug)) {
			dbBySlug.set(item.slug, item)
		}
	}

	return Array.from(dbBySlug.values()).sort((a, b) => {
		const da = Date.parse(String(a.date ?? a.updatedAt ?? '')) || 0
		const db = Date.parse(String(b.date ?? b.updatedAt ?? '')) || 0
		return db - da
	})
}

export async function getContentBySlug(
	type: ContentType,
	slug: string,
): Promise<ResolvedContentPost | null> {
	const dbDoc = await getMdxDocumentBySlug(type, slug)
	if (dbDoc) {
		const item = dbToListItem(dbDoc)
		const bodyHtml = await markdownBodyToHtml(dbDoc.body)
		return {
			...item,
			body: dbDoc.body,
			bodyHtml,
			renderKind: 'html',
		}
	}

	const normalized = slug.replace(/^\//, '').replace(/\.mdx$/, '')
	const clDoc = contentlayerCollection(type).find((doc) => {
		const clSlug =
			'slugAsParams' in doc && doc.slugAsParams
				? String(doc.slugAsParams)
				: slugFromFilepath(String(doc._raw.flattenedPath).split('/').slice(1).join('/'))
		return clSlug === normalized
	})

	if (!clDoc) return null

	const item = contentlayerToListItem(type, clDoc as (typeof allResearchCores)[number])
	return {
		...item,
		renderKind: 'contentlayer',
		bodyCode: 'body' in clDoc && clDoc.body && 'code' in clDoc.body ? String(clDoc.body.code) : undefined,
	}
}
