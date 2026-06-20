import { RESEARCH_PILLARS } from 'lib/research-pillars'
import { RESEARCH_SEGMENT_LABELS } from 'lib/research-labels'

export const RESEARCH_CORE_CONFIG_KEY = 'research_core_config'

export type StartHereLink = {
	href: string
	title: string
	description: string
	icon: 'BookOpen' | 'Map' | 'ClipboardCheck' | 'Layers' | 'Shield'
}

export type ChecklistItemConfig = {
	id: string
	section: string
	label: string
	href: string
	linkLabel: string
}

export type PillarOverride = {
	slug: string
	title: string
	description: string
}

export type ResearchCoreConfig = {
	pageTitle: string
	pageLead: string
	startHere: {
		badge: string
		heading: string
		lead: string
		links: StartHereLink[]
	}
	heroCta: {
		enabled: boolean
		label: string
		href: string
	}
	learningHub: {
		progressLabel: string
		showReadingTime: boolean
	}
	seniorGapChecklist: {
		items: ChecklistItemConfig[]
	}
	pillars: PillarOverride[]
	segmentLabels: Record<string, string>
}

export const DEFAULT_SENIOR_GAP_ITEMS: ChecklistItemConfig[] = [
	{ id: 'branching', section: 'Delivery & automation', label: 'Trunk-based or documented branching', href: '/research-core/02-platform-cloud/ci-cd-pipelines/introduction', linkLabel: 'CI/CD' },
	{ id: 'pipeline-vulns', section: 'Delivery & automation', label: 'Pipeline blocks on critical vulns', href: '/research-core/01-security-engineering/devsecops/introduction', linkLabel: 'DevSecOps' },
	{ id: 'iac', section: 'Delivery & automation', label: 'IaC for all net-new infra', href: '/research-core/02-platform-cloud/infrastructure-as-code/introduction', linkLabel: 'IaC' },
	{ id: 'gitops', section: 'Delivery & automation', label: 'GitOps or equivalent drift control', href: '/research-core/02-platform-cloud/containerization-and-orchestration/introduction', linkLabel: 'Containerization' },
	{ id: 'secrets', section: 'Delivery & automation', label: 'Secrets never in env files in git', href: '/research-core/01-security-engineering/supply-chain-security/introduction', linkLabel: 'Supply Chain' },
	{ id: 'pod-security', section: 'Kubernetes & cloud', label: 'Pod Security / admission policies', href: '/research-core/01-security-engineering/kubernetes-security/introduction', linkLabel: 'K8s Security' },
	{ id: 'netpol', section: 'Kubernetes & cloud', label: 'Network policies default-deny', href: '/research-core/01-security-engineering/kubernetes-security/introduction', linkLabel: 'K8s Security' },
	{ id: 'landing-zone', section: 'Kubernetes & cloud', label: 'Multi-account cloud landing zone', href: '/research-core/02-platform-cloud/cloud-platform/introduction', linkLabel: 'Cloud Platform' },
	{ id: 'cspm', section: 'Kubernetes & cloud', label: 'CSPM or continuous compliance', href: '/research-core/01-security-engineering/cloud-security-posture/introduction', linkLabel: 'Cloud Security Posture' },
	{ id: 'ir-runbook', section: 'Kubernetes & cloud', label: 'IR runbook exercised in last 6 months', href: '/research-core/01-security-engineering/incident-response/introduction', linkLabel: 'Incident Response' },
	{ id: 'slos', section: 'Reliability & observability', label: 'SLOs defined per tier-1 service', href: '/research-core/03-operations-reliability/sre-reliability/introduction', linkLabel: 'SRE' },
	{ id: 'error-budget', section: 'Reliability & observability', label: 'Error budget policy documented', href: '/research-core/03-operations-reliability/sre-reliability/introduction', linkLabel: 'SRE' },
	{ id: 'structured-logs', section: 'Reliability & observability', label: 'Structured logs with trace correlation', href: '/research-core/03-operations-reliability/logging-and-monitoring/introduction', linkLabel: 'Logging' },
	{ id: 'game-day', section: 'Reliability & observability', label: 'Game day or chaos experiment yearly', href: '/research-core/03-operations-reliability/sre-reliability/introduction', linkLabel: 'SRE' },
	{ id: 'zero-trust', section: 'Security architecture', label: 'Zero trust principles in prod network', href: '/research-core/01-security-engineering/zero-trust-architecture/introduction', linkLabel: 'Zero Trust' },
	{ id: 'sbom', section: 'Security architecture', label: 'SBOM attached to releases', href: '/research-core/01-security-engineering/supply-chain-security/introduction', linkLabel: 'Supply Chain' },
	{ id: 'stride', section: 'Security architecture', label: 'STRIDE or equivalent on major services', href: '/research-core/01-security-engineering/cybersecurity/introduction', linkLabel: 'Cybersecurity' },
]

