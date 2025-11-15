import { Metadata } from 'next'
import { siteConfig } from 'config/site'

export const defaultMetadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
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
		url: siteConfig.url,
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
		canonical: siteConfig.url,
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
	
	return {
		title: fullTitle,
		description: fullDescription,
		keywords: keywords || defaultMetadata.keywords,
		openGraph: {
			...defaultMetadata.openGraph,
			title: fullTitle,
			description: fullDescription,
			url: `${siteConfig.url}${path}`,
		},
		twitter: {
			...defaultMetadata.twitter,
			title: fullTitle,
			description: fullDescription,
		},
		alternates: {
			canonical: `${siteConfig.url}${path}`,
		},
	}
}
