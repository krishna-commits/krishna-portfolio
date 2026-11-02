import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import {
  certifications,
  education,
  experience,
  expertise,
  formatMonth,
  formatRange,
  leadership,
  profile,
  publicCompany,
  site,
  socials,
  techStack,
  theses,
} from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Resume",
  description:
    "Resume of Krishna Neupane, Senior DevSecOps Engineer: platform engineering, multi-cloud architecture, Kubernetes, GitOps, and cloud security. Download as PDF.",
  path: "/resume",
  type: "profile",
});

// Always-current resume generated from lib/data.ts. Personal phone and email are deliberately omitted;
// the full version is available on request through the contact form.
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link href="/about" className="muted text-sm link-hover">← About</Link>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact?topic=resume#send-a-message" className="btn-outline">Request full version</Link>
          <PrintButton />
        </div>
      </div>

      <article className="space-y-9 text-[15px] leading-relaxed">
        <header className="border-b pb-6">
          <h1 className="text-4xl font-bold tracking-tight">{site.name}</h1>
          <p className="mt-1 text-lg">{profile.jobTitle} · {profile.headline}</p>
          <p className="muted mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>{site.location.city}, {site.location.country} · Remote · flexible hours</span>
            <a href={site.url}>krishnaneupane.com</a>
            <a href={socials.linkedin}>linkedin.com/in/krishna-neupane-50082091</a>
            <a href={socials.github}>github.com/krishna-commits</a>
            <a href={site.contactUrl}>krishnaneupane.com/contact</a>
          </p>
        </header>

        <Block title="Summary">
          <p>{profile.bio[0]}</p>
        </Block>

        <Block title="Core expertise">
          <p>{expertise.join(" · ")}</p>
        </Block>

        <Block title="Leadership">
          <ul className="list-disc space-y-1 pl-5">
            {leadership.map((l) => <li key={l.title}><span className="font-semibold">{l.title}:</span> {l.body}</li>)}
          </ul>
        </Block>

        <Block title="Experience">
          <div className="space-y-7">
            {experience.map((r) => (
              <section key={r.start} className="print-tight">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="font-semibold">
                    {r.title}, {publicCompany(r)}
                    {!r.confidential && r.context ? ` (${r.context})` : ""}
                  </h3>
                  <span className="muted num shrink-0 text-sm">{formatRange(r.start, r.end)}</span>
                </div>
                {r.impact?.length ? (
                  <p className="mt-1 text-sm font-medium">{r.impact.map((m) => `${m.value} ${m.label}`).join(" · ")}</p>
                ) : null}
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {r.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </Block>

        <Block title="Technical skills">
          <dl className="space-y-1.5">
            {Object.entries(techStack).map(([k, v]) => (
              <div key={k} className="sm:flex sm:gap-2">
                <dt className="shrink-0 font-semibold sm:w-52">{k}</dt>
                <dd className="muted">{v.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Education">
          <ul className="space-y-3">
            {education.map((e, i) => (
              <li key={e.degree} className="print-tight">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <span className="font-semibold">{e.degree}, {e.awardedBy}</span>
                  <span className="muted num text-sm">{formatMonth(e.date)}</span>
                </div>
                <p className="muted text-sm">Delivered through {e.school} · Research: {theses[i]?.title}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Courses & certifications">
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {certifications.map((c) => {
              const meta = [c.issuer, formatMonth(c.date)].filter(Boolean).join(", ");
              return (
                <li key={c.name}>
                  {c.name}
                  {meta && <span className="muted"> · {meta}</span>}
                </li>
              );
            })}
          </ul>
        </Block>

        <Block title="Languages">
          <p>{profile.languages.join(" · ")}</p>
        </Block>
      </article>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow accent-ink mb-3">{title}</h2>
      {children}
    </section>
  );
}
