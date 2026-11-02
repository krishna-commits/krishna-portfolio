import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FlowDiagram } from "@/components/flow-diagram";
import { JsonLd } from "@/components/json-ld";
import { architectures } from "@/lib/architectures";
import { site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return architectures.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/architecture/[id]">) {
  const { id } = await params;
  const a = architectures.find((x) => x.id === id);
  if (!a) return {};
  return pageMeta({ title: `${a.title}: reference architecture`, description: a.summary, path: `/architecture/${a.id}`, type: "article" });
}

export default async function ArchitecturePage({ params }: PageProps<"/architecture/[id]">) {
  const { id } = await params;
  const index = architectures.findIndex((x) => x.id === id);
  if (index === -1) notFound();
  const a = architectures[index];
  const next = architectures[(index + 1) % architectures.length];

  return (
    <article>
      <JsonLd
        data={graph({
          "@type": "TechArticle",
          headline: `${a.title}: reference architecture`,
          description: a.summary,
          url: `${site.url}/architecture/${a.id}`,
          author: { "@id": PERSON_ID },
          about: a.stages.flatMap((s) => s.items).join(", "),
        })}
      />
      <Breadcrumbs items={[{ name: "Architecture lab", path: "/#architecture" }, { name: a.tab, path: `/architecture/${a.id}` }]} />
      <header className="max-w-3xl">
        <p className="eyebrow accent-ink">Reference architecture</p>
        <h1 className="h-page mt-3">{a.title}</h1>
        <p className="lede mt-4">{a.summary}</p>
        {a.repo && (
          <a href={a.repo} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6">Reference implementation on GitHub ↗</a>
        )}
      </header>

      <FlowDiagram title={a.title} stages={a.stages} planes={a.planes} caption="A generalized pattern from my platform work; exact tools vary by environment." />

      <section className="mt-4" aria-labelledby="decisions">
        <h2 id="decisions" className="eyebrow accent-ink mb-4">Design decisions</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {a.decisions.map((d, i) => (
            <li key={d} className="card">
              <p className="muted font-mono text-[10px]">DECISION {i + 1}</p>
              <p className="mt-2 leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="components">
        <h2 id="components" className="eyebrow accent-ink mb-4">Components</h2>
        <dl className="divide-y border-y">
          {a.stages.map((s) => (
            <div key={s.label} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
              <dt className="font-medium">{s.label}</dt>
              <dd className="muted font-mono text-sm">{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        <Link href={`/architecture/${next.id}`} className="card spotlight group flex items-center justify-between">
          <span>
            <span className="eyebrow muted block text-[10px]">Next architecture</span>
            <span className="mt-1 block text-lg font-semibold">{next.title}</span>
          </span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </Link>
        <Link href="/contact" className="card spotlight group flex items-center justify-between">
          <span>
            <span className="eyebrow muted block text-[10px]">Building something similar?</span>
            <span className="mt-1 block text-lg font-semibold">Let&apos;s talk</span>
          </span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
