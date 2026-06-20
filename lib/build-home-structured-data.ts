import { siteConfig } from 'config/site'
import { prisma } from 'lib/prisma'
import { getEducationFromConfig, getWorkExperienceFromConfig } from 'lib/homepage-data'

type JsonLd = Record<string, unknown>

export async function buildHomeStructuredData(siteOrigin: string): Promise<JsonLd> {
	const personId = `${siteOrigin}/#person`
	const websiteId = `${siteOrigin}/#website`
	const homeDescription = siteConfig.home.description.trim()

	let education = getEducationFromConfig()
	let workExperience = getWorkExperienceFromConfig()

	if (prisma) {
		try {
			const [dbEducation, dbWork] = await Promise.all([
				prisma.education.findMany({ orderBy: { orderIndex: 'asc' } }),
				prisma.workExperience.findMany({ orderBy: { orderIndex: 'asc' } }),
			])
			if (dbEducation.length > 0) education = dbEducation
			if (dbWork.length > 0) {
				workExperience = dbWork.map((w) => ({
					organization: w.organization,
					role: w.role,
					time: w.time,
					description: w.description ?? undefined,
					imageUrl: w.imageUrl ?? undefined,
					url: w.url ?? undefined,
				}))
			}
		} catch {
			// fall back to config
		}
	}

	const alumniOf = education.map((edu) => ({
		'@type': 'EducationalOrganization',
		name: edu.university || edu.organization,
	}))

	const worksFor =
		workExperience.length > 0
			? workExperience.slice(0, 3).map((job) => ({
					'@type': 'Organization',
					name: job.organization,
				}))
			: undefined

	const person: JsonLd = {
		'@type': 'Person',
		'@id': personId,
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
		knowsAbout: siteConfig.talks_about.split(',').map((tag) => tag.trim()),
		mainEntityOfPage: { '@id': websiteId },
	}

	if (alumniOf.length > 0) {
		person.alumniOf = alumniOf
	}
	if (worksFor?.length) {
		person.worksFor = worksFor.length === 1 ? worksFor[0] : worksFor
	}

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': websiteId,
				url: siteOrigin,
				name: siteConfig.name,
				description: homeDescription,
				inLanguage: 'en-US',
				publisher: { '@id': personId },
			},
			person,
		],
	}
}
