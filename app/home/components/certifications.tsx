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
	gradient,
	bgGradient,
}: {
	provider: string
	certifications: any[]
	gradient: string
	bgGradient: string
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ scale: 1.02, y: -4 }}
			transition={{ duration: 0.3 }}
			className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300"
		>
			<div className="space-y-6">
				{/* Provider Name */}
				<div className="flex items-center justify-center">
					<div className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${gradient} text-white font-bold text-base`}>
						{provider}
					</div>
				</div>

				{/* Certifications Count */}
				<div className="text-center">
					<p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">{certifications.length}</p>
					<p className="text-sm text-slate-500 dark:text-slate-500">
						{certifications.length === 1 ? 'Certification' : 'Certifications'}
					</p>
				</div>

				{/* Certifications List */}
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
				<div className="inline-flex items-center gap-3 mb-4">
					<div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600">
						<Award className="h-6 w-6 text-white" aria-hidden="true" />
					</div>
					<h2 id="certifications-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						Professional Certifications
					</h2>
				</div>
				<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
					Industry-recognized certifications and credentials
				</p>
			</motion.div>

			{/* Certification Providers Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{certifications.aws.length > 0 && (
					<CertificationProviderCard
						provider="AWS"
						certifications={certifications.aws}
						gradient="from-orange-500 via-red-500 to-orange-600"
						bgGradient="from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
					/>
				)}

				{certifications.google.length > 0 && (
					<CertificationProviderCard
						provider="Google"
						certifications={certifications.google}
						gradient="from-yellow-400 via-amber-500 to-yellow-600"
						bgGradient="from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20"
					/>
				)}

				{certifications.coursera.length > 0 && (
					<CertificationProviderCard
						provider="Coursera"
						certifications={certifications.coursera}
						gradient="from-blue-500 to-indigo-600"
						bgGradient="from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
					/>
				)}

				{certifications.okta.length > 0 && (
					<CertificationProviderCard
						provider="Okta"
						certifications={certifications.okta}
						gradient="from-blue-400 to-sky-500"
						bgGradient="from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20"
					/>
				)}

				{certifications.icsi.length > 0 && (
					<CertificationProviderCard
						provider="ICSI"
						certifications={certifications.icsi}
						gradient="from-sky-400 to-blue-500"
						bgGradient="from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20"
					/>
				)}

				{certifications.other.length > 0 && (
					<CertificationProviderCard
						provider="Other"
						certifications={certifications.other}
						gradient="from-slate-500 to-slate-700"
						bgGradient="from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20"
					/>
				)}
			</div>
		</section>
	)
}

