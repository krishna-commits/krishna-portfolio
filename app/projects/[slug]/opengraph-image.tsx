import { projects } from "@/lib/data";
import { ogCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project by Krishna Neupane";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return ogCard({
    eyebrow: p ? `Project · ${p.tags[0]}` : "Project",
    title: p?.tagline ?? "Projects",
    footer: p?.title ?? "krishnaneupane.com",
  });
}
