import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { mantras } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return mantras.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/mantras/[slug]">) {
  const { slug } = await params;
  const m = mantras.find((x) => x.slug === slug);
  if (!m) return {};
  // noindex until chapter text is restored.
  return pageMeta({ title: m.title, description: m.description, path: `/mantras/${m.slug}`, type: "article", noindex: true });
}

export default async function MantraPage({ params }: PageProps<"/mantras/[slug]">) {
  const { slug } = await params;
  const mantra = mantras.find((m) => m.slug === slug);
  if (!mantra) notFound();

  return (
    <article className="max-w-3xl">
      <Breadcrumbs items={[{ name: "Mantras", path: "/mantras" }, { name: mantra.title, path: `/mantras/${mantra.slug}` }]} />
      <h1 className="h-page">{mantra.title}</h1>
      <p className="lede mt-4 italic">{mantra.description}</p>
      <div className="mt-12 space-y-6">
        {mantra.chapters.map((c) => (
          <section key={c.title} className="card">
            <h2 className="font-semibold">{c.title}</h2>
            {c.lessons && (
              <ul className="muted mt-2 list-disc space-y-1 pl-5 text-sm">
                {c.lessons.map((l) => <li key={l}>{l}</li>)}
              </ul>
            )}
            {/* TODO: restore chapter text. */}
          </section>
        ))}
      </div>
    </article>
  );
}
