import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompanyName } from "@/components/company-name";
import { FlowDiagram } from "@/components/flow-diagram";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RepoList } from "@/components/repo-list";
import { TechExperience } from "@/components/tech-experience";
import { Testimonials } from "@/components/testimonials";
import {
  capabilities,
  certifications,
  currentRole,
  education,
  experience,
  faq,
  formatMonth,
  formatRange,
  profile,
  referenceArchitecture,
  site,
  socials,
  techStack,
  theses,
  volunteering,
} from "@/lib/data";
import { PERSON_ID, WEBSITE_ID, graph, pageMeta, thesesJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Krishna Neupane",
  description:
    "Krishna Neupane, Senior DevSecOps Engineer at Parkcity Technologies, previously at BeyondID (Okta Apex Partner): experience, research, education, certifications, and technology stack.",
  path: "/about",
  type: "profile",
});
export const revalidate = 3600;

const sections = [
  { id: "bio", label: "Biography" },
  { id: "experience", label: "Experience" },
  { id: "architecture", label: "Architecture" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "depth", label: "Depth" },
  { id: "stack", label: "Stack" },
  { id: "open-source", label: "Open source" },
  { id: "faq", label: "Quick facts" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "ProfilePage",
            "@id": `${site.url}/about#profilepage`,
            url: `${site.url}/about`,
            name: "About Krishna Neupane",
            isPartOf: { "@id": WEBSITE_ID },
            mainEntity: { "@id": PERSON_ID },
          },
          thesesJsonLd(),
          {
            "@type": "FAQPage",
            "@id": `${site.url}/about#faq`,
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        )}
      />
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader eyebrow="About" title="Krishna Neupane" intro={profile.positioning} />
        <Image
          src={profile.photo.src}
          width={160}
          height={160}
          alt={profile.photo.alt}
          priority
          className="h-28 w-28 shrink-0 rounded-2xl border object-cover sm:h-40 sm:w-40 rule"
        />
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-24">
          <section id="bio" aria-labelledby="bio-h" className="scroll-mt-24" data-reveal>
            <h2 id="bio-h" className="h-section mb-6">Biography</h2>
            <div className="prose-body max-w-2xl text-[17px] leading-8">
              {profile.bio.map((p) => <p key={p}>{p}</p>)}
            </div>
            <dl className="mt-12 grid gap-6 sm:grid-cols-2">
              {capabilities.map((c) => (
                <div key={c.title} className="border-t pt-4 rule">
                  <dt className="font-semibold">{c.title}</dt>
                  <dd className="muted mt-2 text-sm leading-relaxed">{c.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="experience" aria-labelledby="experience-h" className="scroll-mt-24" data-reveal>
            <h2 id="experience-h" className="h-section mb-10">Experience</h2>
            <ol className="relative space-y-14 border-l pl-8 rule">
              {experience.map((role, i) => (
                <li key={role.company + role.start} className="relative">
                  <span
                    aria-hidden
                    className={`absolute top-1.5 -left-[38px] h-3 w-3 rounded-full border-2 ${i === 0 ? "signal-pulse bg-[var(--accent)]" : "bg-[var(--bg)]"}`}
                    style={{ borderColor: "var(--accent)" }}
                  />
                  <p className="eyebrow muted num">{formatRange(role.start, role.end)}{role.location ? ` · ${role.location}` : ""}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{role.title}</h3>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1 font-medium">
                    <CompanyName role={role} />
                    {role.context && <span className="muted font-normal"> · {role.context}</span>}
                  </p>
                  <p className="muted mt-3 max-w-2xl">{role.summary}</p>
                  <ul className="mt-4 max-w-2xl space-y-2 text-[15px] leading-relaxed">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5"><span className="accent-ink mt-0.5 shrink-0" aria-hidden>▸</span>{h}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {role.stack.map((s) => <span key={s} className="tag">{s}</span>)}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="architecture" aria-labelledby="architecture-h" className="scroll-mt-24" data-reveal>
            <h2 id="architecture-h" className="h-section mb-2">How I design platforms</h2>
            <p className="muted max-w-2xl">Source to runtime, with security and resilience as planes that cut across every stage rather than steps at the end.</p>
            <FlowDiagram {...referenceArchitecture} />
          </section>

          <section id="research" aria-labelledby="research-h" className="scroll-mt-24" data-reveal>
            <h2 id="research-h" className="h-section mb-6">Research</h2>
            <div className="space-y-4">
              {theses.map((t) => (
                <article key={t.slug} id={t.slug} className="card spotlight scroll-mt-24">
                  <p className="eyebrow muted num">{t.year} · {t.degree}</p>
                  <h3 className="mt-2 text-lg font-semibold">{t.title}</h3>
                  <p className="muted mt-1 text-sm">{t.institution}</p>
                </article>
              ))}
            </div>
            <p className="muted mt-4 text-sm">
              Ongoing applied notes are published in <Link href="/research-core" className="link-hover text-[var(--fg)]">Research Core</Link> and{" "}
              <Link href="/blog" className="link-hover text-[var(--fg)]">Writing</Link>.
            </p>
          </section>

          <section id="education" aria-labelledby="education-h" className="scroll-mt-24" data-reveal>
            <h2 id="education-h" className="h-section mb-6">Education</h2>
            <ul className="divide-y rule border-y">
              {education.map((e) => (
                <li key={e.degree} className="flex flex-col gap-1 py-5 sm:flex-row sm:justify-between sm:gap-6">
                  <div>
                    <p className="font-medium">{e.degree}</p>
                    <p className="muted text-sm">{e.awardedBy}, delivered through {e.school}</p>
                  </div>
                  <span className="muted num shrink-0 text-sm">{formatMonth(e.date)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="certifications" aria-labelledby="certifications-h" className="scroll-mt-24" data-reveal>
            <h2 id="certifications-h" className="h-section mb-6">Courses & certifications</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.name} className={`card p-5 ${c.featured ? "border-[var(--accent)]" : ""}`}>
                  {c.featured && <p className="eyebrow accent-ink mb-2">Certification</p>}
                  <p className="font-medium leading-snug">{c.name}</p>
                  <p className="muted mt-1 text-sm">{[c.issuer, formatMonth(c.date)].filter(Boolean).join(" · ")}</p>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="tag mt-3 gap-1 border-[var(--accent)] accent-ink hover:text-[var(--fg)]">
                      ✓ Verify credential ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section id="depth" aria-labelledby="depth-h" className="scroll-mt-24" data-reveal>
            <h2 id="depth-h" className="h-section mb-2">Depth by technology</h2>
            <p className="muted mb-6 text-sm">Computed from the experience above (years used in production roles), not self-rated.</p>
            <TechExperience />
          </section>

          <section id="stack" aria-labelledby="stack-h" className="scroll-mt-24" data-reveal>
            <h2 id="stack-h" className="h-section mb-6">Technology stack</h2>
            <dl className="divide-y rule border-y">
              {Object.entries(techStack).map(([category, tools]) => (
                <div key={category} className="grid gap-2 py-4 sm:grid-cols-[200px_1fr]">
                  <dt className="eyebrow muted pt-1">{category}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {tools.map((t) => <span key={t} className="tag text-[12px] text-[var(--fg)]">{t}</span>)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="open-source" aria-labelledby="open-source-h" className="scroll-mt-24" data-reveal>
            <h2 id="open-source-h" className="h-section mb-2">Open source</h2>
            <p className="muted mb-6 text-sm">Recently pushed public repositories, live from GitHub.</p>
            <RepoList />
          </section>

          <section id="faq" aria-labelledby="faq-h" className="scroll-mt-24" data-reveal>
            <h2 id="faq-h" className="h-section mb-6">Quick facts</h2>
            <div className="divide-y rule border-y">
              {faq.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <span className="muted transition-transform group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="muted mt-3 max-w-2xl leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <Testimonials />

          <section aria-labelledby="community" data-reveal>
            <h2 id="community" className="h-section mb-6">Community</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {volunteering.map((v) => (
                <li key={v.org} className="card p-5">
                  <p className="font-medium">{v.org}</p>
                  <p className="muted mt-1 text-sm">{v.role}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block lg:self-start">
          <nav aria-label="On this page">
            <p className="eyebrow muted mb-3">On this page</p>
            <ul className="space-y-2 border-l pl-4 text-sm rule">
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="muted hover:text-[var(--fg)]">{s.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="card">
            <p className="eyebrow muted">At a glance</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="muted">Current role</dt><dd className="font-medium">{currentRole.title}, {currentRole.company}</dd></div>
              <div><dt className="muted">Experience</dt><dd className="font-medium">{profile.yearsExperience} years</dd></div>
              <div><dt className="muted">Based in</dt><dd className="font-medium">{site.location.city}, {site.location.country}</dd></div>
              <div><dt className="muted">Languages</dt><dd className="font-medium">{profile.languages.join(", ")}</dd></div>
            </dl>
            <div className="mt-6 grid gap-2">
              <a href={socials.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">Book a call ↗</a>
              <Link href="/contact" className="btn-outline justify-center">Contact</Link>
              <Link href="/contact?topic=resume#send-a-message" className="btn-outline justify-center">Request resume</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow muted mb-3">Verified profiles</p>
            <ul className="space-y-2 text-sm">
              {[
                ["LinkedIn", socials.linkedin],
                ["GitHub", socials.github],
                ["ORCID", socials.orcid],
                ["ResearchGate", socials.researchgate],
                ["Medium", socials.medium],
              ].map(([label, href]) => (
                <li key={label}><a href={href} target="_blank" rel="me noopener noreferrer" className="link-hover">{label} ↗</a></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
