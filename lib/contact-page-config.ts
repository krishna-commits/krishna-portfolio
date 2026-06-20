export const CONTACT_PAGE_KEY = 'contact_page'

export type ContactPageConfig = {
	pageTitle: string
	pageLead: string
	location: string
	email: string
	emailDescription: string
	phoneDescription: string
	resumeLabel: string
	resumeUrl: string
}

export const DEFAULT_CONTACT_PAGE: ContactPageConfig = {
	pageTitle: 'Get In Touch',
	pageLead:
		'Open to senior DevSecOps and platform security roles  remote from Kathmandu, Nepal.',
	location: 'Kathmandu, Nepal',
	email: 'neupane.krishna33@gmail.com',
	emailDescription: 'neupane.krishna33@gmail.com',
	phoneDescription: 'Available upon request via contact form',
	resumeLabel: 'Request resume',
	resumeUrl: '/contact#send-a-message',
}

export function mergeContactPage(partial?: Partial<ContactPageConfig> | null): ContactPageConfig {
	if (!partial) return DEFAULT_CONTACT_PAGE
	return { ...DEFAULT_CONTACT_PAGE, ...partial }
}
