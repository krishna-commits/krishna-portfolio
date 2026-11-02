import fs from "node:fs";
import path from "node:path";

// Articles live in content/posts/<slug>.mdx and declare `export const metadata = {...}`.
const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  tags: string[];
  // Drafts render in `next dev` only: they are hidden, unlinked, and unindexed in production.
  published: boolean;
};

export type Post = PostMeta & { slug: string; readingMinutes: number };

const showDrafts = process.env.NODE_ENV === "development";

export function getPostSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!getPostSlugs().includes(slug)) return null;
  const { metadata } = (await import(`@/content/posts/${slug}.mdx`)) as { metadata: PostMeta };
  if (!metadata.published && !showDrafts) return null;
  const words = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8").split(/\s+/).length;
  return { ...metadata, slug, readingMinutes: Math.max(1, Math.round(words / 220)) };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(getPostSlugs().map(getPost));
  return posts.filter((p): p is Post => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
