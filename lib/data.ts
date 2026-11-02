// Single source of truth for all site content and entity data.
// Sources: the live site (krishnaneupane.com) and Krishna's resume. Do not add claims that cannot be verified.

export const site = {
  name: "Krishna Neupane",
  logo: "कृष्ण",
  title: "Krishna Neupane — Senior DevSecOps Engineer & Applied Security Researcher",
  description:
    "Krishna Neupane is a Senior DevSecOps Engineer and Applied Security Researcher in Kathmandu, Nepal, with 9+ years in platform engineering, multi-cloud architecture, Kubernetes, and cloud security.",
  url: "https://krishnaneupane.com",
  // Shown only in security.txt (and used server-side by the contact form); everywhere else contact goes through /contact or Calendly.
  email: "neupane.krishna33@gmail.com",
  contactUrl: "https://krishnaneupane.com/contact",
  location: { city: "Kathmandu", country: "Nepal", countryCode: "NP" },
  locale: "en_US",
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research-core" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const secondaryNav = [
  { label: "Hire", href: "/hire" },
  { label: "Case studies", href: "/case-studies" },
  { label: "K8s security checklist", href: "/checklists/kubernetes-security" },
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
  { label: "Mantras", href: "/mantras" },
  { label: "Code Canvas", href: "/codecanvas" },
  { label: "Privacy", href: "/privacy" },
];

export const socials = {
  github: "https://github.com/krishna-commits",
  linkedin: "https://www.linkedin.com/in/krishna-neupane-50082091",
  researchgate: "https://www.researchgate.net/profile/Krishna-Neupane",
  orcid: "https://orcid.org/0009-0004-7787-1573",
  medium: "https://medium.com/@neupane.krishna33",
  devto: "https://dev.to/krishh11",
  calendly: "https://calendly.com/neupane-krishna33/30-minutes-meeting",
  instagram: "https://www.instagram.com/krishnasoulcode",
};

// Profiles that verify identity (used for schema.org sameAs).
export const sameAs = [socials.linkedin, socials.github, socials.researchgate, socials.orcid, socials.medium, socials.devto];

export const profile = {
  photo: { src: "/krishna-neupane.jpg", width: 600, height: 600, alt: "Portrait of Krishna Neupane" },
  jobTitle: "Senior DevSecOps Engineer",
  roles: ["Senior DevSecOps Engineer", "Applied Security Researcher"],
  headline: "Platform Engineering · Multi-Cloud Architecture · Cloud Security",
  yearsExperience: "9+",
  languages: ["English", "Nepali", "Hindi"],
  availability: "Open to senior DevSecOps and platform security roles, remote from Kathmandu, Nepal, working your team's hours.",
  // One-sentence positioning used in hero, meta, and llms.txt.
  positioning:
    "I design, secure, and operate cloud-native platforms: Kubernetes, GitOps, and infrastructure as code with security built into every stage of delivery.",
  bio: [
    "Krishna Neupane is a Senior DevSecOps Engineer and Applied Security Researcher based in Kathmandu, Nepal. He has 9+ years of experience leading platform engineering, cloud security, and DevSecOps transformation across AWS, Google Cloud, Azure, DigitalOcean, and Heroku.",
    "He is currently a Senior DevSecOps Engineer at Parkcity Technologies, where he leads multi-cloud platform engineering and DevSecOps for enterprise customers: Kubernetes platforms, GitOps with ArgoCD, infrastructure as code with Terraform and Terragrunt, observability, and cloud security controls. Before that he was a DevSecOps Engineer at BeyondID, an Okta Apex Partner, working on enterprise identity, Zero Trust, and cloud security in environments aligned with HIPAA and SOC 2. Earlier roles at a software services company and a nationwide internet provider grounded him in Kubernetes operations, CI/CD, and large-scale production infrastructure.",
    "His research focuses on continuous automation with DevOps practices for threat detection, the subject of his MSc in Information Technology and Applied Security from London Metropolitan University. He publishes applied engineering notes in Research Core and builds free tools for engineers, including DevOps World and Domain Search.",
  ],
};

