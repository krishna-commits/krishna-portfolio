import Image from "next/image";
import Link from "next/link";
import { ArchitectureLab } from "@/components/architecture-lab";
import { AttackSimulator } from "@/components/attack-simulator";
import { HeroGraph } from "@/components/hero-graph";
import { JsonLd } from "@/components/json-ld";
import { LocalTime } from "@/components/local-time";
import { Pipeline } from "@/components/pipeline";
import { SkillsCluster } from "@/components/skills-cluster";
import { Testimonials } from "@/components/testimonials";
import { architectures } from "@/lib/architectures";
import { getCaseStudies } from "@/lib/case-studies";
import { k8sChecklistCount } from "@/lib/checklist";
import { namespaces, podAge } from "@/lib/cluster";
import {
  certifications,
  education,
  experience,
  formatMonth,
  formatRange,
  pillars,
  principles,
  profile,
  projects,
  proof,
  research,
  site,
  socials,
  theses,
} from "@/lib/data";
import { deploy } from "@/lib/deploy";
import { getStars } from "@/lib/github";
import { projectScreenshot } from "@/lib/screenshots";
import { PERSON_ID, WEBSITE_ID, graph, pageMeta } from "@/lib/seo";
import { getAllWriting, shortDate } from "@/lib/writing";

export const metadata = pageMeta({ title: site.title, description: site.description, path: "/", type: "profile" });
export const revalidate = 3600;

// How the disciplines connect: the "engineering identity" loop.
const identity = [
  { k: "Cloud", v: "The foundation: resilient, Multi-AZ infrastructure across AWS, GCP, and Azure." },
  { k: "Automation", v: "Infrastructure as code and CI/CD make every change repeatable and reviewable." },
  { k: "Security", v: "Controls live inside the automation, so they run on every change, not at the end." },
  { k: "Platform", v: "GitOps and reusable patterns turn all of it into a paved road teams can ship on." },
  { k: "Reliability", v: "Observability and runbooks close the loop: notice fast, recover faster, learn." },
];

