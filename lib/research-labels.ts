/** Human-readable labels for Research Core URL segments (breadcrumbs, UI). */
export const RESEARCH_SEGMENT_LABELS: Record<string, string> = {
	"research-core": "Research Core",
	"devops-learning-hub": "DevOps Learning Hub",
	"engineering-governance": "Engineering Governance",
	"communication": "Communication",
	"devsecops": "DevSecOps",
	"kubernetes-security": "Kubernetes Security",
	"zero-trust-architecture": "Zero Trust Architecture",
	"supply-chain-security": "Supply Chain Security",
	"incident-response": "Incident Response",
	"cloud-security-posture": "Cloud Security Posture",
	"cybersecurity": "Cybersecurity",
	"cloud-platform": "Cloud Platform",
	"infrastructure-as-code": "Infrastructure as Code",
	"containerization-and-orchestration": "Containerization & Orchestration",
	"ci-cd-pipelines": "CI/CD Pipelines",
	"scripting": "Scripting",
	"logging-and-monitoring": "Logging & Monitoring",
	"sre-reliability": "SRE & Reliability",
	"introduction": "Overview",
}

export function labelForResearchSegment(
	segment: string,
	index: number,
	segments: string[],
	overrides?: Record<string, string>,
) {
	if (overrides?.[segment]) {
		return overrides[segment]
	}
	if (RESEARCH_SEGMENT_LABELS[segment]) {
		return RESEARCH_SEGMENT_LABELS[segment]
	}
	if (segment.startsWith("Chapter")) {
		return segment.replace(/-/g, " ")
	}
	if (index === segments.length - 1) {
		return segment.replace(/-/g, " ")
	}
	return segment.replace(/-/g, " ")
}
