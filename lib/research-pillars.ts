/**
 * Research Core pillar taxonomy — folder slugs match content/research-core/*
 */
export const RESEARCH_PILLARS = [
	{
		slug: "01-security-engineering",
		title: "Security Engineering",
		order: 1,
		description:
			"DevSecOps, zero trust, Kubernetes security, incident response, supply chain assurance, and cloud posture management.",
	},
	{
		slug: "02-platform-cloud",
		title: "Platform & Cloud",
		order: 2,
		description:
			"Multi-cloud architecture, containers, CI/CD automation, infrastructure as code, and scripting for platform teams.",
	},
	{
		slug: "03-operations-reliability",
		title: "Operations & Reliability",
		order: 3,
		description:
			"Linux systems, networking, databases, observability stacks, and SRE practices for resilient production systems.",
	},
	{
		slug: "04-collaboration-governance",
		title: "Collaboration & Governance",
		order: 4,
		description:
			"Team tooling, communication platforms, and engineering governance patterns for distributed organizations.",
	},
	{
		slug: "05-learning-and-roadmaps",
		title: "Learning & Roadmaps",
		order: 5,
		description:
			"Curated DevSecOps learning paths, tool guides, certification maps, and interview preparation — written for this portfolio.",
	},
] as const

export type ResearchPillarSlug = (typeof RESEARCH_PILLARS)[number]["slug"]

/** Legacy top-level folder → new path under pillar */
export const RESEARCH_CORE_REDIRECTS: { source: string; destination: string }[] = [
	{ source: "/research-core/DevSecOps/:path*", destination: "/research-core/01-security-engineering/devsecops/:path*" },
	{ source: "/research-core/Security/:path*", destination: "/research-core/01-security-engineering/security/:path*" },
	{ source: "/research-core/Kubernetes-Security/:path*", destination: "/research-core/01-security-engineering/kubernetes-security/:path*" },
	{ source: "/research-core/Zero-Trust-Architecture/:path*", destination: "/research-core/01-security-engineering/zero-trust-architecture/:path*" },
	{ source: "/research-core/Supply-Chain-Security/:path*", destination: "/research-core/01-security-engineering/supply-chain-security/:path*" },
	{ source: "/research-core/Incident-Response/:path*", destination: "/research-core/01-security-engineering/incident-response/:path*" },
	{ source: "/research-core/Cloud-Security-Posture/:path*", destination: "/research-core/01-security-engineering/cloud-security-posture/:path*" },
	{ source: "/research-core/CyberSecurity/:path*", destination: "/research-core/01-security-engineering/cybersecurity/:path*" },
	{ source: "/research-core/Cloud-Platform/:path*", destination: "/research-core/02-platform-cloud/cloud-platform/:path*" },
	{ source: "/research-core/Infranstracture-as-a-Code/:path*", destination: "/research-core/02-platform-cloud/infrastructure-as-code/:path*" },
	{ source: "/research-core/Containerization-and-Orchestration/:path*", destination: "/research-core/02-platform-cloud/containerization-and-orchestration/:path*" },
	{ source: "/research-core/CI-CD-Pipelines/:path*", destination: "/research-core/02-platform-cloud/ci-cd-pipelines/:path*" },
	{ source: "/research-core/Scripting/:path*", destination: "/research-core/02-platform-cloud/scripting/:path*" },
	{ source: "/research-core/Logging-and-Monitoring/:path*", destination: "/research-core/03-operations-reliability/logging-and-monitoring/:path*" },
	{ source: "/research-core/SRE-Reliability/:path*", destination: "/research-core/03-operations-reliability/sre-reliability/:path*" },
	{ source: "/research-core/linux/:path*", destination: "/research-core/03-operations-reliability/linux/:path*" },
	{ source: "/research-core/Networking/:path*", destination: "/research-core/03-operations-reliability/networking/:path*" },
	{ source: "/research-core/Database/:path*", destination: "/research-core/03-operations-reliability/database/:path*" },
	{ source: "/research-core/Communication/:path*", destination: "/research-core/04-collaboration-governance/communication/:path*" },
]

export function parseResearchCorePath(pathname: string) {
	const parts = pathname.split("/").filter(Boolean)
	const pillarSlug = parts[1] ?? ""
	const topicSlug =
		parts[2] && parts[2] !== "introduction" ? parts[2] : null
	const contentPrefix = topicSlug ? `${pillarSlug}/${topicSlug}` : pillarSlug
	const lastSegment = parts[parts.length - 1] ?? ""
	return { parts, pillarSlug, topicSlug, contentPrefix, lastSegment }
}

export function getPillarMeta(slug: string) {
	return RESEARCH_PILLARS.find((p) => p.slug === slug)
}
