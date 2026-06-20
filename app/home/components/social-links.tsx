'use client'

import { useMemo } from 'react'
import { motion } from "framer-motion"
import Link from "next/link"
import { siteConfig } from "config/site"
import { Instagram, ExternalLink, Share2, Mail, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "app/theme/components/ui/button"
import { Icons } from "app/theme/components/theme/icons"
import { cn } from "app/theme/lib/utils"
import { PAGE_CARD, PAGE_ICON_CHIP, PAGE_H1, PAGE_LEAD, PAGE_CARD_LIGHT } from "lib/page-layout"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type SocialLinkDef = {
	name: string
	key: keyof typeof siteConfig.links
	icon: React.ComponentType<{ className?: string }>
	iconType: 'component' | 'lucide'
	description: string
	ariaLabel: string
}

const SOCIAL_DEFS: SocialLinkDef[] = [
	{ name: 'GitHub', key: 'github', icon: Icons.gitHub, iconType: 'component', description: 'Open source contributions', ariaLabel: 'GitHub profile' },
	{ name: 'LinkedIn', key: 'linkedIn', icon: Icons.linkedIn, iconType: 'component', description: 'Professional network', ariaLabel: 'LinkedIn profile' },
	{ name: 'ResearchGate', key: 'researchgate', icon: Icons.researchgate, iconType: 'component', description: 'Academic profile & theses', ariaLabel: 'ResearchGate profile' },
	{ name: 'ORCID', key: 'orcid', icon: Icons.orcid, iconType: 'component', description: 'Research profile', ariaLabel: 'ORCID profile' },
	{ name: 'Medium', key: 'medium', icon: ExternalLink, iconType: 'lucide', description: 'Technical articles', ariaLabel: 'Medium profile' },
	{ name: 'Instagram', key: 'instagram', icon: Instagram, iconType: 'lucide', description: 'Personal updates', ariaLabel: 'Instagram profile' },
]

export function SocialLinks() {
	const { data } = useSWR<{ links?: Record<string, string> }>(
		'/api/homepage/social',
		fetcher,
		{ revalidateOnFocus: true },
	)

	const socialLinks = useMemo(() => {
		const links = data?.links ?? siteConfig.links
		return SOCIAL_DEFS.map((def) => ({
			...def,
			url: (links as Record<string, string>)[def.key] || (siteConfig.links as Record<string, string>)[def.key],
		})).filter((s) => s.url)
	}, [data])

	return (
		<section className="relative w-full" aria-labelledby="social-heading">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-5 sm:mb-6"
			>
				<div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
					<span className={PAGE_ICON_CHIP}>
						<Share2 className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden />
					</span>
					<div>
						<h2 id="social-heading" className={PAGE_H1}>
							Connect & Collaborate
						</h2>
						<p className={cn(PAGE_LEAD, "mt-2 max-w-3xl")}>
							Let&apos;s build secure, scalable solutions together. Connect on these platforms or reach out directly.
						</p>
					</div>
				</div>
			</motion.div>

			<div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-6">
				{socialLinks.map((social, idx) => {
					const Icon = social.icon
					const isComponent = social.iconType === "component"

					return (
						<Link
							key={social.name}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.ariaLabel}
							className="no-underline touch-target group/social"
							data-cursor="pointer"
						>
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: idx * 0.06, duration: 0.35 }}
								whileHover={{ y: -4 }}
								className={cn(
									PAGE_CARD_LIGHT,
									"p-4 text-center transition-all hover:border-amber-400 hover:shadow-md sm:p-5 md:p-6",
								)}
							>
								<div className="relative z-10 space-y-3">
									<span className="mx-auto inline-flex rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-400 sm:p-3">
										{isComponent ? (
											<Icon className="h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden />
										) : (
											<Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
										)}
									</span>
									<div className="space-y-1">
										<h3 className="text-xs font-semibold text-foreground transition-colors group-hover/social:text-amber-700 dark:group-hover/social:text-amber-400 sm:text-sm">
											{social.name}
										</h3>
										<p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
											{social.description}
										</p>
									</div>
								</div>
							</motion.div>
						</Link>
					)
				})}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className={cn(PAGE_CARD_LIGHT, "p-5 sm:p-6 md:p-8 lg:p-10")}
			>
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
					<div className="flex items-center gap-3 sm:gap-4">
						<span className={PAGE_ICON_CHIP}>
							<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
						</span>
						<div>
							<h3 className="mb-1 text-lg font-semibold text-foreground sm:text-xl md:text-2xl">
								Ready to Start a Project?
							</h3>
							<p className="text-xs text-muted-foreground sm:text-sm md:text-base">
								Let&apos;s discuss how we can work together to build something amazing.
							</p>
						</div>
					</div>
					<Link href="/contact" className="no-underline touch-target" data-cursor="pointer">
						<Button className="bg-amber-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500">
							<Mail className="mr-2 h-5 w-5" aria-hidden />
							Get In Touch
							<ArrowRight className="ml-2 h-5 w-5" aria-hidden />
						</Button>
					</Link>
				</div>
			</motion.div>
		</section>
	)
}
