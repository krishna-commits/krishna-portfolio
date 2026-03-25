import { generatePageMetadata } from '../metadata'

export const metadata = generatePageMetadata({
	title: 'Research Core',
	description:
		'Academic findings, conference highlights, coding practices, and theoretical summaries in a structured, research-focused format.',
	path: '/research-core',
})

export default function ResearchCoreSegmentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
