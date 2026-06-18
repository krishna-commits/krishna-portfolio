import { generatePageMetadata } from '../metadata'

export const metadata = generatePageMetadata({
	title: 'Research Core',
	description:
		'DevSecOps, cloud security, zero trust, Kubernetes hardening, incident response, and supply chain research — structured technical documentation and applied engineering notes.',
	path: '/research-core',
})

export default function ResearchCoreSegmentLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