// What he solves, phrased as outcomes. Each line is backed by the resume.
export const capabilities = [
  {
    title: "Platform engineering",
    body: "Enterprise Kubernetes platforms on EKS, GKE, and AKS, delivered through GitOps with ArgoCD and Helm, and built from reusable infrastructure-as-code patterns.",
  },
  {
    title: "Cloud security & DevSecOps",
    body: "Security automation, secrets management with Vault, vulnerability management, WAF and Zero Trust controls, in environments aligned with HIPAA and SOC 2.",
  },
  {
    title: "Migration & modernization",
    body: "Cloud migrations, Kubernetes lifecycle upgrades, database modernization, and resilient Multi-AZ architectures with disaster recovery, delivered with minimal production disruption.",
  },
  {
    title: "Observability & reliability",
    body: "Observability platforms with Prometheus, Grafana, Loki, Datadog, Signoz, ELK, and CloudWatch, plus SRE practices for incident response and operational standards.",
  },
];

export const expertise = [
  "Multi-Cloud Architecture",
  "Platform Engineering",
  "DevSecOps",
  "Cloud Security",
  "Kubernetes Administration",
  "Infrastructure as Code",
  "GitOps",
  "Cloud Migration & Modernization",
  "Disaster Recovery",
  "Database Modernization",
  "Observability Engineering",
  "Site Reliability Engineering",
  "Security Automation",
  "Identity & Access Management",
  "Zero Trust",
  "Cloud Governance",
];

// Figures shown on the homepage. Every figure links to its evidence: the site's core promise is "verified".
export const proof = [
  { value: "9+", label: "years in production infrastructure", href: "/about#experience" },
  { value: "5", label: "cloud platforms in production", href: "/about#stack" },
  { value: "4", label: "engineering organizations", href: "/about#experience" },
  { value: "10", label: "courses & certifications", href: "/about#certifications" },
  { value: "128+", label: "tools documented in DevOps World", href: "https://devops.krishnaneupane.com" },
];

// The delivery pipeline Krishna builds: each stage carries a security control. Tools are from his resume.
export const pipeline = [
  {
    label: "Commit",
    control: "branch policy · secrets",
    title: "Branch protection & secret scanning",
    detail: "Nothing reaches the default branch without review and passing checks. Secrets are caught before they enter history, because a leaked key in Git is leaked forever.",
    tools: ["GitHub", "GitLab", "Bitbucket"],
  },
  {
    label: "Build",
    control: "docker · pinned bases",
    title: "Reproducible, pinned artifacts",
    detail: "Images are built once from pinned base images and promoted unchanged through every environment, so what was tested is exactly what runs.",
    tools: ["Docker", "Helm", "GitHub Actions", "Jenkins"],
  },
  {
    label: "Scan",
    control: "sonarqube · owasp zap",
    title: "Quality and security gates that fail closed",
    detail: "Static analysis and dependency checks on every change, and dynamic testing against running environments. A gate that only reports is a dashboard; these block the pipeline.",
    tools: ["SonarQube", "SonarCloud", "OWASP ZAP", "Nessus"],
  },
  {
    label: "Provision",
    control: "terraform · terragrunt",
    title: "Reviewed infrastructure as code",
    detail: "Infrastructure changes follow the same path as code: a plan on every pull request, review of the plan, and applies only from the pipeline.",
    tools: ["Terraform", "Terragrunt", "CloudFormation"],
  },
  {
    label: "Deploy",
    control: "argocd · gitops",
    title: "GitOps: Git is the only way in",
    detail: "ArgoCD pulls the desired state from Git and reverts drift. Every production change has an author, a reviewer, and a diff. Secrets stay in Vault, never in the repo.",
    tools: ["ArgoCD", "Kubernetes", "HashiCorp Vault"],
  },
  {
    label: "Observe",
    control: "prometheus · loki",
    title: "Detection and response",
    detail: "Prevention eventually fails, so the last control is noticing fast: metrics, logs, and alerts tuned for security signals as well as uptime.",
    tools: ["Prometheus", "Grafana", "Loki", "Datadog"],
  },
];

// Working hours used by the time-zone overlap tool, in Kathmandu time (UTC+5:45, no daylight saving).
// Widen these if you're willing to overlap more with US or European teams.
// 0–24 = fully flexible: Krishna works whichever hours the team works.
export const workingHours = { start: 0, end: 24, timeZone: "Asia/Kathmandu", label: "flexible, aligned to your team's working day" };

