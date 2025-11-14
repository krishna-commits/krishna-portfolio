import { Metadata } from "next"
import { generatePageMetadata } from "../metadata"
import { siteConfig } from "config/site"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { 
	GitHubMetricsSkeleton, 
	SkillsShowcaseSkeleton, 
	HeroSkeleton,
	ProjectCardSkeleton,
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

const FeaturedProjects = dynamic(() => import("./components/featured-projects").then(mod => ({ default: mod.FeaturedProjects })), {
	loading: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, i) => (
				<ProjectCardSkeleton key={i} />
			))}
		</div>
	),
	ssr: true,
})

const GitHubContributionGraph = dynamic(() => import("./components/github-contribution-graph").then(mod => ({ default: mod.GitHubContributionGraph })), {
	loading: () => <GitHubMetricsSkeleton />,
	ssr: false, // Client-side only (uses SWR)
})

// Static imports for components that don't need optimization
import { SocialLinks } from "./components/social-links"
import { LinkedInRecommendations } from "./components/linkedin-recommendations"
import { GitHubContributions } from "./components/github-contributions"
import { Certifications } from "./components/certifications"
import { Newsletter } from "../components/newsletter"
import { EducationExperience } from "./components/education-experience"
import { SecurityFirstApproach } from "./components/security-first-approach"
import { PersonalNote } from "./components/personal-note"
import { HobbiesSection } from "./components/hobbies-section"
import { StickySidebarNav } from "../components/sticky-sidebar-nav"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/scroll-animations"
import { CopyrightFooter } from "../components/copyright-footer"

export const metadata: Metadata = generatePageMetadata({
	title: 'Home',
	description: 'DevSecOps Engineer | DevOps Enthusiast | Cybersecurity Learner | Aspiring Researcher. Designing security-first cloud systems that earn trust from academic peers and global enterprises.',
	path: '/',
})

const structuredData = {
	"@context": "https://schema.org",
	"@type": "Person",
	"name": siteConfig.name,
	"jobTitle": siteConfig.bio,
	"description": siteConfig.home.description,
	"url": siteConfig.url,
	"image": siteConfig.profile_image,
	"sameAs": [
		siteConfig.links.github,
		siteConfig.links.linkedIn,
		siteConfig.links.researchgate,
		siteConfig.links.orcid,
	],
	"knowsAbout": siteConfig.talks_about.split(',').map(tag => tag.trim()),
}

export default function HomePage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			
			<div className="min-h-screen w-full bg-white dark:bg-slate-950 relative">
				{/* Sticky Sidebar Navigation */}
				<StickySidebarNav />
				
				{/* Hero Section - DevSecOps/Cybersecurity Focused */}
				<HeroSection />

				{/* Main Content - Clean, spacious layout */}
				<main className="w-full relative" role="main" aria-label="Main content">
					{/* Impact Metrics */}
					<section id="stats-heading" className="relative w-full py-2 sm:py-3 lg:py-4" aria-labelledby="stats-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<ScrollAnimation variant="fade">
									<StatsSection />
								</ScrollAnimation>
							</div>
						</div>
					</section>

					{/* Technology Stack - Moved Up */}
					<section id="skills" className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30 bg-gradient-mesh bg-noise" aria-labelledby="skills-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<ScrollAnimation variant="slide-up" delay={0.1}>
									<SkillsShowcase />
								</ScrollAnimation>
							</div>
						</div>
					</section>

					{/* Background (Education & Experience) - Moved Up */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="education-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<EducationExperience />
							</div>
						</div>
					</section>

					{/* Certifications */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="certifications-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<Certifications />
							</div>
						</div>
					</section>

					{/* Personal Note */}
					<section id="about" className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30" aria-labelledby="about-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<PersonalNote />
							</div>
						</div>
					</section>

					{/* Security-First Approach */}
					<section id="security" className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="security-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<SecurityFirstApproach />
							</div>
						</div>
					</section>

					{/* Featured Projects */}
					<section id="projects" className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30 bg-gradient-mesh" aria-labelledby="projects-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<ErrorBoundary>
									<Suspense fallback={
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{Array.from({ length: 6 }).map((_, i) => (
												<ProjectCardSkeleton key={i} />
											))}
										</div>
									}>
										<ScrollAnimation variant="scale">
											<FeaturedProjects />
										</ScrollAnimation>
									</Suspense>
								</ErrorBoundary>
							</div>
						</div>
					</section>

					{/* GitHub Contribution Graph */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30" aria-labelledby="github-contributions-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<ErrorBoundary>
									<Suspense fallback={<GitHubMetricsSkeleton />}>
										<GitHubContributionGraph />
									</Suspense>
								</ErrorBoundary>
							</div>
						</div>
					</section>

					{/* GitHub */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="github-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<GitHubContributions />
							</div>
						</div>
					</section>

					{/* Recommendations */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30" aria-labelledby="recommendations-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<LinkedInRecommendations />
							</div>
						</div>
					</section>

					{/* Newsletter */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="newsletter-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<Newsletter />
							</div>
						</div>
					</section>

					{/* Hobbies */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10" aria-labelledby="hobbies-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
								<HobbiesSection />
							</div>
						</div>
					</section>

					{/* Social Links */}
					<section className="relative w-full py-6 sm:py-8 lg:py-10 bg-slate-50/30 dark:bg-slate-900/30" aria-labelledby="social-heading">
						<div className="relative w-full">
							<div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
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
