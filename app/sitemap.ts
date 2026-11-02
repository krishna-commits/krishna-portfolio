import type { MetadataRoute } from "next";
import { projects, research, site } from "@/lib/data";
import { architectures } from "@/lib/architectures";
import { getCaseStudies } from "@/lib/case-studies";
import { getPosts } from "@/lib/posts";

// Only indexable pages belong here; placeholder pages and drafts are noindex and left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPosts()).filter((p) => p.published);
  const studies = (await getCaseStudies()).filter((c) => c.published);
  const url = (p: string) => `${site.url}${p === "/" ? "" : p}`;
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly") => ({
    url: url(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/about", 0.9, "monthly"),
    entry("/hire", 0.8, "monthly"),
    entry("/checklists/kubernetes-security", 0.8, "monthly"),
    ...architectures.map((a) => entry(`/architecture/${a.id}`, 0.7, "yearly")),
    ...(studies.length ? [entry("/case-studies", 0.8, "monthly")] : []),
    ...studies.map((c) => entry(`/case-studies/${c.slug}`, 0.8, "yearly")),
    entry("/now", 0.5, "monthly"),
    entry("/uses", 0.5, "monthly"),
    entry("/projects", 0.9, "monthly"),
    ...projects.map((p) => entry(`/projects/${p.slug}`, 0.8, "monthly")),
    entry("/research-core", 0.8, "weekly"),
    ...research.filter((r) => r.published).map((r) => entry(`/research-core/${r.slug}`, 0.7, "monthly")),
    entry("/blog", 0.8, "weekly"),
    ...posts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: new Date(p.updated ?? p.date), changeFrequency: "yearly" as const, priority: 0.8 })),
    entry("/contact", 0.6, "yearly"),
    entry("/colophon", 0.4, "monthly"),
    entry("/status", 0.3, "weekly"),
    entry("/mantras", 0.4, "yearly"),
    entry("/privacy", 0.2, "yearly"),
  ];
}
