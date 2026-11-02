import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Checklist } from "@/components/checklist";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { k8sChecklist, k8sChecklistCount } from "@/lib/checklist";
import { site } from "@/lib/data";
import { PERSON_ID, graph, pageMeta } from "@/lib/seo";

const title = "Kubernetes security checklist";
const description = `A ${k8sChecklistCount}-point Kubernetes security self-assessment covering the control plane, RBAC, workloads, network policy, supply chain, secrets, and detection. Score your cluster in five minutes.`;

export const metadata = pageMeta({ title, description, path: "/checklists/kubernetes-security", type: "article" });

export default function K8sChecklistPage() {
  return (
    <>
      <JsonLd
        data={graph({
          "@type": "HowTo",
          name: title,
          description,
          url: `${site.url}/checklists/kubernetes-security`,
          author: { "@id": PERSON_ID },
          step: k8sChecklist.flatMap((g) => g.items.map((i) => ({ "@type": "HowToStep", name: i.text, text: i.why }))),
        })}
      />
      <Breadcrumbs items={[{ name: "Kubernetes security checklist", path: "/checklists/kubernetes-security" }]} />
      <PageHeader
        eyebrow="Free tool · self-assessment"
        title="Kubernetes security checklist"
        intro={`${k8sChecklistCount} controls I check on every production cluster. Tick what's in place to get a score. Your answers stay in your browser.`}
      />
      <Checklist id="k8s-security-v1" groups={k8sChecklist} />
      <p className="muted mt-16 max-w-3xl text-sm">
        Based on the Kubernetes documentation (Pod Security Standards, RBAC good practices) and CIS Benchmark themes. Want a second pair of eyes on your
        cluster? <Link href="/contact" className="link-hover text-[var(--fg)]">Get in touch</Link>.
      </p>
    </>
  );
}
