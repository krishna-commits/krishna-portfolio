export type Publication = {
	title: string
	authors: string[]
	venue: string
	year: string
	type: 'thesis' | 'article' | 'preprint' | 'conference' | 'report'
	link?: string
	doi?: string
	description?: string
}

export const PUBLICATIONS: Publication[] = [
	{
		title: 'Continuous Automation with DevOps practices for Threat Detection',
		authors: ['Krishna Neupane'],
		venue: 'MSc Thesis  London Metropolitan University (Islington College)',
		year: '2023',
		type: 'thesis',
		link: 'https://www.researchgate.net/profile/Krishna-Neupane',
		description:
			'Applied security research on integrating DevOps automation pipelines for continuous threat detection in cloud environments.',
	},
	{
		title: 'Wireless Hotspot: Current and Future Challenges',
		authors: ['Krishna Neupane'],
		venue: 'BSc Thesis  London Metropolitan University (Islington College)',
		year: '2018',
		type: 'thesis',
		description:
			'Analysis of wireless hotspot deployment models, security challenges, and future mitigation approaches.',
	},
]

export function getFeaturedPublications(pubs: Publication[] = PUBLICATIONS): Publication[] {
	const sorted = [...pubs].sort((a, b) => b.year.localeCompare(a.year))
	const primaryThesis = sorted.find((p) => p.type === 'thesis')
	const papers = sorted.filter((p) => p !== primaryThesis && p.type !== 'thesis')

	const extras: Publication[] =
		papers.length >= 2
			? papers.slice(0, 2)
			: [
					...papers,
					...sorted.filter((p) => p !== primaryThesis && p.type === 'thesis'),
				].slice(0, 2)

	if (!primaryThesis) return sorted.slice(0, 3)
	return [primaryThesis, ...extras].slice(0, 3)
}

export const PUBLICATIONS_SECTION = {
	title: 'Publications & Academic Work',
	lead: 'Peer-reviewed and academic outputs. Research Core hosts applied technical notes  structured guides, not journal publications.',
	researchCoreLink: {
		label: 'Browse Research Core (technical notes)',
		href: '/research-core',
	},
	mediumLink: {
		label: 'Read on Medium',
		href: 'https://medium.com/@neupane.krishna33/',
	},
}
