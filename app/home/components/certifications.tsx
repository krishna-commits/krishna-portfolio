'use client'

import { motion } from "framer-motion"
import { siteConfig } from "config/site"
import { Award, ExternalLink, FileBadge } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "app/theme/components/ui/dialog"
import { Button } from "app/theme/components/ui/button"
import { useState } from "react"
import useSWR from 'swr'
import { PAGE_CARD, PAGE_H1, PAGE_ICON_CHIP, PAGE_LEAD } from "lib/page-layout"
import { cn } from "app/theme/lib/utils"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const getCertificationsByProvider = (certifications: any[] = []) => {
	const certs = certifications
	return {
		aws: certs.filter((c: any) => 
			c.issuedby?.toLowerCase().includes('aws') || 
			c.title?.toLowerCase().includes('aws') ||
			c.issuedby?.toLowerCase().includes('amazon web services')
		),
		okta: certs.filter((c: any) => 
			c.issuedby?.toLowerCase().includes('okta') || 
			c.title?.toLowerCase().includes('okta')
		),
		google: certs.filter((c: any) => 
			(c.title?.toLowerCase().includes('google cloud') ||
			c.title?.toLowerCase().includes('foundations of cybersecurity') ||
			c.issuedby?.toLowerCase().includes('google')) &&
			!c.issuedby?.toLowerCase().includes('coursera') ||
			(c.issuedby?.toLowerCase().includes('google') && c.issuedby?.toLowerCase().includes('coursera'))
		),
		icsi: certs.filter((c: any) => 
			c.issuedby?.toLowerCase().includes('icsi') || 
			c.title?.toLowerCase().includes('icsi') || 
			c.title?.toLowerCase().includes('cnss') ||
			c.issuedby?.toLowerCase().includes('international cybersecurity')
		),
		coursera: certs.filter((c: any) => 
			(c.issuedby?.toLowerCase().includes('coursera') && 
			 !c.issuedby?.toLowerCase().includes('amazon') && 
			 !c.issuedby?.toLowerCase().includes('google') &&
			 !c.issuedby?.toLowerCase().includes('aws')) ||
			c.issuedby?.toLowerCase().includes('university of maryland') ||
			(c.link && c.link.includes('coursera.org') && 
			 !c.title?.toLowerCase().includes('aws') &&
			 !c.title?.toLowerCase().includes('foundations of cybersecurity'))
		),
		other: certs.filter((c: any) => {
			const lowerIssuedBy = c.issuedby?.toLowerCase() || ''
			const lowerTitle = c.title?.toLowerCase() || ''
			return !lowerIssuedBy.includes('aws') && 
			       !lowerIssuedBy.includes('amazon') &&
			       !lowerIssuedBy.includes('okta') &&
			       !lowerTitle.includes('google') &&
			       !lowerIssuedBy.includes('icsi') &&
			       !lowerIssuedBy.includes('international cybersecurity') &&
			       !lowerIssuedBy.includes('coursera') &&
			       !lowerIssuedBy.includes('university of maryland') &&
			       !(c.link && c.link.includes('coursera.org'))
		}),
	}
}