// Attacks for the "Break the pipeline" demo. `blockedAt` is the index into `pipeline` of the stage that stops it.
export const attacks = [
  {
    id: "leaked-secret",
    name: "Leaked cloud key",
    vector: "A developer commits an AWS access key in a config file.",
    blockedAt: 0,
    how: "Secret scanning on push rejects the commit before it reaches the default branch, so the key never enters shared history.",
  },
  {
    id: "poisoned-image",
    name: "Tampered base image",
    vector: "An upstream image tag is re-pushed with a malicious layer.",
    blockedAt: 1,
    how: "Base images are pinned by digest, not mutable tag. The build pulls the exact image that was reviewed, so the re-pushed tag is never used.",
  },
  {
    id: "vulnerable-dependency",
    name: "Critical CVE in a dependency",
    vector: "A pull request upgrades a library to a version with a known critical vulnerability.",
    blockedAt: 2,
    how: "The scan stage's quality and dependency gates fail closed on high and critical findings, so the pipeline stops and the PR can't merge.",
  },
  {
    id: "open-security-group",
    name: "World-open security group",
    vector: "A Terraform change opens port 22 to 0.0.0.0/0.",
    blockedAt: 3,
    how: "Every infrastructure change produces a plan that's reviewed on the pull request, and applies only run from the pipeline. The risky diff is visible and blocked before apply.",
  },
  {
    id: "manual-drift",
    name: "Manual change in production",
    vector: "Someone runs kubectl edit on a production deployment.",
    blockedAt: 4,
    how: "ArgoCD continuously compares the cluster with Git and self-heals: the manual change is reverted automatically and shows up as drift.",
  },
  {
    id: "credential-stuffing",
    name: "Credential stuffing",
    vector: "A botnet replays leaked passwords against the login endpoint.",
    blockedAt: 5,
    how: "Prevention can't stop traffic that looks legitimate, so detection does: an alert on sustained authentication failures pages on-call, and WAF rules throttle the source.",
  },
];

// Recommendations from colleagues. Add real quotes only, with permission. The section stays hidden while empty.
export type Testimonial = { quote: string; name: string; title: string; company: string; url?: string };
export const testimonials: Testimonial[] = [];

// Draft principles: review and edit so they're in Krishna's own words before publishing.
export const principles = [
  { title: "Fail closed", body: "A control that can be skipped isn't a control. If a stage can't prove a change is safe, the change doesn't move." },
  { title: "Git is the source of truth", body: "Infrastructure and deployments are declared, reviewed, and versioned. If it isn't in Git, it isn't real." },
  { title: "Automate toil, review risk", body: "Machines do the repetitive work; people spend their attention on the changes that can hurt." },
  { title: "Not observable, not done", body: "A service ships with its dashboards, alerts, and runbook, or it hasn't shipped." },
];

export type DiagramStage = { label: string; items: string[] };
export type DiagramPlane = { label: string; items: string[] };
export type Diagram = { title: string; caption?: string; stages: DiagramStage[]; planes?: DiagramPlane[] };

// The platform pattern Krishna designs and operates (tools vary by client). Shown on /about.
export const referenceArchitecture: Diagram = {
  title: "Reference platform architecture",
  caption:
    "The platform pattern I design and operate. Exact tools vary by client; the principle doesn't: every path to production is automated, reviewed, and observable.",
  stages: [
    { label: "Source", items: ["GitHub", "GitLab", "Bitbucket"] },
    { label: "CI & gates", items: ["Build & test", "SonarQube", "OWASP ZAP"] },
    { label: "Infrastructure", items: ["Terraform", "Terragrunt", "CloudFormation"] },
    { label: "GitOps delivery", items: ["ArgoCD", "Helm"] },
    { label: "Runtime", items: ["EKS · GKE · AKS", "Multi-AZ"] },
    { label: "Observe", items: ["Prometheus", "Grafana · Loki", "Datadog"] },
  ],
  planes: [
    { label: "Security plane", items: ["HashiCorp Vault", "Cloudflare WAF", "IAM", "Zero Trust"] },
    { label: "Resilience plane", items: ["Backups", "Disaster recovery", "Incident runbooks"] },
  ],
};

