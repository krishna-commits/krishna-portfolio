import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Mdx } from 'app/components/mdx'
import { MdxHtmlBody } from 'app/components/mdx-html'
import { generatePageMetadata } from 'app/metadata'
import { getContentBySlug } from 'lib/mdx-content-resolver'

export const dynamic = 'force-dynamic'

interface PostProps {
	params: { slug: string[] }
}

async function getPostFromParams(params: PostProps['params']) {
	const slug = params?.slug?.join('/')
	if (!slug) return null
	return getContentBySlug('blog', slug)
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
	const post = await getPostFromParams(params)
	if (!post) return {}

	return generatePageMetadata({
		title: String(post.title),
		description: post.description ? String(post.description) : undefined,
		path: `/blog/${params.slug.join('/')}`,
		keywords: Array.isArray(post.keywords) ? post.keywords.map(String) : undefined,
	})
}

export default async function BlogPostPage({ params }: PostProps) {
	const post = await getPostFromParams(params)
	if (!post) notFound()

	return (
		<main className="min-h-screen bg-background px-4 py-8 max-w-3xl mx-auto">
			<article className="prose dark:prose-invert max-w-none">
				<h1>{post.title}</h1>
				{post.date && (
					<p className="text-sm text-slate-500 not-prose">
						{new Date(String(post.date)).toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				)}
				{post.description && <p className="lead">{post.description}</p>}
				<hr />
				{post.renderKind === 'html' && post.bodyHtml ? (
					<MdxHtmlBody html={post.bodyHtml} />
				) : post.bodyCode ? (
					<Mdx code={post.bodyCode} />
				) : null}
			</article>
		</main>
	)
}
