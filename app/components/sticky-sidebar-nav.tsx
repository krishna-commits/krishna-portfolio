'use client'

import { StickySidebar } from './sticky-sidebar'

export function StickySidebarNav() {
	const sections = [
		{ id: 'home', label: 'Home', href: '#home' },
		{ id: 'stats-heading', label: 'Metrics', href: '#stats-heading' },
		{ id: 'skills', label: 'Tech Stack', href: '#skills' },
		{ id: 'education-heading', label: 'Background', href: '#education-heading' },
		{ id: 'research-heading', label: 'Research', href: '#research-heading' },
		{ id: 'certifications-heading', label: 'Certifications', href: '#certifications-heading' },
		{ id: 'about', label: 'About', href: '#about' },
		{ id: 'security', label: 'Security', href: '#security' },
		{ id: 'projects', label: 'Projects', href: '#projects' },
	]

	return <StickySidebar sections={sections} />
}

