import { getCareerYearsExperience } from 'lib/career-years'

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
	heading: 'About Krishna',
	useSimpleContent: false,
	simpleContent: '',
	mainStatement:
		'DevSecOps engineer with roots in systems, networking, and security  I keep challenging a problem until it cracks.',
	subStatement:
		`Based in Kathmandu, I have spent ${getCareerYearsExperience()} years simplifying complex infrastructure, automating delivery pipelines, and helping teams ship without getting blocked. I care as much about collaboration and mentoring as I do about reliable production systems.`,
	cards: [
		{
			icon: 'Target',
			title: 'Solve the blocker',
			description:
				'Troubleshoot production issues, untangle complex systems, and turn them into repeatable automation  Jenkins to GitHub Actions, on-prem to cloud.',
		},
		{
			icon: 'Sparkles',
			title: 'Build with teams',
			description:
				'Partner with engineers on scaling, load balancing, containers, and secure CI/CD  from Vianet and Leapfrog to BeyondID.',
		},
		{
			icon: 'Zap',
			title: 'Learn in public',
			description:
				'MSc in Applied Security, Research Core notes, Medium articles, and open-source tools  research feeds how I engineer in production.',
		},
	],
	philosophy:
		'I give equal importance to life and work. Outside the terminal: community service through Rotaract and education programs, and sharing what I learn along the way.',
	closingStatement: 'Curious, collaborative, and always ready for the next hard problem.',
}

export function mergePersonalNote(partial?: Partial<PersonalNoteConfig> | null): PersonalNoteConfig {
	if (!partial) return DEFAULT_PERSONAL_NOTE
	return {
		...DEFAULT_PERSONAL_NOTE,
		...partial,
		cards: partial.cards?.length ? partial.cards : DEFAULT_PERSONAL_NOTE.cards,
	}
}
