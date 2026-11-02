import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { RepoList } from "@/components/repo-list";
import { currentRole, formatMonth } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Now",
  description: "What Krishna Neupane is working on, learning, and writing right now.",
  path: "/now",
});
export const revalidate = 3600;

// Update this page monthly. Keep it short, specific, and true.
const UPDATED = "2026-11";

const now = [
  {
    label: "Work",
    items: [
      `${currentRole.title} at ${currentRole.company}: leading GitOps adoption with ArgoCD across customer platforms.`,
      "Kubernetes upgrades and cluster lifecycle management for production environments.",
      "Infrastructure-as-code standards and reusable Terraform and Terragrunt patterns.",
    ],
  },
  {
    label: "Writing",
    items: [
      "A security control at every stage: designing a secure delivery pipeline.",
      "Kubernetes upgrades without the drama: a production runbook.",
    ],
  },
  {
    label: "Building",
    items: ["This site, rebuilt as a production system: CI security gates, live status, and structured data."],
  },
];

export default function NowPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Now", path: "/now" }]} />
      <PageHeader eyebrow={`Now · updated ${formatMonth(UPDATED)}`} title="What I'm focused on." intro="A snapshot of current work, writing, and learning, updated monthly." />

      <div className="max-w-3xl space-y-12">
        {now.map((group) => (
          <section key={group.label} aria-labelledby={`now-${group.label}`}>
            <h2 id={`now-${group.label}`} className="eyebrow accent-ink mb-4">{group.label}</h2>
            <ul className="space-y-3 text-[17px] leading-relaxed">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3"><span className="accent-ink mt-1 shrink-0" aria-hidden>▸</span>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="now-github">
          <h2 id="now-github" className="eyebrow accent-ink mb-4">Recent on GitHub</h2>
          <RepoList limit={4} />
        </section>

        <p className="muted text-sm">
          Inspired by the <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="link-hover text-[var(--fg)]">/now page movement</a>. See also <Link href="/uses" className="link-hover text-[var(--fg)]">/uses</Link>.
        </p>
      </div>
    </>
  );
}
