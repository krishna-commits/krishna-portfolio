/** ~200 words/minute for technical prose */
export function readingTimeMinutes(text: string | undefined | null): number {
	if (!text?.trim()) return 1
	const words = text.trim().split(/\s+/).length
	return Math.max(1, Math.ceil(words / 200))
}

export function formatReadingTime(minutes: number): string {
	return `${minutes} min read`
}
