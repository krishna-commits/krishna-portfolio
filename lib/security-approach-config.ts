export type SecurityMethodology = {
	icon: 'Code' | 'Server' | 'Eye'
	title: string
	description: string
}

export type SecurityPipelineStage = {
	stage: string
	icon: 'Code' | 'Container' | 'CheckCircle2' | 'Cloud' | 'Eye'
	description: string
}

export type SecurityApproachConfig = {
	heading: string
	lead: string
	methodologies: SecurityMethodology[]
	pipelineHeading: string
	pipeline: SecurityPipelineStage[]
}

export const DEFAULT_SECURITY_APPROACH: SecurityApproachConfig = {
	heading: 'Security-First Approach',
	lead: 'Integrating security at every stage, from code commit to production monitoring, using shift-left principles, automated threat detection, and continuous validation to build resilient systems.',
	methodologies: [
		{
			icon: 'Code',
			title: 'Shift Left Security',
			description:
				'Automated SAST/DAST scanning in CI/CD pipelines, secret detection, dependency vulnerability scanning, and security policy enforcement before code reaches production.',
		},
		{
			icon: 'Server',
			title: 'Infrastructure Hardening',
			description:
				'IaC security scanning (Trivy, Terrascan), CIS benchmark compliance, network segmentation, least-privilege IAM, and container security hardening.',
		},
		{
			icon: 'Eye',
			title: 'Continuous Security Monitoring',
			description:
				'Real-time threat detection using SIEM integration, automated incident response playbooks, security event correlation, and runtime application self-protection (RASP).',
		},
	],
	pipelineHeading: 'Security Pipeline',
	pipeline: [
		{ stage: 'Code', icon: 'Code', description: 'SAST, Secret Detection' },
		{ stage: 'Build', icon: 'Container', description: 'Container Scanning' },
		{ stage: 'Test', icon: 'CheckCircle2', description: 'DAST, Security Tests' },
		{ stage: 'Deploy', icon: 'Cloud', description: 'IaC Validation' },
		{ stage: 'Monitor', icon: 'Eye', description: 'Runtime Protection' },
	],
}

export function mergeSecurityApproach(partial?: Partial<SecurityApproachConfig> | null): SecurityApproachConfig {
	if (!partial) return DEFAULT_SECURITY_APPROACH
	return {
		...DEFAULT_SECURITY_APPROACH,
		...partial,
		methodologies: partial.methodologies?.length
			? partial.methodologies
			: DEFAULT_SECURITY_APPROACH.methodologies,
		pipeline: partial.pipeline?.length ? partial.pipeline : DEFAULT_SECURITY_APPROACH.pipeline,
	}
}
