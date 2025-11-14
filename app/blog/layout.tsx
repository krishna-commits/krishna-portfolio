import { Metadata } from 'next'
import { generatePageMetadata } from '../metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Medium Blog',
	description: 'Technical insights, research reflections, and engineering practices documented for continuous learning and knowledge sharing.',
	path: '/blog',
})

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}

