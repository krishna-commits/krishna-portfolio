export type PersonalNoteCard = {
	icon: 'Target' | 'Sparkles' | 'Zap'
	title: string
	description: string
}

export type PersonalNoteConfig = {
	heading: string
	useSimpleContent: boolean
	simpleContent: string
	mainStatement: string
	subStatement: string
	cards: PersonalNoteCard[]
	philosophy: string
	closingStatement: string
}

export const DEFAULT_PERSONAL_NOTE: PersonalNoteConfig = {
	heading: 'What Drives Me',
	useSimpleContent: false,
	simpleContent: '',
	mainStatement:
		'I build secure, scalable cloud systems that protect organizations from evolving threats.',
	subStatement:
		'My passion lies in combining security engineering with automation, creating defense-in-depth architectures that detect, prevent, and respond to attacks automatically.',
	cards: [
		{
			icon: 'Target',
			title: 'Security-First Thinking',
			description:
				'Designing systems with security as the foundation, not an afterthought. Threat modeling and risk assessment guide every architectural decision.',
		},
		{
			icon: 'Sparkles',
			title: 'Automated Defense',
			description:
				'Building security automation that scales—from CI/CD security gates to real-time threat detection and automated incident response.',
		},
		{
			icon: 'Zap',
			title: 'Security Research',
			description:
				'Contributing to security research and open-source security tools. Publishing findings and sharing knowledge with the security community.',
		},
	],
	philosophy:
		"When I'm not securing cloud infrastructure, I'm researching new attack vectors, contributing to security tools, and mentoring the next generation of security engineers.",
	closingStatement: 'Security is a team sport. We\'re stronger together.',
}

export function mergePersonalNote(partial?: Partial<PersonalNoteConfig> | null): PersonalNoteConfig {
	if (!partial) return DEFAULT_PERSONAL_NOTE
	return {
		...DEFAULT_PERSONAL_NOTE,
		...partial,
		cards: partial.cards?.length ? partial.cards : DEFAULT_PERSONAL_NOTE.cards,
	}
}
