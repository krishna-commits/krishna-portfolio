import { Metadata } from "next"
import { generatePageMetadata } from "../metadata"
import { siteConfig } from "config/site"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { 
	GitHubMetricsSkeleton, 
	SkillsShowcaseSkeleton, 
	HeroSkeleton,
	StatsCardSkeleton 
} from "../components/skeleton-loaders"
import { ErrorBoundary } from "../components/error-boundary"

// Dynamic imports with loading states
const HeroSection = dynamic(() => import("./components/hero-section").then(mod => ({ default: mod.HeroSection })), {
	loading: () => <HeroSkeleton />,
	ssr: true,
})

const StatsSection = dynamic(() => import("./components/stats-section").then(mod => ({ default: mod.StatsSection })), {
	loading: () => (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
			{Array.from({ length: 4 }).map((_, i) => (
				<StatsCardSkeleton key={i} />
			))}
		</div>
	),
	ssr: true,
})

const SkillsShowcase = dynamic(() => import("./components/skills-showcase").then(mod => ({ default: mod.SkillsShowcase })), {
	loading: () => <SkillsShowcaseSkeleton />,
	ssr: true,
})

const GitHubContributionGraph = dynamic(() => import("./components/github-contribution-graph").then(mod => ({ default: mod.GitHubContributionGraph })), {
	loading: () => <GitHubMetricsSkeleton />,
	ssr: false,
})

const EducationExperience = dynamic(() => import("./components/education-experience").then(mod => ({ default: mod.EducationExperience })), {
	ssr: true,
})

const Certifications = dynamic(() => import("./components/certifications").then(mod => ({ default: mod.Certifications })), {
	ssr: true,
})

const SecurityFirstApproach = dynamic(() => import("./components/security-first-approach").then(mod => ({ default: mod.SecurityFirstApproach })), {
	ssr: true,
})

const LinkedInRecommendations = dynamic(() => import("./components/linkedin-recommendations").then(mod => ({ default: mod.LinkedInRecommendations })), {
	ssr: true,
})

const SocialLinks = dynamic(() => import("./components/social-links").then(mod => ({ default: mod.SocialLinks })), {
	ssr: true,
})

import { ScrollAnimation } from "../components/scroll-animations"
import { CopyrightFooter } from "../components/copyright-footer"

export const metadata: Metadata = generatePageMetadata({
	title: 'Home',
	description: 'DevSecOps Engineer | DevOps Enthusiast | Cybersecurity Learner | Aspiring Researcher. Designing security-first cloud systems that earn trust from academic peers and global enterprises.',
	path: '/',
})

const siteOrigin = new URL(
	siteConfig.url.startsWith("http") ? siteConfig.url : `https://${siteConfig.url}`,
).origin
const personId = `${siteOrigin}/#person`
const websiteId = `${siteOrigin}/#website`
const homeDescription = siteConfig.home.description.trim()

const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": websiteId,
			url: siteOrigin,
			name: siteConfig.name,
			description: homeDescription,
			inLanguage: "en-US",
			publisher: { "@id": personId },
		},
		{
			"@type": "Person",
			"@id": personId,
			name: siteConfig.name,
			jobTitle: siteConfig.bio,
			description: homeDescription,
			url: siteOrigin,
			image: siteConfig.profile_image,
			sameAs: [
				siteConfig.links.github,
				siteConfig.links.linkedIn,
				siteConfig.links.researchgate,
				siteConfig.links.orcid,
				siteConfig.links.medium,
				siteConfig.links.instagram,
			].filter(Boolean),
			knowsAbout: siteConfig.talks_about.split(",").map((tag) => tag.trim()),
			mainEntityOfPage: { "@id": websiteId },
		},
	],
}

export default function HomePage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			
			<div className="min-h-screen w-full bg-background relative">
				{/* Hero Section - DevSecOps/Cybersecurity Focused */}
				<HeroSection />

				{/* Main Content - Clean, spacious layout */}
				<main className="w-full relative" role="main" aria-label="Main content">
					{/* Impact Metrics */}
					<section id="stats-heading" className="relative w-full scroll-mt-24 py-12 md:py-16" aria-labelledby="stats-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<ScrollAnimation variant="fade">
									<StatsSection />
								</ScrollAnimation>
							</div>
						</div>
					</section>

					{/* Technology Stack - Moved Up */}
					<section id="skills" className="relative w-full scroll-mt-24 border-y border-border py-12 md:py-16" aria-labelledby="technology-stack-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<ScrollAnimation variant="slide-up" delay={0.1}>
									<SkillsShowcase />
								</ScrollAnimation>
							</div>
						</div>
					</section>

					{/* Background (Education & Experience) - Moved Up */}
					<section id="education-heading" className="relative w-full scroll-mt-24 py-12 md:py-16" aria-labelledby="education-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<EducationExperience />
							</div>
						</div>
					</section>

					{/* Certifications */}
					<section className="relative w-full scroll-mt-24 py-12 md:py-16" aria-labelledby="certifications-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<Certifications />
							</div>
						</div>
					</section>

					{/* Security-First Approach */}
					<section id="security" className="relative w-full scroll-mt-24 py-12 md:py-16" aria-labelledby="security-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<SecurityFirstApproach />
							</div>
						</div>
					</section>

					{/* GitHub activity */}
					<section className="relative w-full py-12 md:py-16 bg-muted/40 dark:bg-muted/20" aria-labelledby="github-contributions-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<ErrorBoundary>
									<Suspense fallback={<GitHubMetricsSkeleton />}>
										<GitHubContributionGraph />
									</Suspense>
								</ErrorBoundary>
							</div>
						</div>
					</section>

					{/* Recommendations */}
					<section className="relative w-full py-12 md:py-16 bg-muted/40 dark:bg-muted/20" aria-labelledby="recommendations-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<LinkedInRecommendations />
							</div>
						</div>
					</section>

					{/* Social Links */}
					<section className="relative w-full py-12 md:py-16 bg-muted/40 dark:bg-muted/20" aria-labelledby="social-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
								<SocialLinks />
							</div>
						</div>
					</section>

					{/* Copyright Footer */}
					<CopyrightFooter />
				</main>
			</div>
		</>
	)
}
