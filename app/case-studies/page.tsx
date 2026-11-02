import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { getCaseStudies } from "@/lib/case-studies";
import { pageMeta } from "@/lib/seo";

// Indexed only once at least one case study is published (an empty list is thin content).
export async function generateMetadata() {
  const hasPublished = (await getCaseStudies()).some((c) => c.published);
  return pageMeta({
    title: "Case studies",
    description: "Platform engineering and DevSecOps case studies by Krishna Neupane: architecture, decisions, trade-offs, and results.",
    path: "/case-studies",
    noindex: !hasPublished,
  });
}

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <Breadcrumbs items={[{ name: "Case studies", path: "/case-studies" }]} />
      <PageHeader
        eyebrow="Case studies"
        title="How the work actually went."
        intro="Real platform work, anonymized where needed: the situation, the architecture, the decisions and trade-offs, and what changed."
      />
      {studies.length === 0 ? (
        <div className="card text-sm">
          Case studies are being written. In the meantime, see <Link href="/projects" className="link-hover">projects</Link> or{" "}
          <Link href="/about#experience" className="link-hover">experience</Link>.
        </div>
      ) : (
        <ul className="space-y-4">
          {studies.map((c) => (
            <li key={c.slug}>
              <Link href={`/case-studies/${c.slug}`} className="card spotlight group block sm:p-8">
                <p className="eyebrow muted">
                  {c.context} · {c.period}
                  {!c.published && <span className="tag ml-3 border-[var(--accent)] accent-ink">Draft</span>}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{c.title}</h2>
                <p className="muted mt-3 max-w-3xl">{c.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.stack.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
                <p className="mt-6 text-sm font-medium">Read the case study <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span></p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
