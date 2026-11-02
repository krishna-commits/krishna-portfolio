import type { Diagram } from "@/lib/data";

// Reference architectures for the Architecture Laboratory. Each reflects a pattern from Krishna's resume;
// they are generalized designs, not diagrams of a specific client's system.
export type Architecture = Diagram & { id: string; tab: string; summary: string; decisions: string[] };

export const architectures: Architecture[] = [
  {
    id: "secure-cicd",
    tab: "Secure CI/CD",
    title: "Secure CI/CD pipeline",
    summary: "Every change passes static, dependency, and dynamic checks before an immutable, pinned artifact is promoted through GitOps.",
    stages: [
      { label: "Commit", items: ["Branch protection", "Secret scanning"] },
      { label: "Build", items: ["Pinned base images", "Build once"] },
      { label: "Gates", items: ["SonarQube", "Dependency audit", "OWASP ZAP"] },
      { label: "Registry", items: ["Immutable tags", "Digest pinning"] },
      { label: "Deploy", items: ["ArgoCD", "Env promotion"] },
    ],
    planes: [{ label: "Security plane", items: ["Vault secrets", "OIDC to cloud", "No long-lived CI keys"] }],
    decisions: [
      "Gates fail closed: a report nobody reads isn't a control.",
      "The artifact tested in staging is byte-for-byte the one in production.",
      "CI never holds cluster credentials; GitOps pulls instead of CI pushing.",
    ],
  },
  {
    id: "gitops-k8s",
    tab: "GitOps on Kubernetes",
    title: "GitOps delivery on Kubernetes",
    summary: "Application and environment repos are separated; ArgoCD reconciles clusters to Git continuously and reverts drift.",
    stages: [
      { label: "App repo", items: ["Code + Dockerfile", "PR review"] },
      { label: "CI", items: ["Build & scan", "Push image"] },
      { label: "Env repo", items: ["Helm values", "Per-env overlays"] },
      { label: "ArgoCD", items: ["Auto-sync", "Self-heal"] },
      { label: "Clusters", items: ["EKS · GKE · AKS", "Multi-AZ"] },
    ],
    planes: [{ label: "Access plane", items: ["SSO to clusters", "Namespace RBAC", "Audit trail per change"] }],
    decisions: [
      "Separate app and environment repos so promotions are explicit, reviewable commits.",
      "self-heal on in production: the reviewed state is always the running state.",
      "Cluster upgrades follow a runbook: one minor version at a time, staging first.",
    ],
  },
  {
    id: "multicloud-iac",
    tab: "Multi-cloud IaC",
    title: "Multi-cloud infrastructure as code",
    summary: "Reusable Terraform modules composed per environment with Terragrunt; every change is a reviewed plan applied only from the pipeline.",
    stages: [
      { label: "Modules", items: ["Terraform", "Versioned"] },
      { label: "Environments", items: ["Terragrunt", "dev · stage · prod"] },
      { label: "Plan", items: ["On every PR", "Posted for review"] },
      { label: "Apply", items: ["Pipeline only", "Short-lived creds"] },
      { label: "Clouds", items: ["AWS · GCP", "DigitalOcean"] },
    ],
    planes: [{ label: "State plane", items: ["Remote state", "Encrypted", "Locked"] }],
    decisions: [
      "Reviewers approve the plan, not the intent.",
      "Modules are versioned so environments upgrade deliberately, not accidentally.",
      "No applies from laptops; credentials are short-lived and pipeline-scoped.",
    ],
  },
  {
    id: "observability",
    tab: "Observability & detection",
    title: "Observability and threat detection",
    summary: "Metrics, logs, and traces flow into one place, with alerts for security signals as well as availability.",
    stages: [
      { label: "Sources", items: ["Apps", "Kubernetes", "Cloud logs"] },
      { label: "Collect", items: ["Prometheus", "Fluent Bit"] },
      { label: "Store", items: ["Loki", "Elasticsearch"] },
      { label: "Visualize", items: ["Grafana", "Datadog"] },
      { label: "Respond", items: ["Alertmanager", "Runbooks"] },
    ],
    planes: [{ label: "Detection plane", items: ["Auth-failure spikes", "Unexpected egress", "Out-of-band deploys"] }],
    decisions: [
      "Alert on symptoms users feel, plus a small set of high-signal security events.",
      "Every alert links to a runbook; an alert without an action is noise.",
      "This is the theme of the MSc research: automation for continuous threat detection.",
    ],
  },
  {
    id: "zero-trust",
    tab: "Zero Trust access",
    title: "Zero Trust access",
    summary: "Identity, not network location, decides access: SSO with MFA, an identity-aware edge, and least-privilege policies per service.",
    stages: [
      { label: "User", items: ["Device", "Browser / CLI"] },
      { label: "Identity", items: ["Okta SSO", "MFA"] },
      { label: "Edge", items: ["Cloudflare Zero Trust", "WAF"] },
      { label: "Policy", items: ["Per-app rules", "Least privilege"] },
      { label: "Services", items: ["Internal apps", "Clusters"] },
    ],
    planes: [{ label: "Assurance plane", items: ["Audit logs", "Session limits", "Continuous verification"] }],
    decisions: [
      "No implicit trust from being 'inside' the network.",
      "Access is granted per application, per identity, and reviewed.",
      "Built on enterprise identity work with an Okta Apex Partner.",
    ],
  },
];
