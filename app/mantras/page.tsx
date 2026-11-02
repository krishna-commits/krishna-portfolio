import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { mantras } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Mantras",
  description:
    "Personal principles and reflections by Krishna Neupane on mind, body, and code: the philosophies behind his approach to research and engineering.",
  path: "/mantras",
});

export default function MantrasPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Mantras", path: "/mantras" }]} />
      <PageHeader
        eyebrow="Mantras"
        title="Mind, body, and code."
        intro="Personal principles, insights, and guiding philosophies that shape my approach to research, engineering, and continuous learning."
      />
      <div className="space-y-6">
        {mantras.map((m) => (
          <Link key={m.slug} href={`/mantras/${m.slug}`} className="card block sm:p-8">
            <h2 className="text-xl font-semibold">{m.title}</h2>
            <p className="muted mt-2 italic">{m.description}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {m.chapters.map((c) => (
                <li key={c.title}>
                  <span className="font-medium">{c.title}</span>
                  {c.lessons && (
                    <ul className="muted mt-1 list-disc space-y-0.5 pl-5">
                      {c.lessons.map((l) => <li key={l}>{l}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </>
  );
}