export type Role = {
  title: string;
  company: string;
  // Confidential roles never render `company` anywhere public (pages, llms.txt, JSON-LD); a blurred placeholder shows instead.
  confidential?: boolean;
  context?: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, omitted = present
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    title: "Senior DevSecOps Engineer",
    company: "Parkcity Technologies",
    location: "Kathmandu, Nepal",
    start: "2024-05",
    summary:
      "Technical leadership for multi-cloud platform engineering and DevSecOps across AWS, GCP, DigitalOcean, and enterprise customer environments.",
    highlights: [
      "Lead the design and operation of enterprise Kubernetes platforms for highly available production services.",
      "Drive cloud migration, platform modernization, and infrastructure transformation for enterprise customers running mission-critical workloads.",
      "Lead GitOps adoption with ArgoCD, improving deployment reliability, change management, and platform governance.",
      "Establish infrastructure-as-code standards and reusable platform patterns with Terraform, Terragrunt, and CloudFormation.",
      "Implement Zero Trust networking, secrets management, platform hardening, and security automation with Cloudflare, Vault, IAM, and WAF.",
      "Lead Kubernetes upgrades, cluster lifecycle management, and database modernization; mentor engineers on platform and DevSecOps practice.",
    ],
    stack: ["Kubernetes", "ArgoCD", "Terraform", "Terragrunt", "Vault", "Cloudflare", "Datadog", "Signoz", "AWS", "GCP"],
  },
  {
    title: "DevSecOps Engineer",
    company: "BeyondID",
    context: "Okta Apex Partner",
    start: "2021-12",
    end: "2024-05",
    summary:
      "Enterprise identity, Zero Trust, and cloud security solutions for globally recognized organizations through Okta-focused delivery programs.",
    highlights: [
      "Designed and automated infrastructure provisioning with Terraform and Terragrunt for secure, identity-focused services.",
      "Built and maintained Kubernetes deployment platforms for highly available production workloads across AWS, Azure, GCP, and Heroku.",
      "Implemented DevSecOps controls: vulnerability management, infrastructure hardening, secrets management, and security automation.",
      "Contributed to environments aligned with HIPAA, SOC 2, and enterprise governance requirements.",
      "Developed observability with Prometheus, Grafana, Elasticsearch, Fluentd, Kibana, and Loki.",
    ],
    stack: ["Terraform", "Terragrunt", "Kubernetes", "Okta", "AWS", "Azure", "GCP", "Heroku", "Prometheus", "ELK"],
  },
  {
    title: "Software Engineer, DevOps",
    // Real name intentionally kept out of the codebase (it would otherwise ship in page source and JS bundles).
    company: "Software services company",
    confidential: true,
    context: "Software services company",
    location: "Kathmandu, Nepal",
    start: "2020-09",
    end: "2021-09",
    summary: "Cloud-native application delivery and Kubernetes platform operations for enterprise and healthcare technology products.",
    highlights: [
      "Built and maintained Kubernetes-based application platforms and containerized deployment environments.",
      "Managed CI/CD pipelines with Jenkins, Docker, and Bitbucket, and integrated code-quality controls into delivery.",
      "Managed backup, restoration, and disaster recovery for Kubernetes environments.",
      "Administered VMware infrastructure and Linux production systems; monitoring with Nagios and Zabbix.",
    ],
    stack: ["Kubernetes", "Docker", "Jenkins", "Bitbucket", "VMware", "Linux", "Zabbix"],
  },
  {
    title: "System Engineer",
    // Real name intentionally kept out of the codebase (it would otherwise ship in page source and JS bundles).
    company: "Nationwide internet service provider",
    confidential: true,
    context: "Nationwide internet service provider",
    location: "Lalitpur, Nepal",
    start: "2017-07",
    end: "2020-08",
    summary:
      "Cloud and on-premises infrastructure for a nationwide telecommunications and internet provider serving hundreds of thousands of subscribers.",
    highlights: [
      "Administered AWS services (ECS, EKS, Route 53, Auto Scaling, load balancers), Linux systems, and production infrastructure.",
      "Implemented CI/CD automation and infrastructure deployment workflows.",
      "Configured VPNs, firewalls, routers, switches, and network security controls.",
      "Built automation in Python and Bash; ran monitoring with Nagios, Cacti, and Zabbix.",
    ],
    stack: ["AWS", "Docker", "ECS", "EKS", "Linux", "Python", "Bash", "Networking"],
  },
];

export type Thesis = {
  slug: string;
  year: number;
  degree: string;
  title: string;
  institution: string;
  url?: string; // TODO: link to the ResearchGate / repository entry if public
};

