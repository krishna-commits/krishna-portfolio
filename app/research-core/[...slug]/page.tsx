import { notFound } from 'next/navigation'
import { allResearchCores } from 'contentlayer/generated'
import { Metadata } from 'next'
import { Mdx } from 'app/components/mdx'
import { MdxHtmlBody } from 'app/components/mdx-html'
import { generateResearchArticleMetadata } from 'app/metadata'
import { getContentBySlug } from 'lib/mdx-content-resolver'

export const dynamic = 'force-dynamic'

interface PostProps {
	params: {
		slug: string[]
	}
}

function publishedTimeIso(date: unknown): string | undefined {
	if (date == null) return undefined
	if (typeof date === 'string') return date
	return undefined
}

async function getPostFromParams(params: PostProps['params']) {
	const slug = params?.slug?.join('/')
	if (!slug) return null

	const resolved = await getContentBySlug('research', slug)
	if (resolved) return resolved

	const clPost = allResearchCores.find((post) => post.slugAsParams === slug)
	if (!clPost) return null

	return {
		slug,
		title: clPost.title,
		description: clPost.description,
		date: clPost.date ? String(clPost.date) : undefined,
		keywords: clPost.keywords,
		renderKind: 'contentlayer' as const,
		bodyCode: clPost.body.code,
		source: 'contentlayer' as const,
		filepath: `${slug}.mdx`,
	}
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
	const post = await getPostFromParams(params)
	if (!post) return {}

	const slug = params.slug.join('/')
	return generateResearchArticleMetadata({
		title: String(post.title),
		description: post.description ? String(post.description) : undefined,
		path: `/research-core/${slug}`,
		publishedTime: publishedTimeIso(post.date),
		keywords: Array.isArray(post.keywords) ? post.keywords.map(String) : undefined,
	})
}

export default async function PostPage({ params }: PostProps) {
	const post = await getPostFromParams(params)
	if (!post) notFound()

	return (
		<div className="mx-auto max-w-5xl">
			<article className="py-6 prose dark:prose-invert max-w-6xl mb-10">
				<h1 className="mb-2">{post.title}</h1>
				{post.date && (
					<p className="text-sm not-prose text-slate-500 dark:text-slate-400 mt-1 mb-0">
						{new Date(String(post.date)).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				)}
				{post.description && (
					<p className="text-xl mt-0 text-slate-700 dark:text-slate-200">{post.description}</p>
				)}
				<hr className="my-4" />
				{post.renderKind === 'html' && post.bodyHtml ? (
					<MdxHtmlBody html={post.bodyHtml} />
				) : post.bodyCode ? (
					<Mdx code={post.bodyCode} />
				) : null}
			</article>
		</div>
	)
}
