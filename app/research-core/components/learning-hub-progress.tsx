'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
	hubProgress,
	isLearningHubPath,
	learningHubSlugFromPath,
	LEARNING_HUB_PREFIX,
	markHubSlugVisited,
} from 'lib/learning-hub-progress'
import { useResearchCoreConfig } from 'lib/hooks/use-research-core-config'
import { allResearchCores } from 'contentlayer/generated'

const HUB_ARTICLE_SLUGS = allResearchCores
	.filter((doc) => {
		if (!doc.slugAsParams.startsWith(LEARNING_HUB_PREFIX) || doc.parent == null) {
			return false
		}
		const last = doc.slugAsParams.split('/').pop() ?? ''
		return !['chapter-1', 'chapter-2', 'chapter-3', 'introduction'].includes(last)
	})
	.map((doc) => doc.slugAsParams)

export function LearningHubTracker() {
	const pathname = usePathname()

	useEffect(() => {
		if (!pathname || !isLearningHubPath(pathname)) return
		const slug = learningHubSlugFromPath(pathname)
		if (slug) markHubSlugVisited(slug)
	}, [pathname])

	return null
}

export function LearningHubProgressBar() {
	const pathname = usePathname()
	const { config } = useResearchCoreConfig()

	if (!pathname || !isLearningHubPath(pathname)) return null

	const { visited, total, percent } = hubProgress(HUB_ARTICLE_SLUGS)

	return (
		<div className="mx-2 mb-4 mt-auto rounded-lg border border-border bg-muted/40 p-3">
			<div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
				<span>{config.learningHub.progressLabel}</span>
				<span>
					{visited}/{total} articles
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-amber-600 transition-all duration-300"
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	)
}
