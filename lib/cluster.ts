import { techExperience } from "@/lib/data";

// Technical capabilities, presented as namespaces in a cluster. Every tool is from the resume.
export type Pod = { name: string; image: string; purpose: string; match?: string };
export type Namespace = { name: string; title: string; summary: string; pods: Pod[] };

export const namespaces: Namespace[] = [
  {
    name: "cloud",
    title: "Cloud Infrastructure",
    summary: "Multi-cloud architecture, migration, and Multi-AZ resilience.",
    pods: [
      { name: "aws", image: "eks · ecs · rds · lambda · iam", purpose: "Primary cloud since 2017: EKS, ECS, RDS, Lambda, IAM, Route 53, and networking.", match: "AWS" },
      { name: "gcp", image: "gke · cloud networking", purpose: "GKE and multi-cloud platform engineering for enterprise customers.", match: "GCP" },
      { name: "azure", image: "aks", purpose: "AKS and identity-focused services in multi-cloud environments.", match: "Azure" },
      { name: "digitalocean", image: "doks · droplets", purpose: "Customer platforms on DigitalOcean alongside AWS and GCP." },
      { name: "heroku", image: "dynos · pipelines", purpose: "Application platforms for identity-focused services.", match: "Heroku" },
    ],
  },
  {
    name: "automation",
    title: "DevOps & Automation",
    summary: "Infrastructure as code and CI/CD with security gates built in.",
    pods: [
      { name: "terraform", image: "hashicorp/terraform", purpose: "Every cloud resource declared, planned on pull requests, and applied from the pipeline.", match: "Terraform" },
      { name: "terragrunt", image: "gruntwork/terragrunt", purpose: "DRY multi-account and multi-environment layouts.", match: "Terragrunt" },
      { name: "jenkins", image: "jenkins/jenkins", purpose: "Build, test, and deploy pipelines with code-quality gates.", match: "Jenkins" },
      { name: "github-actions", image: "actions/runner", purpose: "CI with security gates and OIDC to cloud, so no long-lived keys." },
      { name: "gitlab-ci", image: "gitlab/runner", purpose: "Pipelines and environments for GitLab-hosted teams." },
      { name: "python", image: "python · bash", purpose: "Automation, tooling, and security checks.", match: "Python" },
    ],
  },
  {
    name: "security",
    title: "DevSecOps & Security",
    summary: "Secrets, scanning, identity, and Zero Trust controls.",
    pods: [
      { name: "vault", image: "hashicorp/vault", purpose: "Secrets management, injected at runtime and never stored in Git.", match: "Vault" },
      { name: "1password", image: "1password/connect", purpose: "Team credential management and secret sharing." },
      { name: "sonarqube", image: "sonarsource/sonarqube", purpose: "Static analysis quality gates that fail the pipeline." },
      { name: "owasp-zap", image: "zaproxy/zap", purpose: "Dynamic testing against running environments." },
      { name: "cloudflare", image: "waf · zero trust", purpose: "DNS, WAF, and Zero Trust access at the edge.", match: "Cloudflare" },
      { name: "okta", image: "identity · zero trust", purpose: "Enterprise identity and Zero Trust through an Okta Apex Partner.", match: "Okta" },
    ],
  },
  {
    name: "kubernetes",
    title: "Kubernetes & Orchestration",
    summary: "Enterprise clusters, upgrades, and lifecycle management.",
    pods: [
      { name: "kubernetes", image: "eks · gke · aks", purpose: "Highly available production clusters; upgrades, hardening, and lifecycle management.", match: "Kubernetes" },
      { name: "helm", image: "helm/helm", purpose: "Packaging and versioning workloads across environments." },
      { name: "docker", image: "docker/engine", purpose: "Reproducible container builds from pinned base images.", match: "Docker" },
      { name: "ecs", image: "aws/ecs", purpose: "Container workloads on AWS where Kubernetes isn't needed.", match: "ECS" },
    ],
  },
  {
    name: "platform",
    title: "Platform Engineering",
    summary: "GitOps delivery, reusable patterns, and engineering standards.",
    pods: [
      { name: "argocd", image: "argoproj/argocd", purpose: "GitOps delivery: Git is the only way into production, and drift is reverted.", match: "ArgoCD" },
      { name: "gitops", image: "pull-based delivery", purpose: "Reviewed, auditable deployments with automated reconciliation." },
      { name: "iac-patterns", image: "reusable modules", purpose: "Reusable infrastructure patterns and standards across environments." },
      { name: "linux", image: "rhel · ubuntu", purpose: "Hardened production systems administration since 2017.", match: "Linux" },
      { name: "macos", image: "workstation", purpose: "Daily workstation for terminal, kubectl, and IaC tooling." },
    ],
  },
  {
    name: "observability",
    title: "SRE & Observability",
    summary: "Metrics, logs, alerting, and incident response.",
    pods: [
      { name: "prometheus", image: "prom/prometheus", purpose: "Metrics and alerting, including security signals.", match: "Prometheus" },
      { name: "grafana", image: "grafana/grafana", purpose: "Dashboards for production health and cost visibility." },
      { name: "loki", image: "grafana/loki", purpose: "Log aggregation for incident response." },
      { name: "datadog", image: "datadog/agent", purpose: "APM and infrastructure monitoring.", match: "Datadog" },
      { name: "signoz", image: "signoz/signoz", purpose: "OpenTelemetry-native tracing and metrics.", match: "Signoz" },
    ],
  },
];

/** Years of production use from real work history, e.g. "4+ yrs"; "—" when the tool isn't tied to a dated role. */
export function podAge(pod: Pod) {
  if (!pod.match) return "—";
  const row = techExperience(100).find((t) => t.tool === pod.match);
  if (!row) return "—";
  return row.years >= 1 ? `${Math.floor(row.years)}+ yrs` : "<1 yr";
}

export const podCount = namespaces.reduce((n, ns) => n + ns.pods.length, 0);
