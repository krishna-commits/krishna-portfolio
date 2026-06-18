export const LEARNING_HUB_PREFIX = "05-learning-and-roadmaps/devops-learning-hub"
const STORAGE_KEY = "krishna-portfolio-learning-hub-visited"

export function isLearningHubPath(pathname: string): boolean {
	return pathname.includes("/research-core/05-learning-and-roadmaps/devops-learning-hub")
}

export function learningHubSlugFromPath(pathname: string): string | null {
	const marker = "/research-core/"
	const idx = pathname.indexOf(marker)
	if (idx === -1) return null
	return pathname.slice(idx + marker.length)
}

export function getVisitedHubSlugs(): string[] {
	if (typeof window === "undefined") return []
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

export function markHubSlugVisited(slug: string): void {
	if (typeof window === "undefined" || !slug.startsWith(LEARNING_HUB_PREFIX)) return
	const visited = new Set(getVisitedHubSlugs())
	visited.add(slug)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visited)))
}

export function hubProgress(articleSlugs: string[]): {
	visited: number
	total: number
	percent: number
} {
	const visitedSet = new Set(getVisitedHubSlugs())
	const total = articleSlugs.length
	const visited = articleSlugs.filter((s) => visitedSet.has(s)).length
	return {
		visited,
		total,
		percent: total === 0 ? 0 : Math.round((visited / total) * 100),
	}
}
