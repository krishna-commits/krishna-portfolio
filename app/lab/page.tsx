import Link from "next/link";
import { ArchitectureLab } from "@/components/architecture-lab";
import { AttackSimulator } from "@/components/attack-simulator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Pipeline } from "@/components/pipeline";
import { SkillsCluster } from "@/components/skills-cluster";
import { architectures } from "@/lib/architectures";
import { k8sChecklistCount } from "@/lib/checklist";
import { namespaces, podAge } from "@/lib/cluster";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Lab",
  description:
    "Interactive explainers by Krishna Neupane: reference cloud architectures, a secure delivery pipeline, a defense-in-depth attack demo, a skills map, and a Kubernetes security self-assessment.",
  path: "/lab",
});

export default function LabPage() {
  const clusterData = namespaces.map((ns) => ({ ...ns, pods: ns.pods.map((p) => ({ ...p, age: podAge(p) })) }));

  return (
    <>
      <Breadcrumbs items={[{ name: "Lab", path: "/lab" }]} />
      <PageHeader
        eyebrow="Lab"
        title="Interactive explainers."
        intro="Reference architectures and illustrations of how I design and secure delivery. These are explainers, not live systems; for real work, see the case studies."
      />

      <div className="space-y-28">
        <section id="architectures" aria-labelledby="arch-h" className="scroll-mt-24">
          <Head id="arch-h" label="Reference architectures" title="Patterns, and the decisions behind them." />
          <ArchitectureLab architectures={architectures} />
        </section>

        <section id="pipeline" aria-labelledby="pipe-h" className="scroll-mt-24">
          <Head id="pipe-h" label="Secure delivery · select a stage" title="A control at every stage, commit to production." />
          <Pipeline />
          <div className="mt-10">
            <p className="eyebrow muted mb-4">Try to break it</p>
            <AttackSimulator />
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-h" className="scroll-mt-24">
          <Head id="skills-h" label="Skills map" title="Six domains, one toolkit." />
          <SkillsCluster namespaces={clusterData} />
          <p className="muted mt-4 text-sm">
            Each domain is explained in depth, with evidence, on the <Link href="/expertise" className="link-hover text-[var(--fg)]">expertise page</Link>.
          </p>
        </section>

        <section aria-labelledby="tool-h">
          <Link href="/checklists/kubernetes-security" className="card group flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="eyebrow accent-ink">Free tool</p>
              <h2 id="tool-h" className="display mt-3 text-3xl">How secure is your Kubernetes cluster?</h2>
              <p className="muted mt-2 max-w-xl">A {k8sChecklistCount}-point self-assessment across RBAC, workloads, network, supply chain, secrets, and detection.</p>
            </div>
            <span className="btn-primary shrink-0">Score my cluster →</span>
          </Link>
        </section>
      </div>
    </>
  );
}

function Head({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="eyebrow muted">{label}</p>
      <h2 id={id} className="h-section mt-3 max-w-2xl">{title}</h2>
    </div>
  );
}
