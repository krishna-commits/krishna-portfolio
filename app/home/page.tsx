import { Metadata } from "next"
import { generatePageMetadata } from "../metadata"
import { siteConfig } from "config/site"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import {
	GitHubMetricsSkeleton,
	SkillsShowcaseSkeleton,
} from "../components/skeleton-loaders"
import { ErrorBoundary } from "../components/error-boundary"
import { CopyrightFooter } from "../components/copyright-footer"
import { buildHomeStructuredData } from "lib/build-home-structured-data"
import { PROJECT_COUNT, RESEARCH_CORE_COUNT } from "lib/content-counts"
import { cn } from "app/theme/lib/utils"
import { HeroSection } from "./components/hero-section"
import { StatsSection } from "./components/stats-section"

const FeaturedProjects = dynamic(
	() => import("./components/featured-projects").then((mod) => ({ default: mod.FeaturedProjects })),
	{ ssr: true },
)

const EducationExperience = dynamic(
	() => import("./components/education-experience").then((mod) => ({ default: mod.EducationExperience })),
	{ ssr: true },
)

const Certifications = dynamic(
	() => import("./components/certifications").then((mod) => ({ default: mod.Certifications })),
	{ ssr: true },
)

const SkillsShowcase = dynamic(
	() => import("./components/skills-showcase").then((mod) => ({ default: mod.SkillsShowcase })),
	{ loading: () => <SkillsShowcaseSkeleton />, ssr: true },
)

const GitHubContributionGraph = dynamic(
	() => import("./components/github-contribution-graph").then((mod) => ({ default: mod.GitHubContributionGraph })),
	{ loading: () => <GitHubMetricsSkeleton />, ssr: false },
)

const SocialLinks = dynamic(
	() => import("./components/social-links").then((mod) => ({ default: mod.SocialLinks })),
	{ ssr: true },
)

const LinkedInRecommendations = dynamic(
	() =>
		import("./components/linkedin-recommendations").then((mod) => ({
			default: mod.LinkedInRecommendations,
		})),
	{ ssr: true },
)

const ContentHubLinks = dynamic(
	() => import("./components/content-hub-links").then((mod) => ({ default: mod.ContentHubLinks })),
	{ ssr: true },
)

const HireMeBar = dynamic(
	() => import("./components/hire-me-bar").then((mod) => ({ default: mod.HireMeBar })),
	{ ssr: false },
)

const MediumHighlights = dynamic(
	() => import("./components/medium-highlights").then((mod) => ({ default: mod.MediumHighlights })),
	{ ssr: true },
)

const HOME_TITLE = 'Krishna Neupane - Senior DevSecOps Engineer | Applied Security Researcher'
const HOME_DESCRIPTION =
	'Senior DevSecOps Engineer | Applied Security Researcher. Designing security-first cloud systems with structured research notes, automated threat detection, and production-grade DevSecOps.'

const baseHomeMetadata = generatePageMetadata({
	title: 'Home',
	description: HOME_DESCRIPTION,
	path: '/',
	keywords: [
		'Applied Security Researcher',
		'Senior DevSecOps Engineer',
		'Cloud Security',
		'DevSecOps',
		'Krishna Neupane',
	],
})

export const metadata: Metadata = {
	...baseHomeMetadata,
	title: { absolute: HOME_TITLE },
	description: HOME_DESCRIPTION,
	openGraph: {
		...baseHomeMetadata.openGraph,
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
	},
	twitter: {
		...baseHomeMetadata.twitter,
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
	},
}

const siteOrigin = new URL(
	siteConfig.url.startsWith('http') ? siteConfig.url : `https://${siteConfig.url}`,
).origin

const MUTED_SECTION = 'bg-amber-50/30 dark:bg-muted/20'

function SectionShell({
	id,
	children,
	className = '',
}: {
	id?: string
	children: React.ReactNode
	className?: string
}) {
	return (
		<section
			id={id}
			className={cn('relative w-full scroll-mt-24 py-8 md:py-10', className)}
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
		</section>
	)
}

export default async function HomePage() {
	const structuredData = await buildHomeStructuredData(siteOrigin)

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<div className="relative min-h-screen w-full bg-background pb-24 sm:pb-8">
				<HeroSection />

				<main className="relative w-full" role="main" aria-label="Main content">
					<SectionShell id="stats-heading" className={MUTED_SECTION}>
						<StatsSection
							researchCoreCount={RESEARCH_CORE_COUNT}
							projectsCount={PROJECT_COUNT}
						/>
						<div className="mt-5 border-t border-border/60 pt-4">
							<ContentHubLinks />
						</div>
					</SectionShell>

					<SectionShell id="projects">
						<FeaturedProjects />
						<div className="mt-6 border-t border-border/60 pt-5">
							<MediumHighlights />
						</div>
					</SectionShell>

					<SectionShell id="skills">
						<SkillsShowcase />
					</SectionShell>

					<SectionShell id="education-heading">
						<EducationExperience />
					</SectionShell>

					<SectionShell id="certifications">
						<Certifications limit={6} />
					</SectionShell>

					<SectionShell className={MUTED_SECTION}>
						<ErrorBoundary>
							<Suspense fallback={<GitHubMetricsSkeleton />}>
								<GitHubContributionGraph />
							</Suspense>
						</ErrorBoundary>
					</SectionShell>

					<SectionShell id="recommendations" className={MUTED_SECTION}>
						<LinkedInRecommendations variant="slim" />
					</SectionShell>

					<SectionShell id="connect" className={cn(MUTED_SECTION, 'pb-24 sm:pb-12')}>
						<SocialLinks />
					</SectionShell>

					<CopyrightFooter />
				</main>

				<HireMeBar />
			</div>
		</>
	)
}
