/** Prefer API rows; fall back to config when the API returns an empty array. */
export function mergeHomepageList<T>(fromApi: T[] | undefined, fromConfig: T[]): T[] {
	if (fromApi && fromApi.length > 0) return fromApi
	return fromConfig
}
