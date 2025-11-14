import { Metadata } from 'next'
import { generatePageMetadata } from '../metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Contact',
	description: 'Ready to collaborate on your next DevSecOps project, discuss cybersecurity solutions, or explore research opportunities? Get in touch and let\'s build something secure and scalable together.',
	path: '/contact',
})

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}

