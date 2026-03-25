import { Metadata } from 'next'
import { siteConfig } from 'config/site'
import { canonicalUrl, getSiteOrigin } from 'lib/site-origin'

export const defaultMetadata: Metadata = {
	metadataBase: new URL(getSiteOrigin()),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.home.description.trim(),
	authors: [{ name: siteConfig.name }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	keywords: [
		'DevSecOps',
		'Cybersecurity',
		'Cloud Security',
		'Security Automation',
		'Threat Detection',
		'Zero Trust',
		'Infrastructure Security',
		'Security Engineering',
		'SAST',
		'DAST',
		'Container Security',
		'IaC Security',
		'Cloud Infrastructure',
		'CI/CD Security',
		'Kubernetes Security',
		'Security Research',
		...siteConfig.talks_about.split(',').map(tag => tag.trim())
	],
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: getSiteOrigin(),
		title: siteConfig.name,
		description: siteConfig.home.description.trim(),
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.profile_image,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.home.description.trim(),
		images: [siteConfig.profile_image],
		creator: '@' + ((siteConfig.links as any).twitter?.replace('https://twitter.com/', '') || ''),
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_VERIFICATION,
	},
	alternates: {
		canonical: getSiteOrigin(),
	},
}

/** Root `app/layout.tsx` — one place for default title/description/OG to avoid drift from `defaultMetadata`. */
export const rootLayoutMetadata: Metadata = {
	...defaultMetadata,
	title: {
		default:
			'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
		template: `%s | ${siteConfig.name}`,
	},
	description:
		'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure, scalable cloud infrastructure with automated threat detection, zero-trust architectures, and defense-in-depth security strategies.',
	keywords: [
		'DevSecOps',
		'DevOps',
		'Cybersecurity',
		'Cloud Security',
		'Research',
		'Krishna Neupane',
	],
	openGraph: {
		...defaultMetadata.openGraph,
		url: getSiteOrigin(),
		title: 'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
		description:
			'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure cloud infrastructure with automated threat detection and zero-trust architectures.',
	},
	twitter: {
		...defaultMetadata.twitter,
		title: 'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
		description:
			'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure cloud infrastructure with automated threat detection and zero-trust architectures.',
	},
}

export function generatePageMetadata({
	title,
	description,
	path,
	keywords,
}: {
	title: string
	description?: string
	path: string
	keywords?: string[]
}): Metadata {
	const fullTitle = title === 'Home' ? siteConfig.name : `${title} | ${siteConfig.name}`
	const fullDescription = description || defaultMetadata.description as string
	// Root layout uses title.template '%s | …' — pass short page titles so the suffix is not doubled.
	const documentTitle =
		title === 'Home' ? { absolute: siteConfig.name as string } : title

	return {
		title: documentTitle,
		description: fullDescription,
		keywords: keywords || defaultMetadata.keywords,
		openGraph: {
			...defaultMetadata.openGraph,
			title: fullTitle,
			description: fullDescription,
			url: canonicalUrl(path),
		},
		twitter: {
			...defaultMetadata.twitter,
			title: fullTitle,
			description: fullDescription,
		},
		alternates: {
			canonical: canonicalUrl(path),
		},
	}
}

/** Long-form MDX (research) — article OG + stable canonical; tab title uses root template once. */
export function generateResearchArticleMetadata({
	title,
	description,
	path,
	publishedTime,
	keywords,
}: {
	title: string
	description?: string
	path: string
	publishedTime?: string
	keywords?: string[]
}): Metadata {
	const fullDescription = (description || defaultMetadata.description) as string
	const fullTitle = `${title} | ${siteConfig.name}`

	return {
		title,
		description: fullDescription,
		authors: [{ name: siteConfig.name, url: siteConfig.links.orcid }],
		keywords: keywords?.length ? keywords : defaultMetadata.keywords,
		openGraph: {
			...defaultMetadata.openGraph,
			type: 'article',
			title: fullTitle,
			description: fullDescription,
			url: canonicalUrl(path),
			publishedTime,
			authors: [siteConfig.name],
		},
		twitter: {
			...defaultMetadata.twitter,
			title: fullTitle,
			description: fullDescription,
		},
		alternates: {
			canonical: canonicalUrl(path),
		},
	}
}
