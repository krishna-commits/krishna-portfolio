import { siteConfig } from 'config/site'

export const SITE_CHROME_KEY = 'site_chrome'

export type SiteChromeConfig = {
	siteTitle: string
	footerDescription: string
	copyrightText: string
	madeWithName: string
}

export const DEFAULT_SITE_CHROME: SiteChromeConfig = {
	siteTitle: siteConfig.title,
	footerDescription: siteConfig.home.description.trim(),
	copyrightText: siteConfig.copyright?.text || siteConfig.name,
	madeWithName: siteConfig.name,
}

export function mergeSiteChrome(partial?: Partial<SiteChromeConfig> | null): SiteChromeConfig {
	if (!partial) return DEFAULT_SITE_CHROME
	return { ...DEFAULT_SITE_CHROME, ...partial }
}
