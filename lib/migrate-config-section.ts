import { siteConfig } from 'config/site'
import { prisma } from 'lib/prisma'

/** Import config/site.tsx rows into Postgres when a section table is still empty. */
export async function importWorkFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.workExperience.count()
	if (count > 0) return false
	const rows = siteConfig.work_experience || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const work = rows[i] as {
			organization: string
			role: string
			time: string
			description?: string
			imageUrl?: string
			url?: string
		}
		await prisma.workExperience.create({
			data: {
				organization: work.organization,
				role: work.role,
				time: work.time,
				description: work.description || null,
				imageUrl: work.imageUrl || null,
				url: work.url || null,
				orderIndex: i,
			},
		})
	}
	return true
}

export async function importEducationFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.education.count()
	if (count > 0) return false
	const rows = siteConfig.education || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const edu = rows[i]
		await prisma.education.create({
			data: {
				organization: edu.organization,
				course: edu.course,
				university: edu.university || null,
				time: edu.time,
				thesis: edu.thesis || null,
				modules: edu.modules || [],
				orderIndex: i,
			},
		})
	}
	return true
}

export async function importVolunteeringFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.volunteering.count()
	if (count > 0) return false
	const rows = siteConfig.volunteering || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const vol = rows[i]
		await prisma.volunteering.create({
			data: {
				organization: vol.organization,
				role: vol.role,
				time: vol.time,
				duration: vol.duration || null,
				type: vol.type || null,
				orderIndex: i,
			},
		})
	}
	return true
}

export async function importRecommendationsFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.linkedInRecommendation.count()
	if (count > 0) return false
	const rows = siteConfig.linkedin_recommendations || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const rec = rows[i]
		await prisma.linkedInRecommendation.create({
			data: {
				name: rec.name,
				title: rec.title,
				company: rec.company || null,
				text: rec.text,
				date: rec.date,
				orderIndex: i,
			},
		})
	}
	return true
}

export async function importCertificationsFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.certification.count()
	if (count > 0) return false
	const rows = siteConfig.certification || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const cert = rows[i]
		await prisma.certification.create({
			data: {
				title: cert.title,
				issuedby: cert.issuedby,
				imageUrl: cert.imageURL,
				link: cert.link || null,
				time: cert.time,
				orderIndex: i,
			},
		})
	}
	return true
}

export async function importTechnologyFromConfigIfEmpty(): Promise<boolean> {
	if (!prisma) return false
	const count = await prisma.technologyStack.count()
	if (count > 0) return false
	const rows = siteConfig.technology_stack || []
	if (rows.length === 0) return false

	for (let i = 0; i < rows.length; i++) {
		const tech = rows[i]
		await prisma.technologyStack.create({
			data: {
				name: tech.name,
				imageUrl: tech.imageUrl,
				category: null,
				orderIndex: i,
			},
		})
	}
	return true
}
