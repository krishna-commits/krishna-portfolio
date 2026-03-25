import { generatePageMetadata } from '../metadata'

export const metadata = generatePageMetadata({
	title: 'Mantras',
	description:
		'Personal principles, insights, and guiding philosophies that shape my approach to research, engineering, and continuous learning.',
	path: '/mantras',
})

export default function MantrasSegmentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
