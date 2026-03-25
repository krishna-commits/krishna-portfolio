import { notFound } from "next/navigation"
import { allResearchCores } from "contentlayer/generated"

import { Metadata } from "next"
import { Mdx } from "app/components/mdx"
import { generateResearchArticleMetadata } from "app/metadata"

interface PostProps {
  params: {
    slug: string[]
  }
}

function publishedTimeIso(date: unknown): string | undefined {
  if (date == null) return undefined
  if (typeof date === "string") return date
  return undefined
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params?.slug?.join("/")
  const post = allResearchCores.find((post) => post.slugAsParams === slug)
  if (!post) {
    return null
  }
  return post
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(params)
  if (!post) {
    return {}
  }
  return generateResearchArticleMetadata({
    title: post.title,
    description: post.description,
    path: post.url,
    publishedTime: publishedTimeIso(post.date),
    keywords: post.keywords,
  })
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
  return allResearchCores.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)
  if (!post) {
    notFound()
  }
  return (
    <div className="mx-auto max-w-5xl">
    <article className="py-6 prose dark:prose-invert max-w-6xl mb-10">
      <h1 className="mb-2">{post.title}</h1>
      {post.date && (
        <p className="text-sm not-prose text-slate-500 dark:text-slate-400 mt-1 mb-0">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {post.description && (
        <p className="text-xl mt-0 text-slate-700 dark:text-slate-200">
          {post.description}
        </p>
      )}
      <hr className="my-4" />
      <Mdx code={post.body.code} />
    </article>
    </div>
  )
}