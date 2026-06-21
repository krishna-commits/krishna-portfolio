import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { listMDXFiles, readMDXFile, type ContentType } from 'app/lib/content-utils'
import { upsertMdxDocument } from 'lib/mdx-document-store'

export const dynamic = 'force-dynamic'

/** Import all filesystem MDX files into the database (one-time or after deploy). */
export async function POST(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json().catch(() => ({}))
		const types = (body.types as ContentType[] | undefined) ?? [
			'blog',
			'project',
			'research',
			'mantra',
		]

		let imported = 0
		const errors: string[] = []

		for (const type of types) {
			const files = await listMDXFiles(type)
			for (const filepath of files) {
				try {
					const { frontmatter, body: mdxBody } = await readMDXFile(type, filepath)
					await upsertMdxDocument(type, filepath, frontmatter, mdxBody)
					imported += 1
				} catch (err) {
					errors.push(`${type}/${filepath}: ${err instanceof Error ? err.message : 'failed'}`)
				}
			}
		}

		return NextResponse.json(
			{
				message: `Imported ${imported} documents`,
				imported,
				errors: errors.slice(0, 20),
			},
			{ status: 200 },
		)
	} catch (error: unknown) {
		console.error('[Content Migrate API]', error)
		return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
	}
}
