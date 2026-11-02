import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { LocalTime } from "@/components/local-time";
import { TimezoneOverlap } from "@/components/timezone-overlap";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { site, socials } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Contact Krishna Neupane, Senior DevSecOps Engineer in Kathmandu, Nepal, about senior DevSecOps and platform security roles, collaborations, or research.",
  path: "/contact",
});

const reasons = [
  { title: "Engineering roles", body: "Senior or lead DevSecOps, platform, cloud security, or SRE positions. Full overlap with your team's hours." },
  { title: "Technical problems", body: "A Kubernetes platform, delivery pipeline, or cloud security setup you'd like a second opinion on." },
  { title: "Research", body: "Threat detection, security automation, or DevSecOps research and writing collaboration." },
  { title: "Community", body: "Meetups, talks, and conversations with engineers working on similar problems." },
];

const connect = [
  { label: "LinkedIn", href: socials.linkedin },
  { label: "GitHub", href: socials.github },
  { label: "ResearchGate", href: socials.researchgate },
  { label: "ORCID", href: socials.orcid },
  { label: "Medium", href: socials.medium },
  { label: "DEV", href: socials.devto },
  { label: "Instagram", href: socials.instagram },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph({ "@type": "ContactPage", url: `${site.url}/contact`, name: "Contact Krishna Neupane", about: { "@id": PERSON_ID } })} />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <PageHeader
        eyebrow="Contact"
        title="Let's talk."
        intro="I'm open to senior DevSecOps and platform engineering roles, working remotely on your team's hours. I'm also glad to talk through a platform or security problem, or compare notes on research."
      />

      <ul className="mb-16 grid gap-px overflow-hidden rounded-2xl border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4" aria-label="Reasons to get in touch">
        {reasons.map((r) => (
          <li key={r.title} className="bg-[var(--card)] p-5">
            <p className="display text-xl">{r.title}</p>
            <p className="muted mt-1.5 text-sm leading-relaxed">{r.body}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-16 md:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-10">
          <a href={socials.calendly} target="_blank" rel="noopener noreferrer" className="card spotlight group block border-[var(--accent)]">
            <p className="eyebrow accent-ink">Fastest</p>
            <p className="mt-2 text-lg font-semibold">Book a 30-minute call</p>
            <p className="muted mt-1 text-sm">Pick a time that works for you. Times are shown in your own time zone.</p>
            <p className="mt-4 text-sm font-medium">Open calendar <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>↗</span></p>
          </a>
          <dl className="space-y-6">
            <div>
              <dt className="eyebrow muted">Response time</dt>
              <dd className="mt-1 text-lg">Within 24 hours</dd>
            </div>
            <div>
              <dt className="eyebrow muted">Location</dt>
              <dd className="mt-1 text-lg">{site.location.city}, {site.location.country} · Remote</dd>
              <dd className="muted mt-1 text-sm"><LocalTime /></dd>
            </div>
            <div>
              <dt className="eyebrow muted">Resume</dt>
              <dd className="mt-1 flex flex-col gap-1">
                <Link href="/resume" className="link-hover">View or download as PDF →</Link>
                <Link href="/contact?topic=resume#send-a-message" className="muted text-sm link-hover">Request the full version with references</Link>
              </dd>
            </div>
          </dl>

          <div>
            <p className="eyebrow muted mb-3">Elsewhere</p>
            <ul className="flex flex-wrap gap-2">
              {connect.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="me noopener noreferrer" className="tag px-3 py-1 hover:text-[var(--fg)]">{c.label} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-8">
        <section id="send-a-message" className="card scroll-mt-24 sm:p-8" aria-labelledby="form-title">
          <h2 id="form-title" className="text-xl font-semibold">Send a message</h2>
          <p className="muted mt-2 mb-8 text-sm">
            I reply within 24 hours. Fields marked * are required.
          </p>
          <ContactForm />
        </section>
        <section aria-labelledby="overlap-title">
          <h2 id="overlap-title" className="eyebrow accent-ink mb-3">Working-hours overlap</h2>
          <TimezoneOverlap />
        </section>
        </div>
      </div>
    </>
  );
}
