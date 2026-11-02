import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { deploy } from "@/lib/deploy";
import { buildSbom, sbomStats } from "@/lib/sbom.mjs";
import { securityHeaders } from "@/lib/security-headers.mjs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Verify this site",
  description:
    "Verify krishnaneupane.com yourself: its software bill of materials, a signed build provenance attestation, security headers, and the decisions and threat model behind it.",
  path: "/verify",
});

const REPO = "krishna-commits/krishna-portfolio";

export default function VerifyPage() {
  const stats = sbomStats(buildSbom()) as { total: number; production: number; sha256: string; lockfileSha256: string };

  return (
    <>
      <Breadcrumbs items={[{ name: "Verify", path: "/verify" }]} />
      <PageHeader
        eyebrow="Verify"
        title="Don't take my word for it."
        intro="A DevSecOps engineer's site should hold up to the same checks as production software. Everything below can be verified independently, from your own terminal."
      />

      <ol className="max-w-3xl space-y-16">
        <Step n={1} title="Inspect the software bill of materials">
          <p>
            Every dependency in this site, with version, package URL, and integrity hash, in CycloneDX 1.5 format.
            It's generated deterministically from the lockfile, so the file served here is byte-identical to the one CI signs.
          </p>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-xl border bg-[var(--border)] sm:grid-cols-3">
            <Fact label="Components" value={String(stats.total)} />
            <Fact label="Shipped to production" value={String(stats.production)} />
            <Fact label="Format" value="CycloneDX 1.5" />
          </dl>
          <p className="muted mt-3 font-mono text-[11px] break-all">sha256 {stats.sha256}</p>
          <Cmd>{`curl -s https://krishnaneupane.com/sbom.json | shasum -a 256`}</Cmd>
          <p className="mt-3 text-sm"><a href="/sbom.json" className="link-hover accent-ink">Download sbom.json →</a></p>
        </Step>

        <Step n={2} title="Verify the signed build provenance">
          <p>
            On every push, GitHub Actions generates the SBOM and signs a{" "}
            <a href="https://slsa.dev/spec/v1.0/levels" target="_blank" rel="noopener noreferrer" className="link-hover">SLSA build provenance</a>{" "}
            attestation for it with Sigstore. Verifying it proves the file came from this repository, through CI, at a specific commit.
          </p>
          <Cmd>{`curl -sO https://krishnaneupane.com/sbom.json\ngh attestation verify sbom.json -R ${REPO}`}</Cmd>
          <p className="muted mt-3 text-sm">
            This build: commit <span className="font-mono text-[var(--fg)]">{deploy.sha}</span> on <span className="font-mono text-[var(--fg)]">{deploy.ref}</span>.
          </p>
        </Step>

        <Step n={3} title="Check the security headers">
          <p>Every response carries these headers. Compare them with what your terminal receives:</p>
          <Cmd>{`curl -sI https://krishnaneupane.com | grep -iE "content-security|strict-transport|x-frame|x-content|referrer|permissions|cross-origin"`}</Cmd>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {securityHeaders.map((h: { key: string }) => <li key={h.key} className="tag">{h.key}</li>)}
          </ul>
          <p className="muted mt-3 text-sm">
            Or use an independent scanner:{" "}
            <a href="https://securityheaders.com/?q=krishnaneupane.com&followRedirects=on" target="_blank" rel="noopener noreferrer" className="link-hover">securityheaders.com ↗</a>{" "}
            ·{" "}
            <a href="https://developer.mozilla.org/en-US/observatory/analyze?host=krishnaneupane.com" target="_blank" rel="noopener noreferrer" className="link-hover">Mozilla Observatory ↗</a>
          </p>
        </Step>

        <Step n={4} title="Review the repository's security posture">
          <p>
            The OpenSSF Scorecard independently rates the repository's practices: branch protection, pinned dependencies,
            token permissions, static analysis, and more. CI also runs CodeQL, secret scanning, and dependency audits on every push.
          </p>
          <p className="mt-4 text-sm">
            <a href={`https://scorecard.dev/viewer/?uri=github.com/${REPO}`} target="_blank" rel="noopener noreferrer" className="link-hover accent-ink">View the Scorecard ↗</a>
          </p>
        </Step>

        <Step n={5} title="Read the reasoning">
          <p>Controls are only half the story. The decisions and risks behind them are written down:</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/decisions" className="link-hover accent-ink">Architecture decision records →</Link> <span className="muted">why the site is built the way it is, including the trade-offs</span></li>
            <li><Link href="/threat-model" className="link-hover accent-ink">Threat model →</Link> <span className="muted">assets, trust boundaries, threats, and mitigations</span></li>
            <li><a href="/.well-known/security.txt" className="link-hover accent-ink">security.txt →</a> <span className="muted">how to report a vulnerability</span></li>
            <li><Link href="/colophon" className="link-hover accent-ink">Colophon →</Link> <span className="muted">the pipeline and performance budgets</span></li>
          </ul>
        </Step>
      </ol>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-4 sm:grid-cols-[48px_1fr]">
      <span className="display text-3xl accent-ink" aria-hidden>{n}</span>
      <div>
        <h2 className="display text-[1.9rem] leading-tight">{title}</h2>
        <div className="muted mt-3 leading-relaxed [&_p]:text-[var(--muted)]">{children}</div>
      </div>
    </li>
  );
}

function Cmd({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-xl border bg-[var(--card)] p-4 font-mono text-[12px] leading-6 text-[var(--fg)]">
      <code>
        {children.split("\n").map((line) => (
          <span key={line} className="block">
            <span className="muted select-none">$ </span>
            {line}
          </span>
        ))}
      </code>
    </pre>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--card)] p-4">
      <dt className="muted text-xs">{label}</dt>
      <dd className="display mt-1 text-2xl text-[var(--fg)]">{value}</dd>
    </div>
  );
}
