import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/data";
import { domains } from "@/lib/expertise";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Engineering expertise",
  description:
    "Krishna Neupane's engineering domains: DevOps, DevSecOps, cloud engineering, cloud security, platform engineering, and site reliability engineering, each with real work and evidence.",
  path: "/expertise",
});

export default function ExpertisePage() {
  return (
    <>
      <JsonLd
        data={graph({
          "@type": "WebPage",
          "@id": `${site.url}/expertise#page`,
          url: `${site.url}/expertise`,
          name: "Engineering expertise of Krishna Neupane",
          about: { "@id": PERSON_ID },
          hasPart: domains.map((d) => ({ "@type": "WebPageElement", name: d.title, url: `${site.url}/expertise#${d.slug}` })),
        })}
      />
      <Breadcrumbs items={[{ name: "Expertise", path: "/expertise" }]} />
      <PageHeader
        eyebrow="Expertise"
        title="Six disciplines, one system."
        intro="Each discipline below covers what it involves, the problems it addresses, where it shows up in my work, and where you can see the evidence."
      />

      <nav aria-label="Domains" className="mb-16 flex flex-wrap gap-2">
        {domains.map((d) => (
          <a key={d.slug} href={`#${d.slug}`} className="tag px-3 py-1.5 text-[12px] hover:border-[var(--fg)] hover:text-[var(--fg)]">{d.title}</a>
        ))}
      </nav>

      <div className="space-y-28">
        {domains.map((d, i) => (
          <section key={d.slug} id={d.slug} aria-labelledby={`${d.slug}-h`} className="scroll-mt-24" data-reveal>
            <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
              <div className="min-w-0">
                <p className="muted num font-mono text-[11px]">{String(i + 1).padStart(2, "0")} / {String(domains.length).padStart(2, "0")}</p>
                <h2 id={`${d.slug}-h`} className="h-section mt-3">{d.title}</h2>
                <p className="mt-5 max-w-2xl text-xl leading-snug">{d.lede}</p>
                <p className="muted mt-4 max-w-2xl leading-relaxed">{d.why}</p>

                <h3 className="eyebrow accent-ink mt-10 mb-4">Problems it addresses</h3>
                <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {d.problems.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed"><span className="muted shrink-0" aria-hidden>—</span>{p}</li>
                  ))}
                </ul>

                <h3 className="eyebrow accent-ink mt-10 mb-4">In my work</h3>
                <ul className="space-y-3 border-l pl-5">
                  {d.inPractice.map((p) => <li key={p} className="text-[15px] leading-relaxed">{p}</li>)}
                </ul>
              </div>

              <aside className="space-y-8 lg:pt-14">
                <div>
                  <p className="eyebrow muted mb-3">Technologies</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {d.technologies.map((t) => <li key={t} className="tag text-[var(--fg)]">{t}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow muted mb-3">See the evidence</p>
                  <ul className="divide-y border-y">
                    {d.evidence.map((e) => {
                      const external = e.href.startsWith("http");
                      const inner = (
                        <>
                          <span className="muted block font-mono text-[10px] uppercase tracking-wider">{e.kind}</span>
                          <span className="mt-0.5 block text-sm leading-snug group-hover:underline group-hover:underline-offset-4">
                            {e.label}{external ? " ↗" : ""}
                          </span>
                        </>
                      );
                      return (
                        <li key={e.href}>
                          {external ? (
                            <a href={e.href} target="_blank" rel="noopener noreferrer" className="group block py-3">{inner}</a>
                          ) : (
                            <Link href={e.href} className="group block py-3">{inner}</Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>
            </div>
          </section>
        ))}
      </div>

      <section className="card mt-28 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="h-section text-3xl">Need these disciplines on one team?</h2>
          <p className="muted mt-2">That's the role I'm looking for: senior DevSecOps or platform engineering, fully remote, on your team's hours.</p>
        </div>
        <Link href="/contact" className="btn-primary shrink-0">Discuss an opportunity</Link>
      </section>
    </>
  );
}
