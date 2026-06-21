import type { ContentType } from 'app/lib/content-utils'
import { getContentBySlug } from 'lib/mdx-content-resolver'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

const VALID_TYPES = new Set(['blog', 'project', 'research', 'mantra'])

export async function GET(
	_request: Request,
	{ params }: { params: { type: string; slug: string[] } },
) {
	const type = params.type as ContentType
	if (!VALID_TYPES.has(type)) {
		return publicJson({ error: 'Invalid content type' }, 400)
	}

	const slug = params.slug.join('/')
	const post = await getContentBySlug(type, slug)
	if (!post) {
		return publicJson({ error: 'Not found' }, 404)
	}

	return publicJson({ post })
}
