import { getDevtoPosts } from "@/lib/devto";
import { getMediumPosts } from "@/lib/medium";
import { getPosts } from "@/lib/posts";

export type WritingItem = {
  title: string;
  href: string;
  isoDate: string;
  source: "Article" | "DEV" | "Medium";
  external: boolean;
  excerpt?: string;
  tags: string[];
};

/** Everything Krishna has written, from this site, DEV, and Medium, newest first. */
export async function getAllWriting(): Promise<WritingItem[]> {
  const [own, devto, medium] = await Promise.all([getPosts(), getDevtoPosts(), getMediumPosts()]);

  const items: WritingItem[] = [
    ...own
      .filter((p) => p.published)
      .map((p) => ({ title: p.title, href: `/blog/${p.slug}`, isoDate: p.date, source: "Article" as const, external: false, excerpt: p.description, tags: p.tags })),
    ...devto.map((p) => ({ title: p.title, href: p.url, isoDate: p.isoDate, source: "DEV" as const, external: true, excerpt: p.description, tags: p.tags })),
    ...medium.map((p) => ({ title: p.title, href: p.link, isoDate: p.isoDate, source: "Medium" as const, external: true, excerpt: p.excerpt, tags: p.categories })),
  ];

  return items.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
