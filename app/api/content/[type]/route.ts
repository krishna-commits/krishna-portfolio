import type { ContentType } from 'app/lib/content-utils'
import { listContent } from 'lib/mdx-content-resolver'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

const VALID_TYPES = new Set(['blog', 'project', 'research', 'mantra'])

export async function GET(
	_request: Request,
	{ params }: { params: { type: string } },
) {
	const type = params.type as ContentType
	if (!VALID_TYPES.has(type)) {
		return publicJson({ error: 'Invalid content type' }, 400)
	}

	const items = await listContent(type)
	return publicJson({ type, items, count: items.length })
}
