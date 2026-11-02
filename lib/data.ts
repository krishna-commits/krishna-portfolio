// Single source of truth for all site content and entity data.
// Sources: the live site (krishnaneupane.com) and Krishna's resume. Do not add claims that cannot be verified.

export const site = {
  name: "Krishna Neupane",
  logo: "कृष्ण",
  title: "Krishna Neupane — Senior DevSecOps Engineer & Applied Security Researcher",
  description:
    "Krishna Neupane is a Senior DevSecOps Engineer and Applied Security Researcher in Kathmandu, Nepal, with 9+ years in platform engineering, multi-cloud architecture, Kubernetes, and cloud security.",
  url: "https://krishnaneupane.com",
  // No email address in the code (the repo is public). Contact goes through /contact, which delivers to the
  // CONTACT_TO_EMAIL environment variable, or Calendly.
  contactUrl: "https://krishnaneupane.com/contact",
  location: { city: "Kathmandu", country: "Nepal", countryCode: "NP" },
  locale: "en_US",
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Expertise", href: "/expertise" },
  { label: "Work", href: "/case-studies" },
  { label: "Lab", href: "/lab" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const secondaryNav = [
  { label: "Projects", href: "/projects" },
  { label: "Research Core", href: "/research-core" },
  { label: "Verify this site", href: "/verify" },
  { label: "Decisions (ADRs)", href: "/decisions" },
  { label: "Threat model", href: "/threat-model" },
  { label: "Hire", href: "/hire" },
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
  // The value proposition: one sentence, used as the hero statement.
  statement: "I build cloud platforms where the secure path is also the fastest one.",
  // One-sentence positioning used in the hero, meta, and llms.txt.
  positioning:
    "Nine years designing, automating, and operating infrastructure across AWS, Google Cloud, Azure, and DigitalOcean: Kubernetes platforms, GitOps delivery, and infrastructure as code, with security engineered into every stage from commit to production.",
  // Third-person biography: the canonical description reused by search engines and AI systems.
  bio: [
    "Krishna Neupane is a Senior DevSecOps Engineer and Applied Security Researcher based in Kathmandu, Nepal. He designs, secures, and operates cloud-native platforms across AWS, Google Cloud, Azure, DigitalOcean, and Heroku, with more than nine years in production infrastructure.",
    "At Parkcity Technologies he leads and manages a team of 5–6 engineers responsible for multi-cloud platform engineering and DevSecOps, operating more than 10 Kubernetes clusters that run 300+ services at 99.99% uptime, with GitOps delivery through ArgoCD, infrastructure as code with Terraform and Terragrunt, observability, and cloud security controls. Before that, at BeyondID, an Okta Apex Partner, he worked on enterprise identity, Zero Trust, and cloud security in environments aligned with HIPAA and SOC 2. Earlier roles, at a software services company and at a nationwide internet provider, grounded his work in Kubernetes operations, CI/CD, networking, and large-scale Linux and AWS infrastructure.",
    "His MSc research at London Metropolitan University studied continuous automation with DevOps practices for threat detection. He writes about production engineering and builds free tools for engineers, including DevOps World and Domain Search.",
  ],
};

// First-person narrative for the About page. Factual: every claim maps to the resume or the site.
export const aboutStory = [
  {
    heading: "Where I started",
    body: [
      "My career began in 2017 as a system engineer at a nationwide internet service provider, running the cloud and on-premises infrastructure behind service for hundreds of thousands of subscribers. The work spanned AWS, Linux, VPNs, firewalls, routing, and monitoring, and it taught me to treat every change to production as something that has to be reversible.",
      "From there I moved into DevOps at a software services company, building Kubernetes platforms and CI/CD pipelines for enterprise and healthcare products, including backup, restore, and disaster recovery for those clusters.",
    ],
  },
  {
    heading: "Where security became central",
    body: [
      "At BeyondID, an Okta Apex Partner, I worked on identity, Zero Trust, and cloud security for globally recognised organisations, in environments aligned with HIPAA and SOC 2. That role shaped how I build: identity is the perimeter, and security controls belong inside the automation, not after it.",
    ],
  },
  {
    heading: "What I do now",
    body: [
      "Today, as a Senior DevSecOps Engineer at Parkcity Technologies, I lead and manage a team of 5–6 engineers running multi-cloud platform engineering across AWS, GCP, and DigitalOcean. Together we operate more than 10 Kubernetes clusters hosting 300+ services at 99.99% uptime for products used by more than 10 million people, lead GitOps adoption with ArgoCD, set infrastructure-as-code standards, and lead Kubernetes upgrades and migrations, most recently from 1.33 to 1.35. Cost is part of the job too: for one customer I brought monthly cloud spend down from over $19K to $12K, a saving of roughly $84K a year.",
    ],
  },
  {
    heading: "How I approach problems",
    body: [
      "I start with what failure would look like, then work backwards: which control would have caught it, where that control should live, and how to make it automatic. I prefer boring, reviewable systems over clever ones, and I measure success by how uneventful production becomes.",
    ],
  },
  {
    heading: "Research and what's next",
    body: [
      "My MSc research looked at how DevOps automation can deliver continuous threat detection in cloud environments. That question still drives my work: how to make detection and response part of the platform rather than a separate project.",
      "I'm looking for a senior DevSecOps or platform engineering role with a team that treats reliability and security as engineering problems, working remotely on that team's hours.",
    ],
  },
];

// Technical writing, curated from Medium and DEV (personal essays excluded). Titles preserved as published.
export type Publication = { title: string; date: string; domain: string; summary: string; href: string; featured?: boolean };
export const publications: Publication[] = [
  {
    title: "Why NFS Breaks on EKS Bottlerocket (and What We Did Instead)",
    date: "2026-06-17",
    domain: "Kubernetes · Cloud migration",
    summary: "Why legacy NFS mounts fail on Bottlerocket nodes during a DigitalOcean-to-EKS migration, and the OpenEBS and CSI NFS driver setup used instead.",
    href: "https://medium.com/@neupane.krishna33/why-nfs-breaks-on-eks-bottlerocket-and-what-we-did-instead-821458d30abe",
    featured: true,
  },
  {
    title: "Destroying all resources fromthe state file (Terraform)",
    date: "2025-07-14",
    domain: "Infrastructure as code",
    summary: "Running a Terraform destroy from a state file alone, with a minimal AWS provider configuration.",
    href: "https://medium.com/@neupane.krishna33/destroying-all-resources-fromthe-state-file-terraform-d54a72418c3f",
  },
  {
    title: "Importance of Okta for Future Growth of Software Companies",
    date: "2024-03-24",
    domain: "Identity & access",
    summary: "How identity and access management with Okta supports security, regulatory compliance, and operational efficiency.",
    href: "https://medium.com/@neupane.krishna33/importance-of-okta-for-future-growth-of-software-companies-ce7d1580844d",
  },
  {
    title: "Grafana Dashboard For AWS Billing Monitor",
    date: "2024-03-22",
    domain: "Observability · Cost",
    summary: "A Grafana dashboard for monitoring AWS billing, with three ways to import it.",
    href: "https://towardsdev.com/grafana-dashboard-fb2bb13a365a",
  },
  {
    title: "Why Mutual TLS Authentication is Important ?",
    date: "2024-03-20",
    domain: "Security",
    summary: "How mutual TLS verifies both client and server certificates, and where it reduces unauthorised access.",
    href: "https://medium.com/@neupane.krishna33/why-mutual-tls-authentication-is-important-17087aa16e08",
  },
  {
    title: "Docker Cheatsheet",
    date: "2024-06-11",
    domain: "Containers · Reference",
    summary: "A reference of common Docker and Docker Compose commands for containers, images, networking, volumes, and Swarm.",
    href: "https://medium.com/@neupane.krishna33/docker-cheatsheet-797143be1936",
  },
];

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
  { value: "10+", label: "Kubernetes clusters operated", href: "/about#experience" },
  { value: "300+", label: "services in production", href: "/about#experience" },
  { value: "10M+", label: "end users on the platforms I run", href: "/about#experience" },
  { value: "99.99%", label: "platform uptime", href: "/about#experience" },
  { value: "$84K+", label: "yearly cloud savings for one customer", href: "/about#experience" },
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
// Excerpts are quoted verbatim from LinkedIn recommendations (trimmed with "…", never reworded); dates shown for honesty.
export type Testimonial = { quote: string; name: string; title: string; relation: string; date: string; url?: string };
export const testimonials: Testimonial[] = [
  {
    quote:
      "He enjoys doing things differently with some research and sophisticated approach. He is a person of quality work, focus and one of a passionate individual who gets thrilled to learn new skills and keep up to date with the technological trend.",
    name: "Sandip Lamichhane",
    title: "ICT and Network Support, Adcorp Computers",
    relation: "Worked together at different companies",
    date: "2020-03",
  },
  {
    quote: "Krishna is an individual with good communication skills… Krishna gains highest recommendation in his Network and Security skills and his interest in DevOps.",
    name: "Bikash Bhandari",
    title: "Founder & CTO · Platform Engineering, SRE, Kubernetes",
    relation: "Worked together on the same team",
    date: "2021-01",
  },
];

// Engineering philosophy: principles, not claims of accomplishment.
export const principles = [
  { title: "Security belongs in the workflow", body: "Controls run inside the pipeline on every change and fail closed. A check that depends on someone remembering it is applied inconsistently." },
  { title: "Infrastructure is reproducible", body: "Everything is declared in code, reviewed, and versioned. If an environment can't be rebuilt from Git, it can't be trusted." },
  { title: "Design for failure", body: "Multi-AZ layouts, tested restores, and runbooks are part of the design, not an afterthought, because something always fails eventually." },
  { title: "Platforms serve developers", body: "The secure, standard path should also be the easiest one. A platform succeeds when teams choose it, not when they're forced onto it." },
  { title: "Observability drives decisions", body: "Metrics, logs, and traces exist to answer questions during an incident and to show whether a change actually helped." },
  { title: "Keep it boring and measurable", body: "Prefer simple, maintainable systems with clear owners and numbers that show they work over clever ones nobody can operate." },
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
  // Measurable results, shown as stat chips on the homepage, About, /hire, and the resume.
  // Fill with real, defensible numbers only, e.g. { value: "~40", label: "services moved to GitOps" }.
  impact?: { value: string; label: string }[];
};

export const experience: Role[] = [
  {
    title: "Senior DevSecOps Engineer",
    company: "Parkcity Technologies",
    location: "Kathmandu, Nepal",
    start: "2024-05",
    summary:
      "Lead and manage a team of 5–6 engineers delivering multi-cloud platform engineering and DevSecOps across AWS, GCP, DigitalOcean, and enterprise customer environments.",
    highlights: [
      "Lead and manage a team of 5–6 engineers, owning priorities, delivery, and quality from design to production.",
      "Operate 10+ production Kubernetes clusters running 300+ services at 99.99% uptime across AWS, GCP, and DigitalOcean, for customer products with more than 10 million users.",
      "Lead Kubernetes upgrades and cluster lifecycle management, most recently 1.33 → 1.35, along with database modernization.",
      "Reduced one customer's monthly cloud spend from $19K+ to $12K (~37%, about $84K a year) through infrastructure right-sizing and optimization.",
      "Lead GitOps adoption with ArgoCD, improving deployment reliability, change management, and platform governance.",
      "Drive cloud migrations, including DigitalOcean to Amazon EKS on Bottlerocket with a shared-storage redesign that required no application changes.",
      "Establish infrastructure-as-code standards and reusable patterns with Terraform, Terragrunt, and CloudFormation.",
      "Implement Zero Trust networking, secrets management, platform hardening, and security automation with Cloudflare, Vault, IAM, and WAF.",
    ],
    stack: ["Kubernetes", "ArgoCD", "Terraform", "Terragrunt", "Vault", "Cloudflare", "Datadog", "Signoz", "AWS", "GCP"],
    impact: [
      { value: "5–6", label: "engineers led and managed" },
      { value: "10+", label: "Kubernetes clusters" },
      { value: "300+", label: "services in production" },
      { value: "10M+", label: "end users on the platforms we run" },
      { value: "99.99%", label: "uptime" },
      { value: "$84K+/yr", label: "cloud savings for one customer ($19K → $12K/mo)" },
      { value: "v1.35", label: "Kubernetes, upgraded from v1.33" },
    ],
  },
  {
    title: "DevSecOps Engineer",
    company: "BeyondID",
    context: "Okta Apex Partner",
    start: "2021-12",
    end: "2024-05",
    summary:
      "Enterprise identity, Zero Trust, and cloud security solutions for globally recognized organizations through Okta-focused delivery programs.",
    impact: [
      { value: "5", label: "environment tiers: dev, QA, UAT, MVP, prod" },
      { value: "4", label: "clouds: AWS, GCP, DigitalOcean, Heroku" },
    ],
    highlights: [
      "Designed and automated infrastructure provisioning with Terraform and Terragrunt for secure, identity-focused services.",
      "Ran dev, QA, UAT, MVP, and production environments across AWS, GCP, DigitalOcean, and Heroku, plus Azure on one client project.",
      "Built and maintained Kubernetes deployment platforms for highly available production workloads.",
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

// What "senior" looks like in practice. Every item is backed by a resume bullet.
export const leadership = [
  {
    title: "Technical direction",
    body: "Provide technical leadership for multi-cloud platform engineering and DevSecOps across AWS, GCP, DigitalOcean, and enterprise customer environments.",
  },
  {
    title: "Standards that scale",
    body: "Established infrastructure-as-code standards and reusable Terraform and Terragrunt patterns, so environments are consistent across teams and customers.",
  },
  {
    title: "Leading adoption",
    body: "Led GitOps adoption with ArgoCD: delivery model, repository structure, and governance, improving deployment reliability and change management.",
  },
  {
    title: "Operational excellence",
    body: "Set operational standards for monitoring, disaster recovery, backup, security, resilience, and incident response.",
  },
  {
    title: "Team leadership",
    body: "Lead and manage a team of 5–6 engineers: setting priorities, owning delivery from design to production, and building Platform Engineering, GitOps, and SRE practices into how the team works.",
  },
  {
    title: "Stakeholder partnership",
    body: "Work with engineering leadership, security teams, and business stakeholders to turn requirements into secure, scalable platforms.",
  },
];

// Recruiter-facing logistics. Only fields with a value render; fill the commented ones to show them.
export const hiringLogistics: { label: string; value: string }[] = [
  { label: "Roles", value: "Senior / Lead DevSecOps, Platform, Cloud Security, SRE" },
  { label: "Location", value: "Remote from Kathmandu, Nepal (UTC+5:45)" },
  { label: "Engagement", value: "Full-time or contract" },
  { label: "Notice period", value: "30 days" },
  { label: "Relocation", value: "Open to relocation worldwide" },
  { label: "Working hours", value: "Flexible: full overlap with US, European, and APAC teams" },
  { label: "Languages", value: "English, Nepali, Hindi" },
];

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
