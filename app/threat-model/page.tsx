import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { pageMeta } from "@/lib/seo";
import { assets, boundaries, openItems, threats } from "@/lib/threat-model";

export const metadata = pageMeta({
  title: "Threat model",
  description: "A STRIDE threat model of krishnaneupane.com: assets, trust boundaries, threats, mitigations, residual risk, and open items.",
  path: "/threat-model",
});

const riskColor = { Low: "var(--ok)", Medium: "var(--accent)", High: "var(--bad)" } as const;

export default function ThreatModelPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Threat model", path: "/threat-model" }]} />
      <PageHeader
        eyebrow="Threat model · STRIDE"
        title="What could go wrong, and what's in the way."
        intro="Even a personal site has assets worth protecting. This is the model I use for it, including the gaps I haven't closed yet."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="assets">
          <h2 id="assets" className="eyebrow accent-ink mb-4">Assets</h2>
          <dl className="divide-y border-y">
            {assets.map((a) => (
              <div key={a.name} className="py-3">
                <dt className="font-medium">{a.name}</dt>
                <dd className="muted mt-0.5 text-sm">{a.detail}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="boundaries">
          <h2 id="boundaries" className="eyebrow accent-ink mb-4">Trust boundaries</h2>
          <ul className="divide-y border-y">
            {boundaries.map((b) => <li key={b} className="py-3 font-mono text-[13px]">{b}</li>)}
          </ul>
        </section>
      </div>

      <section className="mt-16" aria-labelledby="threats">
        <h2 id="threats" className="h-section mb-6">Threats and mitigations</h2>
        {/* Phones: one card per threat instead of a table that needs sideways scrolling. */}
        <ul className="space-y-4 md:hidden">
          {threats.map((t) => (
            <li key={t.threat} className="rounded-2xl border p-4 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{t.category}</span>
                <span className="font-mono text-xs" style={{ color: riskColor[t.residual] }}>Residual: {t.residual}</span>
              </div>
              <p className="mt-2">{t.threat}</p>
              <ul className="muted mt-3 list-disc space-y-1 pl-4">{t.mitigations.map((m) => <li key={m}>{m}</li>)}</ul>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto rounded-2xl border md:block">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">STRIDE threats, mitigations, and residual risk</caption>
            <thead>
              <tr className="muted border-b text-left font-mono text-[10px] tracking-wider uppercase">
                <th scope="col" className="px-4 py-3 font-normal">Category</th>
                <th scope="col" className="px-4 py-3 font-normal">Threat</th>
                <th scope="col" className="px-4 py-3 font-normal">Mitigations</th>
                <th scope="col" className="px-4 py-3 font-normal">Residual</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((t) => (
                <tr key={t.threat} className="border-b align-top last:border-0">
                  <td className="px-4 py-4 font-medium whitespace-nowrap">{t.category}</td>
                  <td className="px-4 py-4">{t.threat}</td>
                  <td className="muted px-4 py-4">
                    <ul className="list-disc space-y-1 pl-4">{t.mitigations.map((m) => <li key={m}>{m}</li>)}</ul>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs whitespace-nowrap" style={{ color: riskColor[t.residual] }}>{t.residual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="open">
        <h2 id="open" className="h-section mb-2">Open items</h2>
        <p className="muted mb-5">Known gaps. A threat model with no gaps isn&apos;t believable.</p>
        <ol className="space-y-3">
          {openItems.map((o, i) => (
            <li key={o} className="flex gap-4">
              <span className="accent-ink font-mono text-xs leading-6">{String(i + 1).padStart(2, "0")}</span>
              <span className="leading-relaxed">{o}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="muted mt-16 text-sm">
        Related: <Link href="/decisions" className="link-hover text-[var(--fg)]">architecture decision records</Link> ·{" "}
        <Link href="/verify" className="link-hover text-[var(--fg)]">verify this site</Link> ·{" "}
        <a href="/.well-known/security.txt" className="link-hover text-[var(--fg)]">report a vulnerability</a>
      </p>
    </>
  );
}
