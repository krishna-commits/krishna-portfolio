// "use client"
import { notFound } from "next/navigation"
import { allBlogPosts } from "contentlayer/generated"

import { Metadata } from "next"
import { Mdx } from "app/components/mdx-components"
import Breadcrumb from "app/components/breadcrumb/breadcrumb"

interface PostProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params?.slug?.join("/")
  const post = allBlogPosts.find((post) => post.slugAsParams === slug)

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
  return allBlogPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)

  // if (!post) {
  //   notFound()
  // }

  const content = `
  ---
title: '2023 Blog Refresh'
publishedAt: '2023-11-19'
summary: 'Including some of my latest hot takes (okay they are pretty mild).'
---

I updated my blog this weekend and wanted to share some thoughts along the way:

- [Content Management](#content-management)
- [Performance](#performance)
- [Opinions](#opinions)

That's not too bad. So what am I missing? Well, Contentlayer gives you Fast Refresh for your content. That's nice. You can [workaround this](https://github.com/gaearon/overreacted.io/pull/797) or just use , which I might do. Contentlayer has other features, too, but they're unnecessary for my blog.

  
`

  return (
    <div className="prose dark:prose-invert min-w-full">
      <Breadcrumb />
      {/* <h1 className="text-4xl font-bold  dark:text-foreground text-slate-900 ">{post.title}</h1> */}
      {/* {post.description && (
        <p className="text-xl mt-1 text-slate-700 dark:text-slate-200">
          {post.description}
        </p>
      )}
      <div className="mt-4 mb-9" />
      <Mdx code={post.body.code} /> */}

      {/* <CustomMDX source={
        content
      } /> */}
    </div>
  )
}


