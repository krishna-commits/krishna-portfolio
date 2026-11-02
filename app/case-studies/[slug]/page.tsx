import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getCaseStudies, getCaseStudy } from "@/lib/case-studies";
import { site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) return {};
  return pageMeta({ title: c.title, description: c.summary, path: `/case-studies/${slug}`, type: "article", noindex: !c.published });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const c = await getCaseStudy(slug);
  if (!c) notFound();
  const { default: Content } = await import(`@/content/case-studies/${slug}.mdx`);
  const url = `${site.url}/case-studies/${slug}`;

  return (
    <article>
      {c.published && (
        <JsonLd
          data={graph({
            "@type": "TechArticle",
            headline: c.title,
            description: c.summary,
            url,
            datePublished: c.date,
            keywords: c.stack.join(", "),
            author: { "@id": PERSON_ID },
          })}
        />
      )}
      <Breadcrumbs items={[{ name: "Case studies", path: "/case-studies" }, { name: c.title, path: `/case-studies/${slug}` }]} />

      <header className="max-w-3xl">
        <p className="eyebrow muted">{c.context}</p>
        <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">{c.title}</h1>
        <p className="lede mt-5">{c.summary}</p>
      </header>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-[var(--border)] sm:grid-cols-3 rule">
        <Fact label="Role" value={c.role} />
        <Fact label="Period" value={c.period} />
        <Fact label="Stack" value={c.stack.join(" · ")} />
      </dl>

      {c.outcomes.length > 0 && (
        <section className="card mt-4" aria-label="Outcomes">
          <p className="eyebrow accent-ink">Outcomes</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {c.outcomes.map((o) => (
              <li key={o} className="flex gap-2"><span className="accent-ink" aria-hidden>▸</span>{o}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="prose-article mt-14 max-w-3xl">
        <Content />
      </div>

      <div className="card mt-16 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">Facing a similar platform problem?</p>
        <Link href="/contact" className="btn-primary shrink-0">Let&apos;s talk</Link>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--card)] p-5">
      <dt className="eyebrow muted">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
