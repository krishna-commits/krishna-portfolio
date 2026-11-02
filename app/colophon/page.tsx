import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FlowDiagram } from "@/components/flow-diagram";
import { PageHeader } from "@/components/page-header";
import { deploy } from "@/lib/deploy";
import { securityHeaders } from "@/lib/security-headers.mjs";
import { pageMeta } from "@/lib/seo";
import lighthouse from "@/lighthouserc.json";

export const metadata = pageMeta({
  title: "Built like production",
  description:
    "How krishnaneupane.com is built, tested, and secured: CI security gates, CodeQL, secret scanning, Lighthouse budgets, security headers, and structured data.",
  path: "/colophon",
});

const budgets = Object.entries(lighthouse.ci.assert.assertions).map(([key, [, opts]]) => ({
  name: key.replace("categories:", "").replace("-", " "),
  min: Math.round((opts as { minScore: number }).minScore * 100),
}));

const stack = [
  ["Framework", "Next.js 16 (App Router), React 19, static rendering by default"],
  ["Language", "TypeScript 7, strict mode"],
  ["Styling", "Tailwind CSS 4, design tokens as CSS variables, light and dark"],
  ["Content", "MDX articles; all identity data in one typed source file"],
  ["Hosting", "Vercel, a preview deployment for every pull request"],
  ["Dependencies", "Next, React, MDX. No UI kits, no analytics trackers, no client-side data fetching"],
];

const machineReadable = [
  { href: "/llms.txt", label: "llms.txt", note: "profile summary for LLM tools" },
  { href: "/sitemap.xml", label: "sitemap.xml", note: "indexable pages only" },
  { href: "/robots.txt", label: "robots.txt", note: "search and AI crawlers allowed" },
  { href: "/feed.xml", label: "feed.xml", note: "RSS for articles" },
  { href: "/.well-known/security.txt", label: "security.txt", note: "RFC 9116 disclosure contact" },
];

export default function ColophonPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Colophon", path: "/colophon" }]} />
      <PageHeader
        eyebrow="Colophon"
        title="Built like production."
        intro="This site is a small production system, held to the standards I apply at work: every change goes through security gates, performance budgets, and automated checks before it ships."
      />

      <FlowDiagram
        title="This site's delivery pipeline"
        caption="Every push to this repository runs the same stages. A failing gate blocks the deploy."
        stages={[
          { label: "Commit", items: ["Pull request", "Branch protection"] },
          { label: "Build", items: ["Lint", "Type-check", "next build"] },
          { label: "Security", items: ["CodeQL SAST", "gitleaks", "npm audit"] },
          { label: "Quality", items: ["Lighthouse budgets", "Link check", "Header check"] },
          { label: "Deploy", items: ["Vercel", "Preview per PR"] },
          { label: "Observe", items: ["Live /status", "Dependabot"] },
        ]}
        planes={[{ label: "Security plane", items: ["CSP", "HSTS preload", "COOP / CORP", "security.txt", "no trackers"] }]}
      />

      <div className="grid gap-16 lg:grid-cols-2">
        <section aria-labelledby="headers">
          <h2 id="headers" className="h-section mb-2">Security headers</h2>
          <p className="muted mb-6 text-sm">The exact headers every response carries, read from the same file the server uses.</p>
          <dl className="divide-y rule border-y">
            {securityHeaders.map((h) => (
              <div key={h.key} className="py-3">
                <dt className="font-mono text-xs font-semibold">{h.key}</dt>
                <dd className="muted mt-1 font-mono text-[11px] leading-relaxed break-words">{h.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-16">
          <section aria-labelledby="budgets">
            <h2 id="budgets" className="h-section mb-2">Performance budgets</h2>
            <p className="muted mb-6 text-sm">Lighthouse runs in CI on key pages. Scoring below these minimums fails the build.</p>
            <ul className="grid grid-cols-2 gap-3">
              {budgets.map((b) => (
                <li key={b.name} className="card p-5">
                  <p className="num text-3xl font-semibold tracking-tight">≥ {b.min}</p>
                  <p className="eyebrow muted mt-1">{b.name}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="stack">
            <h2 id="stack" className="h-section mb-6">Stack</h2>
            <dl className="space-y-3 text-sm">
              {stack.map(([k, v]) => (
                <div key={k} className="grid gap-1 sm:grid-cols-[120px_1fr]">
                  <dt className="eyebrow muted pt-0.5">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="machine">
            <h2 id="machine" className="h-section mb-6">Machine-readable</h2>
            <ul className="space-y-2 text-sm">
              {machineReadable.map((m) => (
                <li key={m.href} className="flex flex-wrap items-baseline gap-x-3">
                  <a href={m.href} className="font-mono link-hover">{m.label}</a>
                  <span className="muted">{m.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="card mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm">
          <span className="muted">deployed</span> {deploy.sha} <span className="muted">from</span> {deploy.ref}
        </p>
        <Link href="/status" className="btn-outline">Live system status →</Link>
      </div>
    </>
  );
}
