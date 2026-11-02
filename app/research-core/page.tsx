import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { ResearchBrowser } from "@/components/research-browser";
import { research, researchStart, socials } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Research Core: Applied Security & Platform Research",
  description:
    "Research Core by Krishna Neupane: applied research notes on DevSecOps, Kubernetes security, zero trust, supply chain security, infrastructure as code, and reliability engineering.",
  path: "/research-core",
});

export default function ResearchCorePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Research Core", path: "/research-core" }]} />
      <PageHeader
        eyebrow="Research Core"
        title="Applied security & platform research."
        intro="Engineering research notes organized into tracks, chapters, and hands-on technical documentation. These are practitioner notes, not peer-reviewed journal publications."
      />

      <section className="mb-16" aria-labelledby="start-here">
        <h2 id="start-here" className="eyebrow accent-ink mb-4">Start here</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {researchStart.map((s) => (
            <Link key={s.title} href={`/research-core/${s.slug}`} className="card block">
              <p className="font-semibold">{s.title}</p>
              <p className="muted mt-2 text-sm">{s.description}</p>
            </Link>
          ))}
        </div>
        <p className="muted mt-4 text-sm">
          Shorter essays are published on{" "}
          <a href={socials.medium} target="_blank" rel="noopener noreferrer" className="link-hover text-[var(--fg)]">Medium ↗</a>.
        </p>
      </section>

      <ResearchBrowser items={research} />
    </>
  );
}
