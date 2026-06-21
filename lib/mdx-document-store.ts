import { prisma } from 'lib/prisma'
import type { ContentType } from 'app/lib/content-utils'

export type MdxFrontmatter = Record<string, unknown>

export type MdxDocumentRecord = {
	id: number
	type: ContentType
	filepath: string
	frontmatter: MdxFrontmatter
	body: string
	updatedAt: Date
}

function parseFrontmatter(raw: string): MdxFrontmatter {
	try {
		return JSON.parse(raw) as MdxFrontmatter
	} catch {
		return {}
	}
}

function toRecord(row: {
	id: number
	type: string
	filepath: string
	frontmatter: string
	body: string
	updatedAt: Date
}): MdxDocumentRecord {
	return {
		id: row.id,
		type: row.type as ContentType,
		filepath: row.filepath,
		frontmatter: parseFrontmatter(row.frontmatter),
		body: row.body,
		updatedAt: row.updatedAt,
	}
}

export async function upsertMdxDocument(
	type: ContentType,
	filepath: string,
	frontmatter: MdxFrontmatter,
	body: string,
): Promise<MdxDocumentRecord | null> {
	if (!prisma) return null
	const row = await prisma.mdxDocument.upsert({
		where: { filepath },
		update: {
			type,
			frontmatter: JSON.stringify(frontmatter),
			body,
		},
		create: {
			type,
			filepath,
			frontmatter: JSON.stringify(frontmatter),
			body,
		},
	})
	return toRecord(row)
}

export async function deleteMdxDocument(filepath: string): Promise<void> {
	if (!prisma) return
	await prisma.mdxDocument.deleteMany({ where: { filepath } })
}

export async function listMdxDocuments(type: ContentType): Promise<MdxDocumentRecord[]> {
	if (!prisma) return []
	const rows = await prisma.mdxDocument.findMany({
		where: { type },
		orderBy: { updatedAt: 'desc' },
	})
	return rows.map(toRecord)
}

export async function getMdxDocument(filepath: string): Promise<MdxDocumentRecord | null> {
	if (!prisma) return null
	const row = await prisma.mdxDocument.findUnique({ where: { filepath } })
	return row ? toRecord(row) : null
}

export async function getMdxDocumentBySlug(
	type: ContentType,
	slug: string,
): Promise<MdxDocumentRecord | null> {
	const normalized = slug.replace(/^\//, '').replace(/\.mdx$/, '')
	const candidates = [
		normalized,
		normalized.endsWith('.mdx') ? normalized : `${normalized}.mdx`,
	]
	for (const filepath of candidates) {
		const doc = await getMdxDocument(filepath)
		if (doc && doc.type === type) return doc
	}
	const all = await listMdxDocuments(type)
	return (
		all.find((doc) => {
			const docSlug = doc.filepath.replace(/\.mdx$/, '')
			return docSlug === normalized || doc.filepath === normalized
		}) ?? null
	)
}