function CertificationItem({ cert }: { cert: any }) {
	const [imageError, setImageError] = useState(false)
	
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button 
					className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
					aria-label={`View ${cert.title} certificate`}
				>
					<div className="flex items-start gap-3">
						{!imageError && cert.imageURL ? (
							<Image
								src={cert.imageURL}
								width={40}
								height={40}
								alt={cert.title}
								className="rounded-lg object-cover flex-shrink-0"
								onError={() => setImageError(true)}
							/>
						) : (
							<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
								<Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
							</div>
						)}
						<div className="flex-1 min-w-0 space-y-1">
							<p className="text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
								{cert.title}
							</p>
							{cert.time && (
								<p className="text-xs text-slate-500 dark:text-slate-500">{cert.time}</p>
							)}
						</div>
					</div>
				</button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogHeader className="text-center space-y-4">
					<DialogTitle className="text-2xl lg:text-3xl font-light text-slate-900 dark:text-slate-50">
						{cert.title}
					</DialogTitle>
					<DialogDescription className="text-base">
						Issued By: {cert.issuedby}
					</DialogDescription>
					<Button asChild variant="link" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
						<Link href={cert.link} target="_blank" rel="noopener noreferrer">
							<FileBadge className="h-4 w-4 mr-2" aria-hidden="true" />
							Verify Certificate
						</Link>
					</Button>
				</DialogHeader>
				<div className="mt-6">
					{!imageError && cert.imageURL ? (
						<Image
							src={cert.imageURL}
							width={1000}
							height={1000}
							alt={cert.title}
							className="w-full h-auto rounded-2xl shadow-2xl"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="w-full h-64 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-2xl flex items-center justify-center">
							<div className="text-center space-y-2">
								<Award className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto" />
								<p className="text-slate-600 dark:text-slate-400">Certificate image unavailable</p>
								<Button asChild variant="outline">
									<Link href={cert.link} target="_blank" rel="noopener noreferrer">
										View Certificate
									</Link>
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}

function CertificationProviderCard({
	provider,
	certifications,
}: {
	provider: string
	certifications: any[]
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -2 }}
			transition={{ duration: 0.3 }}
			className={cn(PAGE_CARD, "p-6 transition-shadow hover:shadow-md")}
		>
			<div className="space-y-6">
				<div className="flex items-center justify-center">
					<span className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white dark:bg-amber-600">
						{provider}
					</span>
				</div>

				<div className="text-center">
					<p className="mb-1 text-3xl font-bold text-foreground">{certifications.length}</p>
					<p className="text-sm text-muted-foreground">
						{certifications.length === 1 ? 'Certification' : 'Certifications'}
					</p>
				</div>

				<div className="space-y-3">
					{certifications.map((cert: any, idx: number) => (
						<CertificationItem key={`${cert.title}-${idx}`} cert={cert} />
					))}
				</div>
			</div>
		</motion.div>
	)
}

export function Certifications() {
	const { data } = useSWR('/api/homepage/certifications', fetcher)
	const allCertifications = data?.certifications || siteConfig.certification || []
	const certifications = getCertificationsByProvider(allCertifications)
	const hasCertifications = Object.values(certifications).some(arr => arr.length > 0)

	if (!hasCertifications) return null

	return (
		<section className="relative w-full" aria-labelledby="certifications-heading">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="mb-12"
			>
				<div className="mb-10 flex flex-wrap items-center gap-3">
					<span className={PAGE_ICON_CHIP}>
						<Award className="h-5 w-5" aria-hidden />
					</span>
					<h2 id="certifications-heading" className={PAGE_H1}>
						Professional Certifications
					</h2>
				</div>
				<p className={cn(PAGE_LEAD, "mb-10 text-base sm:text-lg")}>
					Industry-recognized certifications and credentials
				</p>
			</motion.div>

			{/* Certification Providers Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
				{certifications.aws.length > 0 && (
					<CertificationProviderCard provider="AWS" certifications={certifications.aws} />
				)}

				{certifications.google.length > 0 && (
					<CertificationProviderCard provider="Google" certifications={certifications.google} />
				)}

				{certifications.coursera.length > 0 && (
					<CertificationProviderCard provider="Coursera" certifications={certifications.coursera} />
				)}

				{certifications.okta.length > 0 && (
					<CertificationProviderCard provider="Okta" certifications={certifications.okta} />
				)}

				{certifications.icsi.length > 0 && (
					<CertificationProviderCard provider="ICSI" certifications={certifications.icsi} />
				)}

				{certifications.other.length > 0 && (
					<CertificationProviderCard provider="Other" certifications={certifications.other} />
				)}
			</div>
		</section>
	)
}

