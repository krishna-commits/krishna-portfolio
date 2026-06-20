import { Metadata } from 'next'
import { generatePageMetadata } from '../metadata'

export const metadata: Metadata = generatePageMetadata({
	title: 'Code Canvas',
	description:
		'Live GitHub repositories from Krishna Neupane  open-source DevSecOps tooling, cloud automation, and infra experiments.',
	path: '/codecanvas',
})

export default function CodeCanvasLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}

