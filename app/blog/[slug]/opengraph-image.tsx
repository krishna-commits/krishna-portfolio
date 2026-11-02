import { ogCard, ogSize } from "@/lib/og";
import { getPost } from "@/lib/posts";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article by Krishna Neupane";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogCard({
    eyebrow: post?.tags[0] ?? "Writing",
    title: post?.title ?? "Writing",
    footer: post ? `${post.readingMinutes} min read · krishnaneupane.com` : "krishnaneupane.com",
  });
}
