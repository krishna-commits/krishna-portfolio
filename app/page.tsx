import Link from "next/link";
import { ImpactChips } from "@/components/impact-chips";
import { JsonLd } from "@/components/json-ld";
import { getCaseStudies } from "@/lib/case-studies";
import { experience, formatRange, principles, profile, projects, proof, publications, site } from "@/lib/data";
import { getStars } from "@/lib/github";
import { PERSON_ID, WEBSITE_ID, graph, pageMeta } from "@/lib/seo";
import { getAllWriting, shortDate } from "@/lib/writing";

export const metadata = pageMeta({ title: site.title, description: site.description, path: "/", type: "profile" });
export const revalidate = 3600;

// Homepage = evidence first. Five sections: hero, selected work, how I work, experience, writing.
// Interactive explainers live on /lab; the full story on /about and /expertise.
export default async function HomePage() {
  const repoUrls = projects.flatMap((p) => (p.engineering?.repo ? [p.engineering.repo] : []));
  const [writing, caseStudies, stars] = await Promise.all([getAllWriting(), getCaseStudies(), getStars(repoUrls)]);
  const featuredPub = publications.find((p) => p.featured);
  const latestWriting = writing.filter((w) => w.href !== featuredPub?.href).slice(0, 4);
  const recent = experience.slice(0, 2);
  const earlier = experience.slice(2);

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "ProfilePage",
          "@id": `${site.url}/#profilepage`,
          url: site.url,
          name: site.title,
          isPartOf: { "@id": WEBSITE_ID },
          mainEntity: { "@id": PERSON_ID },
        })}
      />

      {/* ───────── Hero ───────── */}
      <section className="grid gap-14 pt-4 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:pt-10">
        <div>
          <p className="rise muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="h-1.5 w-1.5 rounded-full signal-pulse" style={{ background: "var(--ok)" }} aria-hidden />
            <span>Senior DevSecOps Engineer · Kathmandu · open to remote &amp; relocation</span>
          </p>
          <h1 className="rise rise-1 display mt-7 text-[clamp(3.4rem,11vw,7.5rem)] leading-[0.95]">Krishna Neupane</h1>
          <p className="rise rise-2 display mt-7 max-w-2xl text-[clamp(1.6rem,3.2vw,2.35rem)] leading-[1.15]">
            I build cloud platforms where the secure path is also <em className="accent-ink">the fastest one.</em>
          </p>
          <p className="rise rise-3 muted mt-6 max-w-xl text-lg leading-relaxed">{profile.positioning}</p>
          <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/contact" className="btn-primary px-6 py-3 text-[15px]">Discuss an opportunity</Link>
            <a href="#work" className="text-[15px] font-medium link-hover">Read the case studies →</a>
            <Link href="/resume" className="muted text-[15px] hover:text-[var(--fg)]">Resume</Link>
          </div>
        </div>

        {/* Evidence, not illustration: real numbers, each traceable. */}
        <aside className="rise rise-3 border-t lg:border-t-0 lg:border-l lg:pl-10" aria-label="At a glance">
          <dl className="divide-y">
            {proof.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-6 py-3.5">
                <dt className="muted text-sm">{p.label}</dt>
                <dd className="display num text-3xl">{p.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/verify" className="muted mt-4 inline-flex items-center gap-2 font-mono text-[11px] hover:text-[var(--fg)]">
            <span style={{ color: "var(--ok)" }} aria-hidden>✓</span> this site is signed — verify it yourself →
          </Link>
        </aside>
      </section>

      {/* ───────── 01 Selected work ───────── */}
      <section id="work" className="mt-32 scroll-mt-24" aria-labelledby="work-h" data-reveal>
        <SectionHead n="01" label="Selected work" id="work-h" title="Real problems, and how they were solved." link={{ href: "/case-studies", label: "All case studies" }} />
        <ol className="border-t">
          {caseStudies.map((c, i) => (
            <li key={c.slug} className="border-b">
              <Link href={`/case-studies/${c.slug}`} className="group grid gap-6 py-10 lg:grid-cols-[80px_1fr_280px]">
                <span className="display num text-4xl accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="muted font-mono text-[11px] tracking-wider uppercase">{c.context}</p>
                  <h3 className="display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.12] text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px]">
                    {c.title}
                  </h3>
                  <p className="muted mt-4 max-w-2xl leading-relaxed">{c.summary}</p>
                </div>
                <div className="lg:pt-8">
                  <ul className="space-y-2 text-sm">
                    {c.outcomes.slice(0, 3).map((o) => (
                      <li key={o} className="flex gap-2.5"><span className="accent-ink" aria-hidden>—</span>{o}</li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm font-medium">Read the case study <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span></p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow muted">Tools I&apos;ve built</p>
            <p className="muted mt-3 text-sm leading-relaxed">Free, live tools for engineers. Uptime is checked on the <Link href="/status" className="link-hover text-[var(--fg)]">status page</Link>.</p>
          </div>
          <ul className="divide-y border-y">
            {projects.map((p) => {
              const star = p.engineering?.repo ? stars[p.engineering.repo.toLowerCase()] : 0;
              return (
                <li key={p.slug} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                  <Link href={`/projects/${p.slug}`} className="group min-w-0 flex-1">
                    <span className="font-medium group-hover:underline group-hover:underline-offset-4">{p.title}</span>
                    <span className="muted text-sm"> — {p.tagline}</span>
                  </Link>
                  <span className="flex shrink-0 gap-4 font-mono text-[11px]">
                    {star > 0 && <span className="muted">★ {star}</span>}
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="muted hover:text-[var(--fg)]">live ↗</a>
                    {p.engineering?.repo && <a href={p.engineering.repo} target="_blank" rel="noopener noreferrer" className="muted hover:text-[var(--fg)]">source ↗</a>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────── 02 How I work ───────── */}
      <section className="mt-32" aria-labelledby="principles" data-reveal>
        <SectionHead n="02" label="How I work" id="principles" title="Six principles behind every system I build." link={{ href: "/lab", label: "See them in the lab" }} />
        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t pt-5">
              <p className="muted num font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-2 text-2xl">{p.title}</h3>
              <p className="muted mt-2 text-[15px] leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
        <p className="muted mt-12 max-w-2xl text-[15px] leading-relaxed">
          This site follows the same rules: a signed SBOM, documented <Link href="/decisions" className="link-hover text-[var(--fg)]">architecture decisions</Link>, and a published{" "}
          <Link href="/threat-model" className="link-hover text-[var(--fg)]">threat model</Link>. <Link href="/verify" className="link-hover accent-ink">Verify it →</Link>
        </p>
      </section>

      {/* ───────── 03 Experience ───────── */}
      <section className="mt-32" aria-labelledby="experience" data-reveal>
        <SectionHead n="03" label="Experience" id="experience" title="Nine years in production infrastructure." link={{ href: "/about#experience", label: "Full experience" }} />
        <ol className="border-t">
          {recent.map((role) => (
            <li key={role.start} className="grid gap-6 border-b py-10 lg:grid-cols-[240px_1fr]">
              <div>
                <p className="muted num font-mono text-[11px]">{formatRange(role.start, role.end)}</p>
                <p className="display mt-2 text-2xl">{role.company}</p>
                {role.context && <p className="muted text-sm">{role.context}</p>}
                <p className="accent-ink mt-2 text-sm">{role.title}</p>
              </div>
              <div>
                <ImpactChips role={role} />
                <ul className={`space-y-2 text-[15px] leading-relaxed ${role.impact?.length ? "mt-5" : ""}`}>
                  {role.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2.5"><span className="muted shrink-0" aria-hidden>—</span>{h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        {earlier.length > 0 && (
          <p className="muted mt-6 text-sm">
            Earlier: {earlier.map((r) => `${r.title} at a ${r.context?.toLowerCase() ?? "company"} (${r.start.slice(0, 4)}–${r.end?.slice(0, 4) ?? "now"})`).join("; ")}.
          </p>
        )}
      </section>

      {/* ───────── 04 Writing ───────── */}
      <section className="mt-32" aria-labelledby="writing" data-reveal>
        <SectionHead n="04" label="Writing" id="writing" title="Field notes from production." link={{ href: "/blog", label: "All writing" }} />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {featuredPub && (
            <a href={featuredPub.href} target="_blank" rel="noopener noreferrer" className="group block border-t pt-6">
              <p className="accent-ink font-mono text-[11px] tracking-wider uppercase">Featured · {featuredPub.domain}</p>
              <h3 className="display mt-3 text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.12] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px]">
                {featuredPub.title}
              </h3>
              <p className="muted mt-4 leading-relaxed">{featuredPub.summary}</p>
              <p className="mt-5 text-sm font-medium">Read on Medium ↗</p>
            </a>
          )}
          <ul className="divide-y border-y">
            {latestWriting.map((w) => (
              <li key={w.href}>
                <a href={w.href} {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block py-4">
                  <span className="muted font-mono text-[10px]">
                    <span className="accent-ink">{w.source}</span> · <time dateTime={w.isoDate}>{shortDate(w.isoDate)}</time>
                  </span>
                  <span className="mt-1 block leading-snug group-hover:underline group-hover:underline-offset-4">{w.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SectionHead({ n, label, id, title, link }: { n: string; label: string; id: string; title: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow flex items-center gap-3 text-[11px]">
          <span className="accent-ink">{n}</span>
          <span className="h-px w-6 bg-[var(--border)]" aria-hidden />
          <span className="muted">{label}</span>
        </p>
        <h2 id={id} className="h-section mt-4 max-w-3xl text-balance">{title}</h2>
      </div>
      {link && <Link href={link.href} className="muted shrink-0 text-sm link-hover">{link.label} →</Link>}
    </div>
  );
}
