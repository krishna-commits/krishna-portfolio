
import { notFound } from "next/navigation"
import { allMantras } from "contentlayer/generated"

import { Metadata } from "next"
import { Mdx } from "app/components/mdx"

interface PostProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params?.slug?.join("/")
  const post = allMantras.find((post) => post.slugAsParams === slug)
  if (!post) {
    null
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
  return {
    title: post.title,
    description: post.description,
  }
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
  return allMantras.map((post) => ({
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