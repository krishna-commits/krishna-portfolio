'use client'

import { useEffect, useId, useRef, useState } from 'react'

interface MermaidDiagramProps {
	chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const id = useId().replace(/:/g, '')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false

		async function render() {
			try {
				const mermaid = (await import('mermaid')).default
				mermaid.initialize({
					startOnLoad: false,
					theme: 'neutral',
					securityLevel: 'strict',
				})
				const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim())
				if (!cancelled && containerRef.current) {
					containerRef.current.innerHTML = svg
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to render diagram')
				}
			}
		}

		render()
		return () => {
			cancelled = true
		}
	}, [chart, id])

	if (error) {
		return (
			<pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
				{chart}
			</pre>
		)
	}

	return (
		<div
			ref={containerRef}
			className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 [&_svg]:max-w-full"
			aria-label="Diagram"
		/>
	)
}
