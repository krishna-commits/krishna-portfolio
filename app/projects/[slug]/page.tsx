import Image from "next/image";
import Link from "next/link";
import { projectScreenshot } from "@/lib/screenshots";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FlowDiagram } from "@/components/flow-diagram";
import { JsonLd } from "@/components/json-ld";
import { projects, site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({ title: `${p.title}: ${p.tagline}`, description: p.summary, path: `/projects/${p.slug}` });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const eng = p.engineering;
  const shot = projectScreenshot(p.slug);

  return (
    <article>
      <JsonLd
        data={graph({
          "@type": "WebApplication",
          "@id": `${site.url}/projects/${p.slug}#app`,
          name: p.title,
          description: p.summary,
          url: p.href,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          isAccessibleForFree: true,
          keywords: p.tags.join(", "),
          author: { "@id": PERSON_ID },
          creator: { "@id": PERSON_ID },
          mainEntityOfPage: `${site.url}/projects/${p.slug}`,
          ...(eng?.repo ? { codeRepository: eng.repo } : {}),
        })}
      />
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }, { name: p.title, path: `/projects/${p.slug}` }]} />

      <header className="max-w-3xl">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        <h1 className="h-page mt-5">{p.title}</h1>
        <p className="lede mt-4">{p.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn-primary">Open live tool ↗</a>
          {eng?.repo && <a href={eng.repo} target="_blank" rel="noopener noreferrer" className="btn-outline">Source code ↗</a>}
        </div>
      </header>

      {shot && (
        <figure className="mt-12 overflow-hidden rounded-2xl border">
          <div className="flex items-center gap-1.5 border-b bg-[var(--card)] px-4 py-2.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border)]" />
            <span className="muted ml-3 font-mono text-[11px]">{p.href.replace("https://", "")}</span>
          </div>
          <Image src={shot} width={1440} height={900} alt={`Screenshot of ${p.title}`} sizes="(min-width: 1152px) 1100px, 100vw" priority className="w-full" />
        </figure>
      )}

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl space-y-12">
          <Section title="Overview"><p>{p.summary}</p></Section>
          <Section title="The problem"><p>{p.problem}</p></Section>
          <Section title="Who it's for"><p>{p.audience}</p></Section>
          {eng?.architecture && <Section title="Architecture"><p>{eng.architecture}</p></Section>}
          {eng?.diagram && <FlowDiagram {...eng.diagram} />}
          {eng?.security && <Section title="Security considerations"><p>{eng.security}</p></Section>}
          {eng?.decisions && eng.decisions.length > 0 && (
            <Section title="Engineering decisions">
              <ul className="list-disc space-y-2 pl-5">{eng.decisions.map((d) => <li key={d}>{d}</li>)}</ul>
            </Section>
          )}
          {eng?.outcomes && eng.outcomes.length > 0 && (
            <Section title="Outcomes">
              <ul className="list-disc space-y-2 pl-5">{eng.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </Section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card">
            <p className="eyebrow muted">What it does</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="accent-ink">▸</span>{f}</li>
              ))}
            </ul>
          </div>
          {eng?.stack && eng.stack.length > 0 && (
            <div className="card">
              <p className="eyebrow muted">Built with</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {eng.stack.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          )}
          <p className="muted text-sm">
            Built by <Link href="/about" className="link-hover text-[var(--fg)]">Krishna Neupane</Link>.
          </p>
        </aside>
      </div>

      <Link href={`/projects/${next.slug}`} className="card spotlight group mt-20 flex items-center justify-between">
        <div>
          <p className="eyebrow muted">Next project</p>
          <p className="mt-1 text-lg font-semibold">{next.title}</p>
        </div>
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </Link>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow accent-ink mb-3">{title}</h2>
      <div className="text-[17px] leading-8">{children}</div>
    </section>
  );
}