export default async function HomePage() {
  const repoUrls = projects.flatMap((p) => (p.engineering?.repo ? [p.engineering.repo] : []));
  const [writing, caseStudies, stars] = await Promise.all([getAllWriting(), getCaseStudies(), getStars(repoUrls)]);
  const shots = Object.fromEntries(projects.map((p) => [p.slug, projectScreenshot(p.slug)]));
  const clusterData = namespaces.map((ns) => ({ ...ns, pods: ns.pods.map((p) => ({ ...p, age: podAge(p) })) }));

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
      <section className="relative -mx-4 -mt-28 overflow-hidden px-4 pt-32 sm:-mx-6 sm:-mt-36 sm:px-6 sm:pt-40 lg:-mx-8 lg:px-8">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" style={{ maskImage: "radial-gradient(ellipse 70% 60% at 40% 35%, black 20%, transparent 80%)" }} />
        <div aria-hidden className="pointer-events-none absolute -top-48 left-[-10%] h-[560px] w-[560px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgb(37 99 235 / 0.22), transparent 65%)" }} />
        <div aria-hidden className="pointer-events-none absolute top-20 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgb(34 211 238 / 0.12), transparent 65%)" }} />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="rise eyebrow muted flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="h-px w-10 bg-[var(--accent-2)]" aria-hidden />
              <span>DevSecOps · Cloud · Platform Engineering</span>
            </p>
            <h1 className="rise rise-1 display mt-8 text-[clamp(3.25rem,10.5vw,8rem)] leading-[0.88] font-extrabold uppercase">
              <span className="block">Krishna</span>
              <span className="block">
                <span className="bg-gradient-to-r from-[var(--fg)] from-25% via-[#60a5fa] to-[var(--accent-2)] bg-clip-text text-transparent">Neupane</span>
                <span className="caret ml-[0.08em] inline-block h-[0.72em] w-[0.32em] bg-[var(--accent-2)] align-[-0.03em]" aria-hidden />
              </span>
            </h1>
            <p className="rise rise-2 mt-9 max-w-xl text-xl leading-snug sm:text-[1.55rem]">
              <span className="muted">Senior DevSecOps Engineer. I design, automate, and secure </span>
              <strong className="font-semibold">cloud-native platforms</strong>
              <span className="muted"> where every path to production is reviewed, gated, and observable.</span>
            </p>
            <div className="rise rise-3 mt-10 flex flex-wrap gap-3">
              <a href="#capabilities" className="btn-primary px-6 py-3 text-[15px]">Explore the engineering <span aria-hidden>↓</span></a>
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3 text-[15px]">GitHub ↗</a>
              <Link href="/contact" className="btn-outline px-6 py-3 text-[15px]">Contact</Link>
            </div>
          </div>
          <div className="rise rise-3 hidden lg:block">
            <HeroGraph />
          </div>
        </div>

        <dl className="rise rise-4 relative mt-16 grid grid-cols-2 border-t sm:grid-cols-4 lg:mt-10">
          <Status label="Status">
            <span className="inline-flex items-center gap-2" style={{ color: "var(--ok)" }}>
              <span className="h-1.5 w-1.5 rounded-full signal-pulse" style={{ background: "var(--ok)" }} aria-hidden />
              open to work
            </span>
          </Status>
          <Status label="Base">{site.location.city} · NP · remote</Status>
          <Status label="Hours">your team&apos;s working day</Status>
          <Status label="Local"><LocalTime seconds bare /></Status>
        </dl>
      </section>

      {/* ───────── Proof ───────── */}
      <section className="mt-16" aria-label="At a glance" data-reveal>
        <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-5">
          {proof.map((p) => {
            const external = p.href.startsWith("http");
            return (
              <li key={p.label} className="border-b sm:border-b-0 sm:border-l sm:first:border-l-0">
                <a
                  href={p.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col bg-[var(--card)] px-5 py-6 transition-colors hover:bg-[var(--accent-soft)]"
                >
                  <span className="num display flex items-start justify-between text-4xl font-bold">
                    {p.value}
                    <span className="eyebrow muted text-[9px] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>source ↗</span>
                  </span>
                  <span className="muted mt-1 text-xs leading-snug sm:text-sm">{p.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="muted mt-3 flex items-center gap-2 font-mono text-[11px]">
          <span style={{ color: "var(--ok)" }} aria-hidden>✓</span> verified · every figure links to its source
        </p>
      </section>

      {/* ───────── 01 Engineering identity ───────── */}
      <section className="mt-28 grid items-start gap-12 lg:grid-cols-[1.05fr_1fr]" aria-labelledby="identity" data-reveal>
        <div>
          <SectionLabel n="01" text="Engineering identity" />
          <h2 id="identity" className="h-section mt-3 text-balance">Infrastructure, automation, and security are one system.</h2>
          <p className="lede mt-5 text-base sm:text-lg">
            Most incidents happen in the seams between teams and tools. My work is closing those seams, so the secure path is also the fastest path to production.
          </p>
          <ol className="mt-8">
            {identity.map((item, i) => (
              <li key={item.k} className="relative flex gap-4 pb-5 last:pb-0">
                {i < identity.length - 1 && <span aria-hidden className="absolute top-7 bottom-0 left-[13px] w-px bg-[var(--border)]" />}
                <span className="accent-ink relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-[var(--bg)] font-mono text-[10px]" style={{ borderColor: "var(--accent-2)" }}>
                  {i + 1}
                </span>
                <span className="pt-0.5">
                  <span className="font-semibold">{item.k}</span>
                  <span className="muted text-sm"> · {item.v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Machine-readable identity card: real facts only. */}
        <figure className="card overflow-hidden p-0 font-mono text-[13px] leading-6 shadow-[0_30px_80px_-40px_rgb(37_99_235/0.55)] lg:mt-12" aria-label="Profile summary">
          <div className="flex items-center gap-1.5 border-b px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-2)]" />
            <span className="muted ml-3 text-xs">~/krishna/identity.yaml</span>
          </div>
          <div className="flex items-center gap-4 border-b px-5 py-4 font-sans">
            <Image
              src={profile.photo.src}
              width={56}
              height={56}
              alt={profile.photo.alt}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--accent-2)] ring-offset-2 ring-offset-[var(--card)]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{site.name}</p>
              <p className="muted truncate text-xs">{profile.jobTitle} · {experience[0].company}</p>
            </div>
            <span className="tag ml-auto shrink-0 gap-1" style={{ borderColor: "var(--ok)", color: "var(--ok)" }}>✓ verified</span>
          </div>
          <pre className="overflow-x-auto p-5">
            <code>
              <Line k="experience" v={`${profile.yearsExperience} years`} />
              <Line k="clouds" v="[aws, gcp, azure, digitalocean, heroku]" raw />
              <Line k="platform" v="[kubernetes, argocd, terraform, vault]" raw />
              <Line k="research" v="continuous threat detection" />
              <Line k="education" v="MSc Applied Security, 2023" />
              <Line k="hours" v="aligned to your team" />
              <span className="block">
                <span className="muted">status:</span> <span style={{ color: "var(--ok)" }}>open_to_work</span>
                <span className="caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[var(--accent-2)]" aria-hidden />
              </span>
            </code>
          </pre>
        </figure>
      </section>

      {/* ───────── 02 Technical capabilities ───────── */}
      <section id="capabilities" className="mt-28 scroll-mt-24" aria-labelledby="capabilities-h" data-reveal>
        <SectionHead n="02" label="Technical capabilities" id="capabilities-h" title="Six domains, one toolkit." link={{ href: "/about#depth", label: "Depth by technology" }} />
        <SkillsCluster namespaces={clusterData} />
      </section>

      {/* ───────── 03 Featured projects ───────── */}
      <section className="mt-28" aria-labelledby="work" data-reveal>
        <SectionHead n="03" label="Featured projects" id="work" title="Tools engineers use in production." link={{ href: "/projects", label: "All projects" }} />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.slug} className={i === 0 ? "md:col-span-2" : ""}>
              <article className="card spotlight flex h-full flex-col overflow-hidden p-0">
                <div className="flex items-center justify-between border-b px-5 py-2.5 font-mono text-[10px]">
                  <span className="muted">
                    release/<span className="text-[var(--fg)]">{p.slug}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    {p.engineering?.repo && stars[p.engineering.repo.toLowerCase()] > 0 && (
                      <span className="muted">★ {stars[p.engineering.repo.toLowerCase()]}</span>
                    )}
                    <span className="flex items-center gap-1.5" style={{ color: "var(--ok)" }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ok)" }} aria-hidden /> live
                    </span>
                  </span>
                </div>
                {shots[p.slug] && (
                  <div className="border-b bg-[var(--bg)] px-4 pt-4">
                    <div className="overflow-hidden rounded-t-lg border border-b-0 shadow-[0_-10px_40px_-20px_rgb(37_99_235/0.5)]">
                      <div className="flex gap-1 border-b bg-[var(--card)] px-3 py-1.5" aria-hidden>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
                      </div>
                      <Image
                        src={shots[p.slug]!}
                        width={1440}
                        height={900}
                        alt={`Screenshot of ${p.title}`}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className={`w-full object-cover object-top ${i === 0 ? "aspect-[16/8]" : "aspect-[16/9]"}`}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className={`font-bold tracking-tight ${i === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>{p.title}</h3>
                  <p className="muted mt-1 text-sm">{p.tagline}</p>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="eyebrow accent-ink text-[10px]">Problem</dt>
                      <dd className="mt-1 leading-relaxed">{p.problem}</dd>
                    </div>
                    {i === 0 && (
                      <div>
                        <dt className="eyebrow accent-ink text-[10px]">Approach</dt>
                        <dd className="mt-1 leading-relaxed">{p.summary}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-4 pt-6 text-sm font-medium">
                    <Link href={`/projects/${p.slug}`} className="link-hover">Case study →</Link>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="muted hover:text-[var(--fg)]">Live ↗</a>
                    {p.engineering?.repo && (
                      <a href={p.engineering.repo} target="_blank" rel="noopener noreferrer" className="muted hover:text-[var(--fg)]">Source ↗</a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── 04 Architecture laboratory ───────── */}
      <section className="mt-28" aria-labelledby="architecture" data-reveal>
        <SectionHead n="04" label="Architecture laboratory" id="architecture" title="Reference architectures, and the decisions behind them." />
        <ArchitectureLab architectures={architectures} />
      </section>

      {/* ───────── 05 Delivery ───────── */}
      <section className="mt-28" aria-labelledby="how-i-ship" data-reveal>
        <SectionHead n="05" label="How I ship · select a stage" id="how-i-ship" title="Every stage from commit to production carries a control." />
        <Pipeline />
        <div className="mt-10">
          <p className="eyebrow muted mb-4">Try to break it</p>
          <AttackSimulator />
        </div>
      </section>

      {/* ───────── 06 Experience ───────── */}
      <section className="mt-28" aria-labelledby="experience" data-reveal>
        <SectionHead n="06" label="Experience" id="experience" title="Where I'm doing the work." link={{ href: "/about#experience", label: "Full experience" }} />
        <ol className="space-y-4">
          {experience.slice(0, 2).map((role, i) => (
            <li key={role.company + role.start} className="card grid gap-6 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="eyebrow muted num text-[10px]">{formatRange(role.start, role.end)}</p>
                <p className="mt-2 text-lg font-bold tracking-tight">{role.company}</p>
                {role.context && <p className="muted text-sm">{role.context}</p>}
                <p className={`mt-2 text-sm font-medium ${i === 0 ? "accent-ink" : ""}`}>{role.title}</p>
              </div>
              <ul className="space-y-2 text-[15px] leading-relaxed">
                {role.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex gap-2.5"><span className="accent-ink mt-0.5 shrink-0" aria-hidden>▸</span>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <p className="eyebrow accent-ink text-[10px]">Education</p>
            <ul className="mt-3 space-y-3">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="font-medium">{e.degree}</p>
                  <p className="muted text-sm">{e.awardedBy} · {formatMonth(e.date)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <p className="eyebrow accent-ink text-[10px]">Certifications</p>
            <ul className="mt-3 space-y-2 text-sm">
              {certifications.slice(0, 5).map((c) => (
                <li key={c.name} className="flex justify-between gap-4">
                  <span>{c.name}</span>
                  <span className="muted shrink-0">{c.date ? formatMonth(c.date) : c.issuer}</span>
                </li>
              ))}
            </ul>
            <Link href="/about#certifications" className="muted mt-4 inline-block text-sm link-hover">All {certifications.length} →</Link>
          </div>
        </div>
      </section>

      {/* ───────── 07 Research & writing ───────── */}
      <section className="mt-28" aria-labelledby="research" data-reveal>
        <SectionHead n="07" label="Research & writing" id="research" title="Applied research, practical writing." link={{ href: "/blog", label: "All writing" }} />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            {theses.map((t) => (
              <article key={t.slug} className="card spotlight">
                <p className="eyebrow muted num text-[10px]">{t.year} · {t.degree.startsWith("MSc") ? "MSc research" : "BSc research"}</p>
                <h3 className="mt-3 text-xl leading-snug font-bold tracking-tight">{t.title}</h3>
                <p className="muted mt-2 text-sm">{t.institution}</p>
              </article>
            ))}
            <Link href="/research-core" className="card spotlight group flex items-center justify-between">
              <span>
                <span className="block font-semibold">Research Core</span>
                <span className="muted text-sm">{research.length} tracks across {pillars.length} pillars</span>
              </span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </Link>
          </div>
          <ul className="card divide-y p-0">
            {writing.slice(0, 4).map((w) => (
              <li key={w.href}>
                <a href={w.href} {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block p-5 transition-colors hover:bg-[var(--accent-soft)]">
                  <span className="muted flex items-center gap-2 font-mono text-[10px]">
                    <span className="accent-ink">{w.source}</span> · <time dateTime={w.isoDate}>{shortDate(w.isoDate)}</time>
                  </span>
                  <span className="mt-1.5 block leading-snug font-semibold group-hover:underline group-hover:underline-offset-4">{w.title}</span>
                </a>
              </li>
            ))}
            {writing.length === 0 && <li className="muted p-5 text-sm">Articles are on the way.</li>}
          </ul>
        </div>
      </section>

      {/* Case studies (only once published) */}
      {caseStudies.length > 0 && (
        <section className="mt-28" aria-labelledby="case-studies" data-reveal>
          <SectionHead n="08" label="Case studies" id="case-studies" title="How the work actually went." link={{ href: "/case-studies", label: "All case studies" }} />
          <ul className="grid gap-4 md:grid-cols-2">
            {caseStudies.slice(0, 2).map((c) => (
              <li key={c.slug}>
                <Link href={`/case-studies/${c.slug}`} className="card spotlight group flex h-full flex-col sm:p-8">
                  <p className="eyebrow muted text-[10px]">{c.context}</p>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-balance">{c.title}</h3>
                  <p className="muted mt-2 line-clamp-3 text-sm">{c.summary}</p>
                  <p className="mt-auto pt-6 text-sm font-medium">Read <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span></p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Principles */}
      <section className="mt-28" aria-labelledby="principles" data-reveal>
        <SectionHead label="Principles" id="principles" title="How I make decisions under pressure." />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t-2 pt-5" style={{ borderColor: i === 0 ? "var(--accent-2)" : "var(--border)" }}>
              <p className="muted num font-mono text-[11px]">P{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold tracking-tight">{p.title}</h3>
              <p className="muted mt-2 text-sm leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-28">
        <Testimonials />
      </div>

      {/* This site + free tool */}
      <section className="mt-28 grid gap-4 lg:grid-cols-2" aria-label="This site and free tools" data-reveal>
        <div className="card flex flex-col overflow-hidden p-0">
          <div className="p-7">
            <p className="eyebrow accent-ink text-[10px]">This site</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Built like production.</h2>
            <p className="muted mt-2 text-sm">Every push runs security gates, performance budgets, and link checks before it deploys.</p>
          </div>
          <pre className="grid-bg border-t p-5 font-mono text-[12px] leading-6" aria-label="CI checks for this site">
            <code>
              <span className="muted block">$ git push origin main</span>
              <CheckLine label="lint · type-check · build" />
              <CheckLine label="codeql · gitleaks · npm audit" />
              <CheckLine label="security headers · lighthouse budgets" />
              <span className="block"><span className="accent-ink">→</span> deployed <span className="muted">{deploy.sha}</span></span>
            </code>
          </pre>
          <div className="mt-auto flex gap-4 border-t px-7 py-4 text-sm font-medium">
            <Link href="/colophon" className="link-hover">How it&apos;s built →</Link>
            <Link href="/status" className="muted hover:text-[var(--fg)]">System status</Link>
          </div>
        </div>
        <Link href="/checklists/kubernetes-security" className="card spotlight group flex flex-col">
          <p className="eyebrow accent-ink text-[10px]">Free tool</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">How secure is your Kubernetes cluster?</h2>
          <p className="muted mt-2 text-sm">A {k8sChecklistCount}-point self-assessment across RBAC, workloads, network, supply chain, secrets, and detection. Five minutes, no sign-up.</p>
          <span className="btn-primary mt-8 self-start">Score my cluster <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span></span>
        </Link>
      </section>
    </>
  );
}

function SectionLabel({ n, text }: { n?: string; text: string }) {
  return (
    <p className="eyebrow flex items-center gap-3 text-[11px]">
      {n && <span className="accent-ink">{n}</span>}
      {n && <span className="h-px w-6 bg-[var(--border)]" aria-hidden />}
      <span className="muted">{text}</span>
    </p>
  );
}

function SectionHead({ n, label, id, title, link }: { n?: string; label: string; id: string; title: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <SectionLabel n={n} text={label} />
        <h2 id={id} className="h-section mt-3 max-w-2xl text-balance">{title}</h2>
      </div>
      {link && <Link href={link.href} className="muted shrink-0 text-sm link-hover">{link.label} →</Link>}
    </div>
  );
}

function Status({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b py-4 pr-4 sm:border-b-0 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
      <dt className="eyebrow muted text-[10px]">{label}</dt>
      <dd className="font-mono text-sm">{children}</dd>
    </div>
  );
}

function CheckLine({ label }: { label: string }) {
  return (
    <span className="block">
      <span style={{ color: "var(--ok)" }}>✓</span> {label}
    </span>
  );
}

function Line({ k, v, raw }: { k: string; v: string; raw?: boolean }) {
  return (
    <span className="block">
      <span className="muted">{k}:</span> <span>{raw ? v : `"${v}"`}</span>
    </span>
  );
}
