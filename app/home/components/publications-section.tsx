'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { BookOpen, ExternalLink, GraduationCap, FileText, ArrowRight } from 'lucide-react'
import { cn } from 'app/theme/lib/utils'
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD, PAGE_CARD_LIGHT } from 'lib/page-layout'
import {
	PUBLICATIONS,
	PUBLICATIONS_SECTION,
	getFeaturedPublications,
	type Publication,
} from 'lib/publications-config'
import { siteConfig } from 'config/site'
import { useLightMotion } from 'lib/hooks/use-light-motion'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const TYPE_LABELS: Record<Publication['type'], string> = {
	thesis: 'Thesis',
	article: 'Article',
	preprint: 'Preprint',
	conference: 'Conference',
	report: 'Report',
}

const CARD_CLASS = cn(
	PAGE_CARD_LIGHT,
	'relative border-l-4 border-l-amber-500 p-4 sm:p-5 transition-shadow hover:border-amber-300 hover:shadow-md',
)

function PublicationCardBody({ pub }: { pub: Publication }) {
	return (
		<>
			<div className="mb-2 flex flex-wrap items-center gap-2">
				<span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
					{TYPE_LABELS[pub.type]}
				</span>
				<span className="text-xs text-muted-foreground">{pub.year}</span>
			</div>
			<h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">{pub.title}</h3>
			<p className="mt-1 text-xs text-muted-foreground sm:text-sm">{pub.authors.join(', ')}</p>
			<p className="mt-1 text-xs italic text-muted-foreground sm:text-sm">{pub.venue}</p>
			{pub.description && (
				<p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{pub.description}</p>
			)}
			{pub.link && (
				<Link
					href={pub.link}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 sm:text-sm"
				>
					View publication
					<ExternalLink className="h-3.5 w-3.5" aria-hidden />
				</Link>
			)}
		</>
	)
}

function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
	const lightMotion = useLightMotion()

	if (lightMotion) {
		return (
			<article className={CARD_CLASS}>
				<PublicationCardBody pub={pub} />
			</article>
		)
	}

	return (
		<motion.article
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.08, duration: 0.45 }}
			className={CARD_CLASS}
		>
			<PublicationCardBody pub={pub} />
		</motion.article>
	)
}

export function PublicationsBand() {
	const { data: orcidData } = useSWR('/api/orcid', fetcher, {
		revalidateOnFocus: false,
	})

	const featured = getFeaturedPublications()
	const orcidCount = orcidData?.count ?? 0
	const hasMore = PUBLICATIONS.length > featured.length

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{featured.map((pub, idx) => (
					<PublicationCard key={pub.title} pub={pub} index={idx} />
				))}
			</div>

			<div className="flex flex-wrap gap-3">
				<Link
					href={siteConfig.links.researchgate}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						PAGE_CARD,
						'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-800 no-underline transition-shadow hover:shadow-md dark:text-amber-300',
					)}
				>
					{hasMore ? 'View all on ResearchGate' : 'ResearchGate profile'}
					<ExternalLink className="h-4 w-4" aria-hidden />
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Link
					href={PUBLICATIONS_SECTION.researchCoreLink.href}
					className={cn(
						PAGE_CARD_LIGHT,
						'group flex items-center justify-between gap-3 p-4 no-underline transition-all hover:border-amber-300 hover:shadow-md sm:p-5',
					)}
				>
					<div className="flex items-center gap-3">
						<BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
						<div>
							<p className="text-sm font-semibold text-foreground">{PUBLICATIONS_SECTION.researchCoreLink.label}</p>
							<p className="text-xs text-muted-foreground">Applied security &amp; platform research notes</p>
						</div>
					</div>
					<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden />
				</Link>
				<Link
					href={PUBLICATIONS_SECTION.mediumLink.href}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						PAGE_CARD_LIGHT,
						'group flex items-center justify-between gap-3 p-4 no-underline transition-all hover:border-amber-300 hover:shadow-md sm:p-5',
					)}
				>
					<div className="flex items-center gap-3">
						<FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
						<div>
							<p className="text-sm font-semibold text-foreground">{PUBLICATIONS_SECTION.mediumLink.label}</p>
							<p className="text-xs text-muted-foreground">Articles &amp; engineering reflections</p>
						</div>
					</div>
					<ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
				</Link>
			</div>

			{orcidCount > 0 && (
				<p className="text-xs text-muted-foreground sm:text-sm">
					{orcidCount} additional work{orcidCount === 1 ? '' : 's'} listed on{' '}
					<Link href={siteConfig.links.orcid} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
						ORCID
					</Link>
					.
				</p>
			)}
		</div>
	)
}

export function PublicationsSection() {
	return (
		<section className="relative w-full" aria-labelledby="publications-heading">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-5 sm:mb-6"
			>
				<div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
					<span className={PAGE_ICON_CHIP}>
						<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
					</span>
					<h2 id="publications-heading" className={PAGE_H1}>
						{PUBLICATIONS_SECTION.title}
					</h2>
				</div>
				<p className={cn(PAGE_LEAD, 'max-w-3xl')}>{PUBLICATIONS_SECTION.lead}</p>
			</motion.div>

			<PublicationsBand />
		</section>
	)
}
