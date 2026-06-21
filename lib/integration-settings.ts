import { siteConfig } from 'config/site'
import { getSiteSettingJson } from 'lib/site-settings'
import { getSocialLinksFromConfig } from 'lib/homepage-data'

export type GitHubIntegrationSettings = {
	githubUsername: string
	enabled: boolean
}

export const DEFAULT_GITHUB_INTEGRATION: GitHubIntegrationSettings = {
	githubUsername: 'krishna-commits',
	enabled: true,
}

export type AdminSocialLinks = {
	github?: string
	linkedIn?: string
	researchgate?: string
	orcid?: string
	medium?: string
	twitter?: string
	email?: string
	instagram?: string
}

export async function getGitHubIntegrationSettings(): Promise<GitHubIntegrationSettings> {
	const stored = await getSiteSettingJson<Partial<GitHubIntegrationSettings> | null>('github', null)
	return {
		githubUsername:
			stored?.githubUsername?.trim() ||
			process.env.GITHUB_USERNAME?.trim() ||
			DEFAULT_GITHUB_INTEGRATION.githubUsername,
		enabled: stored?.enabled ?? DEFAULT_GITHUB_INTEGRATION.enabled,
	}
}

export async function getAdminSocialLinks(): Promise<AdminSocialLinks> {
	const stored = await getSiteSettingJson<AdminSocialLinks | null>('social_links', null)
	const fallback = getSocialLinksFromConfig()
	return {
		github: stored?.github || fallback.github || siteConfig.links.github,
		linkedIn: stored?.linkedIn || fallback.linkedIn || siteConfig.links.linkedIn,
		researchgate: stored?.researchgate || fallback.researchgate || siteConfig.links.researchgate,
		orcid: stored?.orcid || fallback.orcid || siteConfig.links.orcid,
		medium: stored?.medium || fallback.medium || siteConfig.links.medium,
		twitter: stored?.twitter || '',
		email: stored?.email || siteConfig.copyright?.email || '',
		instagram: stored?.instagram || fallback.instagram || siteConfig.links.instagram,
	}
}

export function parseMediumUsername(mediumUrl: string): string {
	const fromAt = mediumUrl.split('@').pop()?.split('/')[0]?.split('?')[0]
	if (fromAt) return fromAt
	try {
		const url = new URL(mediumUrl)
		const parts = url.pathname.split('/').filter(Boolean)
		return parts[parts.length - 1] || 'neupane.krishna33'
	} catch {
		return 'neupane.krishna33'
	}
}

export function parseOrcidId(orcidUrl: string): string | null {
	const id = orcidUrl.split('/').pop()?.split('?')[0]?.trim()
	return id && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id) ? id : null
}

export function parseResearchGateSlug(researchgateUrl: string): string | null {
	try {
		const url = new URL(researchgateUrl)
		const match = url.pathname.match(/\/profile\/([^/]+)/i)
		return match?.[1] ?? null
	} catch {
		return null
	}
}
