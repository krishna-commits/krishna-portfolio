import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Uses",
  description: "The tools Krishna Neupane uses daily for DevSecOps and platform engineering: cloud, Kubernetes, IaC, security, and observability.",
  path: "/uses",
});

// Professional toolkit from the resume. Add hardware, editor, and terminal setup under "Workstation" when ready.
const groups = [
  {
    title: "Platform",
    items: [
      ["Kubernetes", "EKS, GKE, and AKS in production; Helm for packaging"],
      ["ArgoCD", "GitOps delivery: Git is the only way into production"],
      ["Docker", "Container builds from pinned base images"],
    ],
  },
  {
    title: "Infrastructure as code",
    items: [
      ["Terraform", "Every cloud resource declared, planned, and reviewed"],
      ["Terragrunt", "DRY multi-environment and multi-account layouts"],
      ["CloudFormation", "Where AWS-native stacks fit better"],
    ],
  },
  {
    title: "Security",
    items: [
      ["HashiCorp Vault", "Secrets management, injected at runtime"],
      ["SonarQube / SonarCloud", "Static analysis quality gates in CI"],
      ["OWASP ZAP", "Dynamic testing against running environments"],
      ["Cloudflare", "DNS, WAF, and Zero Trust access"],
      ["1Password", "Team credential management"],
    ],
  },
  {
    title: "Observability",
    items: [
      ["Prometheus + Alertmanager", "Metrics and alerting"],
      ["Grafana + Loki", "Dashboards and logs"],
      ["Datadog · Signoz", "APM and tracing, depending on the client"],
    ],
  },
  {
    title: "Automation",
    items: [
      ["GitHub Actions · GitLab CI", "Pipelines with security gates"],
      ["Python · Bash", "Glue, tooling, and automation scripts"],
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Uses", path: "/uses" }]} />
      <PageHeader eyebrow="Uses" title="The toolkit." intro="What I reach for every day to build, secure, and run platforms, and why." />

      <div className="max-w-3xl space-y-14">
        {groups.map((g) => (
          <section key={g.title} aria-labelledby={`uses-${g.title}`}>
            <h2 id={`uses-${g.title}`} className="eyebrow accent-ink mb-4">{g.title}</h2>
            <dl className="divide-y rule border-y">
              {g.items.map(([tool, why]) => (
                <div key={tool} className="grid gap-1 py-4 sm:grid-cols-[240px_1fr]">
                  <dt className="font-medium">{tool}</dt>
                  <dd className="muted">{why}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <p className="muted text-sm">
          The full stack is on the <Link href="/about#stack" className="link-hover text-[var(--fg)]">About page</Link>. What I&apos;m working on right now: <Link href="/now" className="link-hover text-[var(--fg)]">/now</Link>.
        </p>
      </div>
    </>
  );
}