export const theses: Thesis[] = [
  {
    slug: "msc-thesis-devops-continuous-threat-detection",
    year: 2023,
    degree: "MSc Information Technology and Applied Security",
    title: "Continuous Automation with DevOps Practices for Threat Detection",
    institution: "London Metropolitan University (delivered through Islington College)",
  },
  {
    slug: "bsc-thesis-wireless-hotspot",
    year: 2018,
    degree: "BSc Computer Networking and IT Security",
    title: "Wireless Hotspot: Current and Future Challenges",
    institution: "London Metropolitan University (delivered through Islington College)",
  },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  problem: string;
  audience: string;
  features: string[];
  tags: string[];
  href: string;
  monitor?: boolean; // false = leave off /status (e.g. URL not final)
  // Fill these in with real details; sections render only when present.
  engineering?: {
    architecture?: string;
    diagram?: Diagram;
    stack?: string[];
    security?: string;
    decisions?: string[];
    outcomes?: string[];
    repo?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "devops-world",
    title: "DevOps World",
    tagline: "Runbooks and deploy flows that map error symptoms to fix commands.",
    summary:
      "A field manual for DevOps engineers: 128+ tools and 23 runbooks with end-to-end deploy flows, install guides, YAML templates, incident runbooks, and snippets for Linux, Mac, and Windows.",
    problem:
      "During an incident, engineers search for the fix for a specific symptom, not a tool's documentation. DevOps World is organized around symptoms and flows so the path from error to fix command is short.",
    audience: "DevOps, platform, and SRE engineers deploying and operating production systems.",
    features: [
      "128+ tools documented",
      "23 incident runbooks",
      "End-to-end deploy flows mapping error symptoms to fix commands",
      "Install guides and YAML templates",
      "Snippets for Linux, Mac, and Windows",
    ],
    tags: ["DevOps", "Runbooks", "Kubernetes"],
    href: "https://devops.krishnaneupane.com",
    engineering: { repo: "https://github.com/krishna-commits/devops-course" },
  },
  {
    slug: "domain-search",
    title: "Domain Search",
    tagline: "Domain security analysis: DNS, SSL, and vulnerability checks in one scan.",
    summary:
      "A full-stack domain security analyzer that runs DNS, SSL, and vulnerability checks against a domain in a single scan.",
    problem:
      "Assessing a domain's security posture usually means running several separate tools. Domain Search brings the core checks together into one report.",
    audience: "Security engineers, sysadmins, and site owners auditing domains they operate.",
    features: ["DNS record checks", "SSL/TLS certificate checks", "Vulnerability checks", "Single-scan report"],
    tags: ["Security", "DNS", "Analysis"],
    href: "https://domain-search.krishnaneupane.com",
    engineering: { repo: "https://github.com/krishna-commits/domain-search" },
  },
  {
    slug: "tech-cheatsheet",
    title: "Tech Cheatsheet",
    tagline: "A centralized DevSecOps reference for 50+ tools and commands.",
    summary: "A single reference for the commands and patterns DevSecOps engineers reach for daily, covering 50+ tools.",
    problem: "Commands for dozens of tools are scattered across separate docs. The cheatsheet keeps the essentials in one searchable place.",
    audience: "Engineers working across the DevSecOps toolchain.",
    features: ["50+ tools and commands", "DevSecOps-focused reference"],
    tags: ["DevSecOps", "Reference", "Documentation"],
    href: "https://cheatsheet.krishnaneupane.com",
  },
  {
    slug: "cron-job-generator",
    title: "Cron Job Generator",
    tagline: "Turn schedules into correct cron expressions.",
    summary: "A live ops tool that converts schedules into cron expressions to reduce manual scheduling errors.",
    problem: "Hand-written cron expressions are easy to get wrong, and a wrong schedule fails quietly. The generator produces the expression from the intended schedule.",
    audience: "Engineers and operators scheduling recurring jobs.",
    features: ["Schedule-to-cron conversion", "Reduces manual scheduling errors"],
    tags: ["DevOps", "Automation", "Web App"],
    href: "https://cron-generator.krishnaneupane.com",
  },
  {
    slug: "grafana-dashboard",
    title: "Grafana Dashboard",
    tagline: "A public observability dashboard with importable panels.",
    summary: "A public Grafana dashboard with importable panels for production metrics.",
    problem: "Building useful dashboards from scratch is slow. Importable panels give teams a working starting point.",
    audience: "Teams setting up observability with Grafana.",
    features: ["Public dashboard", "Importable panels", "Production metrics"],
    tags: ["Grafana", "Monitoring", "Observability"],
    // TODO: paste the full public dashboard URL, then remove `monitor: false`
    href: "https://neupanekrishna33.grafana.net/public-dashboards/",
    monitor: false,
    engineering: { repo: "https://github.com/krishna-commits/grafana-dashboard" },
  },
];

