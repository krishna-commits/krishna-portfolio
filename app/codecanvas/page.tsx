import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { pageMeta } from "@/lib/seo";

// noindex until the content is rebuilt; an empty page is thin content.
export const metadata = pageMeta({
  title: "Code Canvas",
  description: "Experiments, snippets, and visual sketches in code by Krishna Neupane.",
  path: "/codecanvas",
  noindex: true,
});

// TODO: the live page renders its content client-side and couldn't be recovered. Rebuild it here.
export default function CodeCanvasPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Code Canvas", path: "/codecanvas" }]} />
      <PageHeader eyebrow="Code Canvas" title="Experiments in code." intro="Snippets, sketches, and small experiments." />
      <div className="card text-sm">Coming back soon.</div>
    </>
  );
}
