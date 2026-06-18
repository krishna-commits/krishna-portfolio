export const CONTACT_PAGE_KEY = 'contact_page'

export type ContactPageConfig = {
	pageTitle: string
	pageLead: string
	location: string
	emailDescription: string
	phoneDescription: string
}

export const DEFAULT_CONTACT_PAGE: ContactPageConfig = {
	pageTitle: 'Get In Touch',
	pageLead:
		"Have a project in mind or want to collaborate on security research? I'd love to hear from you.",
	location: 'Kathmandu, Nepal',
	emailDescription: 'Available upon request',
	phoneDescription: 'Available upon request',
}

export function mergeContactPage(partial?: Partial<ContactPageConfig> | null): ContactPageConfig {
	if (!partial) return DEFAULT_CONTACT_PAGE
	return { ...DEFAULT_CONTACT_PAGE, ...partial }
}
