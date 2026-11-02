// Kubernetes security checklist content. Sources: Kubernetes documentation (Pod Security Standards,
// RBAC good practices, security checklist) and CIS Kubernetes Benchmark themes.

export type ChecklistItem = { id: string; text: string; why: string };
export type ChecklistGroup = { title: string; items: ChecklistItem[] };

export const k8sChecklist: ChecklistGroup[] = [
  {
    title: "Control plane & cluster",
    items: [
      { id: "cp-private", text: "API server endpoint is private or IP-restricted", why: "A public API server is the first thing scanners find." },
      { id: "cp-version", text: "Cluster runs a supported Kubernetes minor version", why: "Unsupported versions stop receiving security patches." },
      { id: "cp-audit", text: "Audit logging is enabled and shipped off-cluster", why: "Without audit logs, you can't reconstruct who did what during an incident." },
      { id: "cp-etcd", text: "Secrets are encrypted at rest (KMS envelope encryption)", why: "etcd backups otherwise contain every secret in plain base64." },
    ],
  },
  {
    title: "Identity & RBAC",
    items: [
      { id: "rbac-admin", text: "No human or workload is bound to cluster-admin by default", why: "cluster-admin is full control; keep it for break-glass access only." },
      { id: "rbac-least", text: "Roles are namespace-scoped and least-privilege", why: "Namespace-scoped Roles limit the blast radius of a compromised identity." },
      { id: "rbac-sso", text: "Human access goes through SSO with short-lived credentials", why: "Static kubeconfigs with long-lived tokens get copied and leaked." },
      { id: "rbac-sa-token", text: "automountServiceAccountToken is disabled where pods don't call the API", why: "A mounted token is a free credential for anyone who gets a shell in the pod." },
      { id: "rbac-irsa", text: "Workloads use cloud workload identity (IRSA, Workload Identity) instead of node roles", why: "Node-level cloud roles give every pod on the node the same permissions." },
    ],
  },
  {
    title: "Workloads",
    items: [
      { id: "wl-pss", text: "Pod Security Admission enforces the restricted (or baseline) profile", why: "Blocks privileged pods, host namespaces, and other easy escape paths." },
      { id: "wl-nonroot", text: "Containers run as non-root with a read-only root filesystem", why: "Limits what an attacker can do after exploiting the application." },
      { id: "wl-caps", text: "Linux capabilities are dropped (drop: [ALL]) and privilege escalation is disabled", why: "Most applications need no capabilities at all." },
      { id: "wl-limits", text: "CPU and memory requests and limits are set", why: "Prevents one compromised or runaway pod from starving the node." },
    ],
  },
  {
    title: "Network",
    items: [
      { id: "net-default-deny", text: "Default-deny NetworkPolicies exist in every namespace", why: "By default every pod can reach every other pod." },
      { id: "net-egress", text: "Egress is restricted to what workloads actually need", why: "Unrestricted egress makes data exfiltration and C2 callbacks trivial." },
      { id: "net-metadata", text: "Pods can't reach the cloud metadata endpoint unless required", why: "Metadata endpoints hand out cloud credentials." },
      { id: "net-tls", text: "Ingress terminates TLS with automated certificate renewal", why: "Expired certificates cause outages; plaintext ingress leaks data." },
    ],
  },
  {
    title: "Supply chain",
    items: [
      { id: "sc-scan", text: "Images are scanned in CI and builds fail on critical vulnerabilities", why: "Catch known vulnerabilities before they reach the cluster." },
      { id: "sc-digest", text: "Images are referenced by digest, from trusted registries only", why: "Mutable tags can be re-pushed with different content." },
      { id: "sc-admission", text: "An admission policy (Kyverno, Gatekeeper) enforces image and pod rules", why: "Policies in CI can be bypassed; admission control can't." },
      { id: "sc-gitops", text: "Deployments happen through GitOps, not kubectl from laptops", why: "Every change gets a reviewer and an audit trail; drift is reverted." },
    ],
  },
  {
    title: "Secrets",
    items: [
      { id: "sec-external", text: "Secrets come from an external manager (Vault, cloud secret store)", why: "Keeps secrets out of Git and out of manifests." },
      { id: "sec-rotation", text: "Secrets are rotated, and rotation is tested", why: "A secret that can't be rotated quickly turns a leak into a long incident." },
      { id: "sec-env", text: "Sensitive values are mounted as files rather than environment variables where possible", why: "Environment variables leak into logs, crash dumps, and child processes." },
    ],
  },
  {
    title: "Detection & response",
    items: [
      { id: "det-runtime", text: "Runtime threat detection is deployed (e.g. Falco)", why: "Detects shells in containers, unexpected processes, and sensitive file access." },
      { id: "det-alerts", text: "Alerts exist for RBAC changes, exec into pods, and failed auth spikes", why: "These are early signals of an attacker moving through the cluster." },
      { id: "det-backup", text: "Cluster state and volumes are backed up, and restores are tested", why: "Ransomware and accidental deletion both end at your last working restore." },
      { id: "det-runbook", text: "An incident runbook exists for a compromised workload", why: "Decide how to isolate and preserve evidence before you need to." },
    ],
  },
];

export const k8sChecklistCount = k8sChecklist.reduce((n, g) => n + g.items.length, 0);
