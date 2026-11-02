import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { research, site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/research-core/[slug]">) {
  const { slug } = await params;
  const item = research.find((r) => r.slug === slug);
  if (!item) return {};
  return pageMeta({
    title: `${item.title} — Research Core`,
    description: item.description,
    path: `/research-core/${item.slug}`,
    type: "article",
    // Keep placeholder pages out of the index until the article body is restored.
    noindex: !item.published,
  });
}

export default async function ResearchItemPage({ params }: PageProps<"/research-core/[slug]">) {
  const { slug } = await params;
  const item = research.find((r) => r.slug === slug);
  if (!item) notFound();

  const related = research.filter((r) => r.pillar === item.pillar && r.slug !== item.slug).slice(0, 4);

  return (
    <article className="max-w-3xl">
      {item.published && (
        <JsonLd
          data={graph({
            "@type": "TechArticle",
            headline: item.title,
            description: item.description,
            url: `${site.url}/research-core/${item.slug}`,
            author: { "@id": PERSON_ID },
            keywords: item.tags?.join(", "),
            articleSection: item.pillar,
            ...(item.year ? { datePublished: String(item.year) } : {}),
          })}
        />
      )}
      <Breadcrumbs items={[{ name: "Research Core", path: "/research-core" }, { name: item.title, path: `/research-core/${item.slug}` }]} />
      <p className="eyebrow muted">
        {item.pillar} · {item.venue}
        {item.year ? ` · ${item.year}` : ""}
      </p>
      <h1 className="h-page mt-3">{item.title}</h1>
      <p className="lede mt-4">{item.description}</p>
      {item.tags && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
      <p className="muted mt-6 text-sm">By <Link href="/about" className="link-hover text-[var(--fg)]">Krishna Neupane</Link></p>

      {/* TODO: restore the original articles for this track, then set `published: true` in lib/data.ts. */}
      <div className="card mt-12 text-sm">Articles in this track are being restored.</div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="eyebrow accent-ink mb-4">More in {item.pillar}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/research-core/${r.slug}`} className="card block p-5">
                  <p className="font-medium">{r.title}</p>
                  <p className="muted mt-1 text-sm">{r.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
