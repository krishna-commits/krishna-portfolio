'use client'

import { StickySidebar } from './sticky-sidebar'

export function StickySidebarNav() {
	const sections = [
		{ id: 'home', label: 'Home', href: '#home' },
		{ id: 'stats-heading', label: 'Metrics', href: '#stats-heading' },
		{ id: 'skills', label: 'Tech Stack', href: '#skills' },
		{ id: 'education-heading', label: 'Background', href: '#education-heading' },
		{ id: 'research-nav', label: 'Research', href: '/research-core', isRoute: true },
		{ id: 'certifications-heading', label: 'Certifications', href: '#certifications-heading' },
		{ id: 'security', label: 'Security', href: '#security' },
		{ id: 'projects', label: 'Projects', href: '#projects' },
	]

	return <StickySidebar sections={sections} />
}

