/** Career start  July 2017 */
export const CAREER_START = new Date(2017, 6, 1)

/** Full years completed since career start, formatted for copy (e.g. "8+"). */
export function getCareerYearsExperience(asOf = new Date()): string {
	let years = asOf.getFullYear() - CAREER_START.getFullYear()
	const monthDelta = asOf.getMonth() - CAREER_START.getMonth()
	const dayDelta = asOf.getDate() - CAREER_START.getDate()

	if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
		years -= 1
	}

	return `${Math.max(0, years)}+`
}

/** Normalize stale "N+ years" counts in stored admin copy. */
export function withCareerYears(text: string): string {
	const label = getCareerYearsExperience()
	return text.replace(/\b\d+\+ years\b/g, `${label} years`)
}