// From the resume's Technical Expertise section.
export const techStack: Record<string, string[]> = {
  "Cloud platforms": ["AWS", "Microsoft Azure", "Google Cloud", "DigitalOcean", "Heroku"],
  "Containers & orchestration": ["Kubernetes (EKS, AKS, GKE)", "Docker", "Helm", "ECS"],
  "GitOps & platform": ["ArgoCD", "GitOps", "Helm", "Kubernetes platform operations"],
  "Infrastructure as code": ["Terraform", "Terragrunt", "AWS CloudFormation"],
  "CI/CD & automation": ["GitHub Actions", "GitLab CI/CD", "Jenkins", "Bitbucket Pipelines", "AWS CodeBuild", "AWS CodePipeline"],
  "Security & DevSecOps": ["HashiCorp Vault", "Cloudflare", "1Password", "SonarQube", "SonarCloud", "OWASP ZAP", "Nessus", "Burp Suite", "WAF", "IAM"],
  Observability: ["Prometheus", "Grafana", "Loki", "Datadog", "Signoz", "Elasticsearch", "Fluentd", "Fluent Bit", "Kibana", "Alertmanager", "CloudWatch"],
  Databases: ["MySQL", "PostgreSQL", "MongoDB", "DynamoDB", "Amazon RDS"],
  "Messaging & streaming": ["Kafka", "RabbitMQ", "Redis", "Valkey", "AWS SQS"],
  Serverless: ["AWS Lambda", "EventBridge", "Step Functions", "SNS", "DynamoDB Streams"],
  "Programming & scripting": ["Python", "Bash"],
  Networking: ["Load balancers", "VPN", "Firewalls", "WAF", "DNS", "Routing & switching", "SSL/TLS"],
  "Collaboration & agile": ["Jira", "Confluence", "Slack", "Microsoft Teams", "Scrum", "Kanban"],
};

export const education = [
  {
    degree: "MSc Information Technology and Applied Security",
    date: "2023-09",
    school: "Islington College",
    awardedBy: "London Metropolitan University",
  },
  {
    degree: "BSc Computer Networking and IT Security",
    date: "2018-09",
    school: "Islington College",
    awardedBy: "London Metropolitan University",
  },
];

export const volunteering = [
  { org: "Rotaract Club of Jawalakhel", role: "Secretary" },
  { org: "Leo Club of Samakhusi", role: "General Member" },
  { org: "Bishweshwor Sushila Foundation", role: "Program Manager" },
];

// Merged from the live site (6) and the resume (5, one overlapping). Add verification URLs (Credly etc.) when available.
export type Certification = { name: string; issuer?: string; date?: string; url?: string; featured?: boolean };

export const certifications: Certification[] = [
  { name: "Okta Certified Professional", issuer: "Okta", featured: true },
  { name: "OCNA Wireless", date: "2025-02" },
  { name: "AWS Security Incident Response: Cryptomining Use Cases", issuer: "Amazon Web Services", date: "2025-02" },
  { name: "AWS Knowledge: Architecting", issuer: "AWS Training and Certification", date: "2024-11" },
  { name: "Foundations of Cybersecurity", date: "2024-06" },
  { name: "AWS Cloud Practitioner Essentials", issuer: "Amazon Web Services", date: "2024-01" },
  { name: "ISC2 Candidate", issuer: "ISC2", date: "2024-01" },
  { name: "Google Cloud Fundamentals: Core Infrastructure", issuer: "Coursera" },
  { name: "AWS Fundamentals: Going Cloud-Native", issuer: "Coursera" },
  { name: "Networking in Google Cloud: Defining and Implementing Networks", issuer: "Coursera" },
];

export type ResearchItem = {
  slug: string;
  title: string;
  description: string;
  pillar: string;
  venue: string;
  year?: number;
  tags?: string[];
  featured?: boolean;
  // Set true once the article body is restored; until then the page is noindex and left out of the sitemap.
  published?: boolean;
};

export const pillars = [
  "Security Engineering",
  "Platform & Cloud",
  "Operations & Reliability",
  "Collaboration & Governance",
  "Learning & Roadmaps",
];

export const researchStart = [
  { title: "DevOps Learning Hub", description: "Phased roadmaps, tools, cloud labs, and interview prep.", slug: "devops-learning-hub" },
  { title: "DevOps Foundation Roadmap", description: "12 steps from Git to cloud delivery.", slug: "devops-learning-hub" },
  { title: "Senior Platform Gap Checklist", description: "Self-audit with saved scores for staff-level roles.", slug: "devops-learning-hub" },
];

