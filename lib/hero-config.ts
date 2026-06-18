import { siteConfig } from 'config/site'

export type HeroViewContent = {
	headline: string
	bullets: string[]
}

export type HeroExpertiseArea = {
	icon: 'Shield' | 'Server' | 'Lock' | 'Cloud'
	title: string
	description: string
}

export type HeroData = {
	profileImage: string
	name: string
	bio: string
	title: string
	description: string
	talksAbout: string[]
	headlineLine1: string
	headlineLine2: string
	subtitle: string
	badgePrimary: string
	badgeSecondary: string
	customTags: string[]
	viewContent: {
		Academic: HeroViewContent
		Enterprise: HeroViewContent
	}
	expertiseAreas: HeroExpertiseArea[]
}

export const DEFAULT_HERO_DATA: HeroData = {
	profileImage: siteConfig.profile_image || '',
	name: siteConfig.name,
	bio: siteConfig.bio,
	title: siteConfig.home.title,
	description: siteConfig.home.description.trim(),
	talksAbout: siteConfig.talks_about.split(',').map((t) => t.trim()),
	headlineLine1: 'Securing Cloud Infrastructure',
	headlineLine2: 'DevSecOps & Cybersecurity Expert',
	subtitle:
		'8+ years building security-first cloud systems, automating threat detection, and implementing zero-trust architectures across AWS, GCP, Heroku, Azure, and Kubernetes.',
	badgePrimary: 'Senior DevSecOps Engineer',
	badgeSecondary: 'Researcher',
	customTags: [
		'DevSecOps',
		'Cybersecurity',
		'Cloud Security',
		'Threat Detection',
		'Security Automation',
		'Zero Trust',
	],
	viewContent: {
		Academic: {
			headline: 'Advancing secure, resilient cloud research ready for doctoral depth.',
			bullets: [
				'Published applied DevSecOps playbooks adopted across cross-functional teams.',
				'Led reproducible research pipelines with verifiable infrastructure artifacts.',
				'Mentored cohorts on cloud resilience and secure CI/CD methodologies.',
			],
		},
		Enterprise: {
			headline: 'Delivering secure, production-grade systems with automated security controls.',
			bullets: [
				'Built security-first CI/CD pipelines reducing vulnerabilities by 85% through automated SAST/DAST integration.',
				'Implemented infrastructure security hardening across multi-cloud environments, achieving SOC2 compliance.',
				'Designed and deployed zero-trust architectures with automated threat detection, reducing incident response time by 70%.',
			],
		},
	},
	expertiseAreas: [
		{
			icon: 'Shield',
			title: 'Security-First Architecture',
			description: 'Designing cloud systems with security as a foundational principle.',
		},
		{
			icon: 'Server',
			title: 'Infrastructure Automation',
			description: 'Building scalable, resilient infrastructure with IaC and CI/CD.',
		},
		{
			icon: 'Lock',
			title: 'Cybersecurity Defense',
			description:
				'Implementing defense-in-depth, zero-trust architectures, and automated threat detection for enterprise cloud environments.',
		},
		{
			icon: 'Cloud',
			title: 'Cloud-Native',
			description: 'Expertise in AWS, GCP, Heroku, Azure, and Kubernetes orchestration.',
		},
	],
}

export function mergeHeroData(partial?: Partial<HeroData> | null): HeroData {
	if (!partial) return DEFAULT_HERO_DATA
	return {
		...DEFAULT_HERO_DATA,
		...partial,
		talksAbout: partial.talksAbout?.length ? partial.talksAbout : DEFAULT_HERO_DATA.talksAbout,
		customTags: partial.customTags?.length ? partial.customTags : DEFAULT_HERO_DATA.customTags,
		viewContent: {
			Academic: { ...DEFAULT_HERO_DATA.viewContent.Academic, ...partial.viewContent?.Academic },
			Enterprise: { ...DEFAULT_HERO_DATA.viewContent.Enterprise, ...partial.viewContent?.Enterprise },
		},
		expertiseAreas: partial.expertiseAreas?.length
			? partial.expertiseAreas
			: DEFAULT_HERO_DATA.expertiseAreas,
	}
}
