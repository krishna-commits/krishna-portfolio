import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompanyName } from "@/components/company-name";
import { TimezoneOverlap } from "@/components/timezone-overlap";
import { ImpactChips } from "@/components/impact-chips";
import { LeadershipGrid } from "@/components/leadership-grid";
import { capabilities, certifications, education, experience, formatRange, hiringLogistics, profile, site, socials } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hire Krishna Neupane",
  description:
    "Hiring a senior DevSecOps or platform engineer? Krishna Neupane: 9+ years in Kubernetes, GitOps, IaC, and cloud security, remote from Kathmandu (UTC+5:45). Role fit, experience, and working-hours overlap.",
  path: "/hire",
});

const roles = ["Senior / Lead DevSecOps Engineer", "Senior Platform Engineer", "Cloud Security Engineer", "Senior SRE / Infrastructure Engineer"];

export default function HirePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Hire", path: "/hire" }]} />

      <header className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-3xl">
          <p className="eyebrow accent-ink flex items-center gap-2"><span className="signal signal-pulse" aria-hidden /> Available for remote roles</p>
          <h1 className="h-page mt-4">For recruiters & hiring managers</h1>
          <p className="lede mt-4">Everything you need to decide whether to talk, on one page: logistics, role fit, leadership, experience, and working-hours overlap.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={socials.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary">Book a 30-min call ↗</a>
            <Link href="/resume" className="btn-outline">Resume (PDF)</Link>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn-outline">LinkedIn ↗</a>
          </div>
        </div>
        <Image src={profile.photo.src} width={140} height={140} alt={profile.photo.alt} className="h-28 w-28 rounded-2xl border object-cover sm:h-36 sm:w-36 rule" />
      </header>

      <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4 rule" aria-label="At a glance">
        <Fact label="Experience" value={`${profile.yearsExperience} years in production infrastructure`} />
        <Fact label="Current" value={`${experience[0].title}, ${experience[0].company}`} />
        <Fact label="Location" value={`${site.location.city}, ${site.location.country} · remote`} />
        <Fact label="Education" value={education[0].degree} />
      </section>

      <section className="mt-6 card" aria-labelledby="logistics">
        <h2 id="logistics" className="eyebrow accent-ink">Hiring logistics</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {hiringLogistics.map((l) => (
            <div key={l.label} className="flex flex-col gap-0.5 border-l-2 pl-4" style={{ borderColor: "var(--accent-2)" }}>
              <dt className="muted text-xs">{l.label}</dt>
              <dd className="font-medium">{l.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20" aria-labelledby="leadership">
        <h2 id="leadership" className="h-section mb-6">Leadership &amp; ownership</h2>
        <LeadershipGrid />
      </section>

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        <section aria-labelledby="fit">
          <h2 id="fit" className="h-section mb-6">Role fit</h2>
          <ul className="space-y-3">
            {roles.map((r) => (
              <li key={r} className="flex items-center gap-3 text-lg"><span className="accent-ink" aria-hidden>✓</span>{r}</li>
            ))}
          </ul>
          <h3 className="eyebrow muted mt-10 mb-4">What I bring</h3>
          <dl className="space-y-5">
            {capabilities.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold">{c.title}</dt>
                <dd className="muted mt-1 text-sm leading-relaxed">{c.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="career">
          <h2 id="career" className="h-section mb-6">Career</h2>
          <ol className="divide-y rule border-y">
            {experience.map((r) => (
              <li key={r.company + r.start} className="py-4">
                <p className="eyebrow muted num">{formatRange(r.start, r.end)}</p>
                <p className="mt-1 font-semibold">{r.title}</p>
                <p className="muted flex flex-wrap items-center gap-x-1 text-sm">
                  <CompanyName role={r} />
                  {r.context ? <span> · {r.context}</span> : null}
                </p>
                <ImpactChips role={r} className="mt-2" />
              </li>
            ))}
          </ol>
          <h3 className="eyebrow muted mt-10 mb-4">Credentials</h3>
          <ul className="space-y-1.5 text-sm">
            {certifications.slice(0, 5).map((c) => <li key={c.name}>{c.name}{c.issuer ? <span className="muted"> · {c.issuer}</span> : null}</li>)}
          </ul>
          <Link href="/about#certifications" className="muted mt-3 inline-block text-sm link-hover">All {certifications.length} →</Link>
        </section>
      </div>

      <section className="mt-20" aria-labelledby="overlap">
        <h2 id="overlap" className="h-section mb-2">Working-hours overlap</h2>
        <p className="muted mb-6">Kathmandu is UTC+5:45. Check how my hours line up with your team&apos;s.</p>
        <TimezoneOverlap />
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--card)] p-5">
      <p className="eyebrow muted">{label}</p>
      <p className="mt-1.5 text-sm font-medium">{value}</p>
    </div>
  );
}