export const research: ResearchItem[] = [
  { slug: "supply-chain-security", title: "Supply Chain Security", description: "Securing software dependencies, build pipelines, and third-party integrations.", pillar: "Security Engineering", venue: "Applied Research Notes", year: 2025, tags: ["SBOM", "SLSA", "Sigstore"] },
  { slug: "devsecops", title: "DevSecOps", description: "Security in CI/CD: shift-left controls and policy gates.", pillar: "Security Engineering", venue: "Applied Research Notes", year: 2025, featured: true },
  { slug: "zero-trust-architecture", title: "Zero Trust Architecture", description: "Identity-centric access, micro-segmentation, and continuous verification.", pillar: "Security Engineering", venue: "Cloud Architecture Research", year: 2025, featured: true },
  { slug: "kubernetes-security", title: "Kubernetes Security", description: "RBAC, pod security, admission control, and runtime detection.", pillar: "Security Engineering", venue: "Cloud Security Study", year: 2024, featured: true },
  { slug: "cspm", title: "Cloud Security Posture Management", description: "Misconfigurations and compliance drift across AWS, Azure, and GCP.", pillar: "Security Engineering", venue: "Cloud Security Study", year: 2024 },
  { slug: "incident-response", title: "Incident Response and Threat Detection", description: "Playbooks, detection pipelines, containment, and forensics.", pillar: "Security Engineering", venue: "Cyber Defense Study", year: 2024, featured: true },
  { slug: "cybersecurity", title: "CyberSecurity", description: "Network hardening, endpoint protection, and threat modeling.", pillar: "Security Engineering", venue: "Cyber Defense Study", year: 2024 },
  { slug: "security", title: "Security", description: "Static analysis, secrets management, Vault patterns, and secure SDLC.", pillar: "Security Engineering", venue: "Applied Research Notes", year: 2024, featured: true },
  { slug: "infrastructure-as-code", title: "Infrastructure as Code", description: "Terraform, Terragrunt, CloudFormation, state management, and policy scanning.", pillar: "Platform & Cloud", venue: "Cloud Architecture Research", year: 2024 },
  { slug: "cloud-platform", title: "Cloud Platform", description: "AWS, Azure, GCP, and Heroku architecture and governance.", pillar: "Platform & Cloud", venue: "Cloud Architecture Research", year: 2024 },
  { slug: "containerization", title: "Containerization and Orchestration", description: "Containers, images, and orchestration platforms.", pillar: "Platform & Cloud", venue: "Cloud Architecture Research", year: 2024 },
  { slug: "ci-cd-pipelines", title: "CI/CD Pipelines", description: "Jenkins and GitLab workflows.", pillar: "Platform & Cloud", venue: "Applied Research Notes", year: 2024, featured: true },
  { slug: "scripting", title: "Scripting", description: "Python and Bash automation for cloud operations and security checks.", pillar: "Platform & Cloud", venue: "Applied Research Notes" },
  { slug: "logging-and-monitoring", title: "Logging and Monitoring", description: "Elasticsearch, Prometheus, Grafana, Kafka, and alerting.", pillar: "Operations & Reliability", venue: "Applied Research Notes", year: 2024 },
  { slug: "sre", title: "SRE and Reliability Engineering", description: "Error budgets, SLOs, and chaos engineering.", pillar: "Operations & Reliability", venue: "Applied Research Notes", year: 2024 },
  { slug: "database", title: "Database", description: "MySQL, PostgreSQL, MongoDB, backups, and credential handling.", pillar: "Operations & Reliability", venue: "Applied Research Notes", year: 2024 },
  { slug: "linux", title: "Linux", description: "Systems administration and hardening on RHEL-aligned and cloud VMs.", pillar: "Operations & Reliability", venue: "Applied Research Notes", year: 2024 },
  { slug: "networking", title: "Networking", description: "Load balancing, firewalls, WAF, and secure connectivity.", pillar: "Operations & Reliability", venue: "Applied Research Notes", year: 2024 },
  { slug: "engineering-governance", title: "Engineering Governance", description: "RFC templates, Jira and Confluence workflows, and on-call norms.", pillar: "Collaboration & Governance", venue: "Collaboration Research", year: 2026 },
  { slug: "communication-and-collaboration", title: "Communication and Collaboration", description: "Slack, Jira, Confluence, Teams, and Zoom integrations.", pillar: "Collaboration & Governance", venue: "Collaboration Research", year: 2024 },
  { slug: "devops-learning-hub", title: "DevOps Learning Hub", description: "Curriculum for roadmaps, tools, cloud study plans, and career prep.", pillar: "Learning & Roadmaps", venue: "Applied Research Notes", year: 2026, featured: true },
];

