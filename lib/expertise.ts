// Engineering domains for /expertise. "inPractice" lines are drawn from the resume; "evidence" links only to
// things that exist on this site or in public (projects, architectures, case studies, published articles).

export type Evidence = { label: string; href: string; kind: "project" | "architecture" | "case study" | "article" | "tool" | "research" };

export type Domain = {
  slug: string;
  title: string;
  lede: string;
  why: string;
  problems: string[];
  technologies: string[];
  inPractice: string[];
  evidence: Evidence[];
};

export const domains: Domain[] = [
  {
    slug: "devops",
    title: "DevOps Engineering",
    lede: "Designing the delivery system itself: how a commit becomes a tested, versioned, running service, the same way every time.",
    why: "Delivery speed and stability are not a trade-off when the path to production is automated and repeatable. Manual steps are where both speed and safety are lost.",
    problems: [
      "Releases that depend on one person's laptop or memory",
      "Environments that drift apart until staging no longer predicts production",
      "Slow, flaky pipelines that teams learn to route around",
      "Infrastructure changes made by hand with no review or history",
    ],
    technologies: ["Jenkins", "GitHub Actions", "GitLab CI/CD", "Bitbucket Pipelines", "AWS CodeBuild / CodePipeline", "Docker", "Helm", "Terraform", "Terragrunt", "Python", "Bash"],
    inPractice: [
      "Established infrastructure-as-code standards and reusable Terraform and Terragrunt patterns across environments.",
      "Managed CI/CD pipelines with Jenkins, Docker, and Bitbucket, and automated build, test, and deployment workflows.",
      "Implemented CI/CD automation and infrastructure deployment workflows for a nationwide internet provider.",
    ],
    evidence: [
      { label: "DevOps World", href: "/projects/devops-world", kind: "project" },
      { label: "Secure CI/CD pipeline", href: "/architecture/secure-cicd", kind: "architecture" },
      { label: "Destroying all resources from the state file (Terraform)", href: "https://medium.com/@neupane.krishna33/destroying-all-resources-fromthe-state-file-terraform-d54a72418c3f", kind: "article" },
      { label: "Cron Job Generator", href: "/projects/cron-job-generator", kind: "tool" },
    ],
  },
  {
    slug: "devsecops",
    title: "DevSecOps Engineering",
    lede: "Moving security from a review at the end to a set of automated controls inside the delivery pipeline, so every change is checked the same way.",
    why: "Security that depends on a person remembering to check is applied inconsistently. Controls built into the pipeline run on every change and fail closed.",
    problems: [
      "Vulnerabilities discovered after release, when they are most expensive to fix",
      "Secrets committed to repositories or shared in chat",
      "Container images and dependencies nobody has scanned",
      "Audit and compliance evidence assembled by hand",
    ],
    technologies: ["SonarQube", "SonarCloud", "OWASP ZAP", "Nessus", "Burp Suite", "HashiCorp Vault", "1Password", "IAM", "WAF"],
    inPractice: [
      "Implemented DevSecOps controls: vulnerability management, infrastructure hardening, secrets management, and security automation.",
      "Integrated code-quality controls into software delivery pipelines.",
      "Contributed to environments aligned with HIPAA, SOC 2, and enterprise governance requirements.",
      "Implemented secrets management, platform hardening, and security automation with HashiCorp Vault, Cloudflare, IAM, and WAF.",
    ],
    evidence: [
      { label: "Secure CI/CD pipeline", href: "/architecture/secure-cicd", kind: "architecture" },
      { label: "Kubernetes security checklist", href: "/checklists/kubernetes-security", kind: "tool" },
      { label: "Domain Search", href: "/projects/domain-search", kind: "project" },
      { label: "Why mutual TLS authentication is important", href: "https://medium.com/@neupane.krishna33/why-mutual-tls-authentication-is-important-17087aa16e08", kind: "article" },
    ],
  },
  {
    slug: "cloud",
    title: "Cloud Engineering",
    lede: "Designing and operating cloud infrastructure that is resilient by default: networks, identity, compute, and data laid out so a single failure stays contained.",
    why: "Cloud makes infrastructure fast to create and just as fast to get wrong. Architecture, networking, and identity decisions made early determine cost, resilience, and security for years.",
    problems: [
      "Single-zone designs where one failure takes everything down",
      "Migrations between providers that risk data and downtime",
      "Networking and IAM sprawl that nobody can reason about",
      "Click-ops resources with no owner and no reproducible definition",
    ],
    technologies: ["AWS", "Google Cloud", "Microsoft Azure", "DigitalOcean", "Heroku", "EKS · GKE · AKS", "ECS", "Lambda", "RDS", "Route 53", "VPN", "Load balancers", "Terraform"],
    inPractice: [
      "Drive cloud migration, platform modernization, and infrastructure transformation for enterprise customers.",
      "Architected resilient Multi-AZ environments supporting business-critical applications and disaster recovery requirements.",
      "Administered AWS services (ECS, EKS, Route 53, Auto Scaling, load balancers) and production networking for a nationwide provider.",
    ],
    evidence: [
      { label: "DigitalOcean → EKS: fixing shared storage on Bottlerocket", href: "/case-studies/digitalocean-to-eks-bottlerocket-storage", kind: "case study" },
      { label: "Why NFS breaks on EKS Bottlerocket (and what we did instead)", href: "https://medium.com/@neupane.krishna33/why-nfs-breaks-on-eks-bottlerocket-and-what-we-did-instead-821458d30abe", kind: "article" },
      { label: "Multi-cloud infrastructure as code", href: "/architecture/multicloud-iac", kind: "architecture" },
      { label: "Rolling out GitOps across multi-cloud Kubernetes", href: "/case-studies/gitops-adoption-argocd", kind: "case study" },
    ],
  },
  {
    slug: "cloud-security",
    title: "Cloud Security",
    lede: "Making identity the perimeter: least-privilege access, segmented networks, and monitoring that turns security events into action.",
    why: "Most cloud incidents trace back to identity and configuration, not exotic exploits. Strong defaults and continuous detection close the gaps attackers actually use.",
    problems: [
      "Over-privileged roles and long-lived credentials",
      "Implicit trust inside the network",
      "Misconfigurations that drift in after the initial review",
      "Security events that are logged but never alerted on",
    ],
    technologies: ["IAM", "Okta", "Cloudflare Zero Trust", "WAF", "HashiCorp Vault", "CloudWatch", "Prometheus", "ELK"],
    inPractice: [
      "Implement cloud security controls and Zero Trust networking with Cloudflare, HashiCorp Vault, IAM, and WAF.",
      "Supported enterprise identity, Zero Trust, and cloud security programmes delivered through an Okta Apex Partner.",
      "MSc research on continuous automation with DevOps practices for threat detection.",
    ],
    evidence: [
      { label: "Zero Trust access", href: "/architecture/zero-trust", kind: "architecture" },
      { label: "Observability and threat detection", href: "/architecture/observability", kind: "architecture" },
      { label: "MSc research: DevOps automation for threat detection", href: "/about#research", kind: "research" },
      { label: "Importance of Okta for software companies", href: "https://medium.com/@neupane.krishna33/importance-of-okta-for-future-growth-of-software-companies-ce7d1580844d", kind: "article" },
    ],
  },
  {
    slug: "platform",
    title: "Platform Engineering",
    lede: "Building the paved road: Kubernetes platforms, GitOps delivery, and reusable patterns that let product teams ship safely without becoming infrastructure experts.",
    why: "Every team solving deployment, secrets, and observability on its own is slow and inconsistent. A shared platform makes the right way the easy way.",
    problems: [
      "Each team running its own deployment approach",
      "Kubernetes upgrades postponed until they become emergencies",
      "No audit trail for what changed in production",
      "Configuration drift between clusters and environments",
    ],
    technologies: ["Kubernetes (EKS, GKE, AKS)", "ArgoCD", "Helm", "GitOps", "Terraform", "Terragrunt", "Linux"],
    inPractice: [
      "Lead the design and operation of enterprise Kubernetes platforms for highly available production services.",
      "Lead GitOps adoption with ArgoCD, improving deployment reliability, change management, and platform governance.",
      "Lead Kubernetes upgrades and cluster lifecycle management.",
    ],
    evidence: [
      { label: "Rolling out GitOps across multi-cloud Kubernetes", href: "/case-studies/gitops-adoption-argocd", kind: "case study" },
      { label: "DigitalOcean → EKS: fixing shared storage on Bottlerocket", href: "/case-studies/digitalocean-to-eks-bottlerocket-storage", kind: "case study" },
      { label: "GitOps delivery on Kubernetes", href: "/architecture/gitops-k8s", kind: "architecture" },
      { label: "Kubernetes security checklist", href: "/checklists/kubernetes-security", kind: "tool" },
    ],
  },
  {
    slug: "sre",
    title: "Site Reliability Engineering",
    lede: "Running production with evidence: metrics, logs, and alerts that show what users experience, and runbooks that make recovery routine.",
    why: "You can't improve reliability you can't see. Observability turns incidents from guesswork into a sequence of checks, and turns lessons into prevention.",
    problems: [
      "Finding out about outages from customers",
      "Dashboards nobody looks at and alerts nobody trusts",
      "Backups that have never been restored",
      "Incidents that recur because nothing changed afterwards",
    ],
    technologies: ["Prometheus", "Alertmanager", "Grafana", "Loki", "Datadog", "Signoz", "Elasticsearch", "Fluentd / Fluent Bit", "Kibana", "CloudWatch", "Nagios", "Zabbix"],
    inPractice: [
      "Design and operate observability platforms with Prometheus, Grafana, Datadog, Loki, Signoz, Elasticsearch, and CloudWatch.",
      "Establish operational standards for monitoring, disaster recovery, backup, resilience, and incident response.",
      "Managed backup, restoration, and disaster recovery for Kubernetes environments.",
    ],
    evidence: [
      { label: "Observability and threat detection", href: "/architecture/observability", kind: "architecture" },
      { label: "Grafana Dashboard", href: "/projects/grafana-dashboard", kind: "project" },
      { label: "Grafana dashboard for AWS billing monitoring", href: "https://towardsdev.com/grafana-dashboard-fb2bb13a365a", kind: "article" },
      { label: "Live system status", href: "/status", kind: "tool" },
    ],
  },
];
