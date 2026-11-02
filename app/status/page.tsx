import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { deploy } from "@/lib/deploy";
import { pageMeta } from "@/lib/seo";
import { runChecks } from "@/lib/status";

export const metadata = pageMeta({
  title: "System status",
  description: "Live status of krishnaneupane.com and Krishna Neupane's public tools: DevOps World, Domain Search, Tech Cheatsheet, and Cron Job Generator.",
  path: "/status",
});

// Checks run on every request: a status page that serves cached results isn't a status page.
export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const { checks, checkedAt, allOk } = await runChecks();
  const down = checks.filter((c) => !c.ok).length;

  return (
    <>
      <Breadcrumbs items={[{ name: "Status", path: "/status" }]} />
      <PageHeader eyebrow="Status" title="System status" intro="Live checks against this site and the public tools I run. Every request to this page runs the checks again." />

      <div
        className="card mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: allOk ? "var(--fg)" : "var(--accent)" }}
        role="status"
      >
        <p className="flex items-center gap-3 text-lg font-semibold">
          <span className={`signal ${allOk ? "signal-pulse" : ""}`} style={{ background: allOk ? "var(--ok)" : "var(--accent)" }} aria-hidden />
          {allOk ? "All systems operational" : `${down} of ${checks.length} systems degraded`}
        </p>
        <p className="muted font-mono text-xs num">
          checked <time dateTime={checkedAt}>{new Date(checkedAt).toUTCString().replace("GMT", "UTC")}</time>
        </p>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <caption className="sr-only">Service checks</caption>
          <thead>
            <tr className="eyebrow muted border-b text-left rule">
              <th scope="col" className="px-5 py-3 font-normal">Service</th>
              <th scope="col" className="px-5 py-3 font-normal">Status</th>
              <th scope="col" className="hidden px-5 py-3 text-right font-normal sm:table-cell">HTTP</th>
              <th scope="col" className="px-5 py-3 text-right font-normal">Latency</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((c) => (
              <tr key={c.slug} className="border-b last:border-0 rule">
                <td className="px-5 py-4">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-medium link-hover">{c.name} ↗</a>
                  <p className="muted font-mono text-[11px]">{c.url.replace("https://", "")}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.ok ? "var(--ok)" : "var(--accent)" }} aria-hidden />
                    {c.ok ? "Operational" : c.status ? "Degraded" : "Unreachable"}
                  </span>
                </td>
                <td className="num muted hidden px-5 py-4 text-right font-mono sm:table-cell">{c.status ?? "—"}</td>
                <td className="num px-5 py-4 text-right font-mono">{c.ms !== null ? `${c.ms} ms` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted mt-4 text-xs">
        Latency is measured from the server rendering this page, not from your browser.
      </p>

      <section className="mt-16 grid gap-4 sm:grid-cols-3" aria-label="Deployment">
        <Stat label="Deployed commit" value={deploy.sha} />
        <Stat label="Branch · environment" value={`${deploy.ref} · ${deploy.env}`} />
        <Stat label="Built" value={new Date(deploy.builtAt).toUTCString().replace(" GMT", "").slice(5, 22)} />
      </section>

      <p className="muted mt-8 text-sm">
        How this site is built, tested, and secured: <Link href="/colophon" className="link-hover text-[var(--fg)]">Built like production →</Link>
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="eyebrow muted">{label}</p>
      <p className="num mt-2 font-mono text-lg">{value}</p>
    </div>
  );
}