export type Mantra = {
  slug: string;
  title: string;
  description: string;
  chapters: { title: string; lessons?: string[] }[];
};

export const mantras: Mantra[] = [
  {
    slug: "mind-body-and-code",
    title: "The series of connections - Mind, Body, and Code",
    description:
      "Why do physiology and spirituality seem so connected, and how does that connect with my work in technology?",
    chapters: [
      {
        title: "Chapter 1: Understanding 'Om'",
        lessons: ["The Echo Within – Understanding 'Om'", "The Science of Sound – 'Om' and Physiology"],
      },
      { title: "Chapter 2: Mantras" },
    ],
  },
  {
    slug: "vanaras",
    title: "Vanaras-The City Where I Lost Myself.",
    description: "Have I walked these same streets before, watching the same rituals centuries ago?",
    chapters: [{ title: "Chapter 1: Varanasi" }],
  },
];

// Plain-language facts, shown on /about and marked up as FAQPage for search and AI answers.
export const faq = [
  {
    q: "Who is Krishna Neupane?",
    a: "Krishna Neupane is a Senior DevSecOps Engineer and Applied Security Researcher based in Kathmandu, Nepal, with 9+ years of experience in platform engineering, multi-cloud architecture, Kubernetes, and cloud security. He is currently a Senior DevSecOps Engineer at Parkcity Technologies.",
  },
  {
    q: "What does Krishna Neupane specialize in?",
    a: "DevSecOps and platform engineering: enterprise Kubernetes platforms (EKS, GKE, AKS), GitOps with ArgoCD, infrastructure as code with Terraform and Terragrunt, cloud security and Zero Trust controls, observability, cloud migration, and disaster recovery across AWS, Google Cloud, Azure, DigitalOcean, and Heroku.",
  },
  {
    q: "What is Krishna Neupane's research about?",
    a: "His MSc research, 'Continuous Automation with DevOps Practices for Threat Detection' (London Metropolitan University, 2023), studies how DevOps automation can deliver continuous threat detection. He also publishes applied engineering notes in Research Core.",
  },
  {
    q: "Where has Krishna Neupane worked?",
    a: "Parkcity Technologies (Senior DevSecOps Engineer, 2024–present), BeyondID, an Okta Apex Partner (DevSecOps Engineer, 2021–2024), a software services company (Software Engineer, DevOps, 2020–2021), and a nationwide internet provider (System Engineer, 2017–2020).",
  },
  {
    q: "How can I contact Krishna Neupane?",
    a: "By booking a 30-minute call through Calendly, or through the contact form at krishnaneupane.com/contact. He is open to senior DevSecOps and platform security roles, working remotely from Kathmandu (UTC+5:45).",
  },
];

export function formatMonth(ym?: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatRange(start: string, end?: string) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

export const currentRole = experience[0];

/** Company name safe for public output: confidential roles fall back to their generic description. */
export function publicCompany(role: Role) {
  return role.confidential ? role.context ?? "Confidential" : role.company;
}

/** Years and organizations per technology, computed from `experience` (no self-rated skill bars). */
export function techExperience(limit = 12) {
  const now = new Date();
  const toDate = (ym: string) => new Date(`${ym}-01T00:00:00Z`);
  const byTool = new Map<string, { since: string; months: number; orgs: Set<string> }>();

  for (const role of experience) {
    const months = Math.max(1, Math.round(((role.end ? toDate(role.end) : now).getTime() - toDate(role.start).getTime()) / (30.44 * 86_400_000)));
    for (const tool of role.stack) {
      const entry = byTool.get(tool) ?? { since: role.start, months: 0, orgs: new Set<string>() };
      entry.months += months;
      entry.orgs.add(role.company);
      if (role.start < entry.since) entry.since = role.start;
      byTool.set(tool, entry);
    }
  }

  return [...byTool.entries()]
    .map(([tool, e]) => ({ tool, since: e.since.slice(0, 4), years: e.months / 12, orgs: e.orgs.size }))
    .sort((a, b) => b.years - a.years || b.orgs - a.orgs)
    .slice(0, limit);
}
