import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { adrs } from "@/lib/adr";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Architecture decision records",
  description: "The architecture decisions behind krishnaneupane.com, written as ADRs: context, decision, and the trade-offs, including what each choice costs.",
  path: "/decisions",
});

export default function DecisionsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Decisions", path: "/decisions" }]} />
      <PageHeader
        eyebrow="Architecture decision records"
        title="Why it's built this way."
        intro="Every system is a set of trade-offs. These records capture the decisions behind this site: the context, the choice, and what each choice costs."
      />

      <nav aria-label="Decisions" className="mb-14 max-w-3xl">
        <ol className="divide-y border-y">
          {adrs.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id.toLowerCase()}`} className="group flex items-baseline gap-4 py-3">
                <span className="accent-ink shrink-0 font-mono text-xs">{a.id}</span>
                <span className="group-hover:underline group-hover:underline-offset-4">{a.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-3xl space-y-20">
        {adrs.map((a) => (
          <article key={a.id} id={a.id.toLowerCase()} className="scroll-mt-24">
            <p className="muted flex flex-wrap gap-x-3 font-mono text-[11px] tracking-wider uppercase">
              <span className="accent-ink">{a.id}</span>
              <span>{a.status}</span>
              <time dateTime={a.date}>{a.date}</time>
            </p>
            <h2 className="display mt-3 text-[2rem] leading-tight">{a.title}</h2>

            <Block label="Context">{a.context}</Block>
            <Block label="Decision">{a.decision}</Block>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "var(--ok)" }}>Gains</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
                  {a.consequences.good.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: "var(--bad)" }}>Costs</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
                  {a.consequences.bad.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="muted mt-20 max-w-3xl text-sm">
        See also the <Link href="/threat-model" className="link-hover text-[var(--fg)]">threat model</Link> and{" "}
        <Link href="/verify" className="link-hover text-[var(--fg)]">how to verify this site</Link>.
      </p>
    </>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="eyebrow muted mb-1.5 text-[10px]">{label}</p>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
