import { siteConfig } from 'config/site'
import { getCareerYearsExperience, withCareerYears } from 'lib/career-years'

export function getHeroYearsExperience(): string {
	return getCareerYearsExperience()
}

export function getHeroSubtitle(): string {
	return `${getCareerYearsExperience()} years embedding security into CI/CD, multi-cloud platforms, and zero-trust architectures across AWS, GCP, Azure, Heroku, and Kubernetes  based in Kathmandu, open to remote.`
}

export function getHeroDescription(): string {
	return `Senior DevSecOps Engineer with ${getCareerYearsExperience()} years securing cloud infrastructure and automating security into CI/CD pipelines. I design security-first architectures, build automated threat detection systems, and implement defense-in-depth strategies for multi-cloud environments. My expertise spans infrastructure security, container hardening, vulnerability management, and incident response. I combine hands-on security engineering with research-driven approaches to solve complex cybersecurity challenges.`
}

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
	locationLine: string
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
	locationLine: 'Kathmandu, Nepal · Remote',
	bio: siteConfig.bio,
	title: siteConfig.home.title,
	description: getHeroDescription(),
	talksAbout: siteConfig.talks_about.split(',').map((t) => t.trim()),
	headlineLine1: 'Security-First Cloud Infrastructure',
	headlineLine2: 'DevSecOps & Threat Detection',
	subtitle: getHeroSubtitle(),
	badgePrimary: 'Senior DevSecOps Engineer',
	badgeSecondary: 'Applied Security Researcher',
	customTags: ['DevSecOps', 'Cloud Security', 'Zero Trust'],
	viewContent: {
		Academic: {
			headline: 'Applied security research notes  structured for academic depth and industry use.',
			bullets: [
				'MSc thesis on continuous DevOps automation for cloud threat detection.',
				'140+ technical research notes across security, platform, and reliability pillars.',
				'Mentored teams on secure CI/CD, reproducible infra artifacts, and defense-in-depth.',
			],
		},
		Enterprise: {
			headline: 'Production DevSecOps across multi-cloud teams  from CI/CD to observability.',
			bullets: [
				'Built CI/CD with Bitbucket, Docker, and Kubernetes on AWS, GCP, Azure, and Heroku.',
				'Managed infrastructure with Terraform and Terragrunt; monitoring with Prometheus, Loki, Grafana, and the EFK stack.',
				'Hardened Linux platforms, load balancers, and pipelines with SonarQube quality gates and HIPAA-aligned controls.',
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
	const subtitle = getHeroSubtitle()
	const description = getHeroDescription()

	if (!partial) {
		return { ...DEFAULT_HERO_DATA, subtitle, description }
	}

	return {
		...DEFAULT_HERO_DATA,
		...partial,
		subtitle: partial.subtitle?.trim() ? withCareerYears(partial.subtitle) : subtitle,
		description: partial.description?.trim() ? withCareerYears(partial.description) : description,
		locationLine: partial.locationLine?.trim() || DEFAULT_HERO_DATA.locationLine,
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
