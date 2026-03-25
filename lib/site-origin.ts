import { siteConfig } from "config/site"

/** Lowercase origin for metadataBase, canonical, and OG URLs (avoids mixed-case host issues). */
export function getSiteOrigin(): string {
	const raw = siteConfig.url.trim()
	const withProto = raw.startsWith("http") ? raw : `https://${raw}`
	try {
		return new URL(withProto).origin
	} catch {
		return "https://krishnaneupane.com"
	}
}

/** Path must start with `/` (e.g. `/privacy`). */
export function canonicalUrl(path: string): string {
	const p = path.startsWith("/") ? path : `/${path}`
	return `${getSiteOrigin()}${p}`
}
