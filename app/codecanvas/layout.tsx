import { Metadata } from 'next'
import { generatePageMetadata } from '../metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Code Canvas',
	description: 'A curated collection of repositories demonstrating production-ready engineering practices, research implementations, and open-source contributions.',
	path: '/codecanvas',
})

export default function CodeCanvasLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}