export const DEFAULT_RESEARCH_CORE_CONFIG: ResearchCoreConfig = {
	pageTitle: 'Research Core',
	pageLead:
		'Applied security and platform research notes  structured tracks, chapters, and hands-on technical documentation. These are engineering research notes, not peer-reviewed journal publications.',
	startHere: {
		badge: 'Start here',
		heading: 'New to this library? Begin with the Learning Hub',
		lead: '140+ articles are organized by pillar. The DevOps Learning Hub gives you a clear path instead of reading at random.',
		links: [
			{
				href: '/research-core/05-learning-and-roadmaps/devops-learning-hub/introduction',
				title: 'DevOps Learning Hub',
				description: 'Phased roadmaps, tools, cloud labs, and interview prep.',
				icon: 'BookOpen',
			},
			{
				href: '/research-core/05-learning-and-roadmaps/devops-learning-hub/Chapter-1/devops-foundation-roadmap',
				title: 'DevOps Foundation Roadmap',
				description: '12 steps from Git to cloud delivery.',
				icon: 'Map',
			},
			{
				href: '/research-core/05-learning-and-roadmaps/devops-learning-hub/Chapter-1/senior-platform-gap-checklist',
				title: 'Senior Platform Gap Checklist',
				description: 'Self-audit with saved scores for staff-level roles.',
				icon: 'ClipboardCheck',
			},
		],
	},
	heroCta: {
		enabled: false,
		label: 'Start at DevOps Learning Hub',
		href: '/research-core/05-learning-and-roadmaps/devops-learning-hub/introduction',
	},
	learningHub: {
		progressLabel: 'Learning Hub progress',
		showReadingTime: true,
	},
	seniorGapChecklist: {
		items: DEFAULT_SENIOR_GAP_ITEMS,
	},
	pillars: RESEARCH_PILLARS.map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description,
	})),
	segmentLabels: { ...RESEARCH_SEGMENT_LABELS },
}

export function mergePillarsWithConfig(config: ResearchCoreConfig) {
	return RESEARCH_PILLARS.map((pillar) => {
		const override = config.pillars.find((p) => p.slug === pillar.slug)
		return {
			...pillar,
			title: override?.title ?? pillar.title,
			description: override?.description ?? pillar.description,
		}
	})
}

export function mergeResearchCoreConfig(partial?: Partial<ResearchCoreConfig> | null): ResearchCoreConfig {
	if (!partial) return DEFAULT_RESEARCH_CORE_CONFIG
	return {
		...DEFAULT_RESEARCH_CORE_CONFIG,
		...partial,
		startHere: { ...DEFAULT_RESEARCH_CORE_CONFIG.startHere, ...partial.startHere },
		heroCta: { ...DEFAULT_RESEARCH_CORE_CONFIG.heroCta, ...partial.heroCta },
		learningHub: { ...DEFAULT_RESEARCH_CORE_CONFIG.learningHub, ...partial.learningHub },
		seniorGapChecklist: {
			items:
				partial.seniorGapChecklist?.items?.length
					? partial.seniorGapChecklist.items
					: DEFAULT_RESEARCH_CORE_CONFIG.seniorGapChecklist.items,
		},
		pillars:
			partial.pillars?.length ? partial.pillars : DEFAULT_RESEARCH_CORE_CONFIG.pillars,
		segmentLabels: {
			...DEFAULT_RESEARCH_CORE_CONFIG.segmentLabels,
			...partial.segmentLabels,
		},
	}
}
