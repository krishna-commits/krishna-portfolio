import { getAdminSocialLinks, parseOrcidId } from 'lib/integration-settings'
import { getIntegrationStatsOverrides } from 'lib/integration-stats-config'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const overrides = await getIntegrationStatsOverrides()
		if (overrides.orcid && overrides.orcid.useLiveFetch === false) {
			return publicJson({
				works: [],
				count: overrides.orcid.workCount ?? 0,
				source: 'admin',
			})
		}

		const links = await getAdminSocialLinks()
		const orcidId = parseOrcidId(links.orcid || '')

		if (!orcidId) {
			return publicJson({ error: 'ORCID ID not found' }, 400)
		}

		const response = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 3600 },
		})

		if (!response.ok) {
			const adminCount = overrides.orcid?.workCount
			return publicJson({
				works: [],
				count: adminCount ?? 0,
				source: adminCount != null ? 'admin' : 'error',
			})
		}

		const data = await response.json()
		const works = data.group || []
		const count = overrides.orcid?.workCount ?? works.length

		return publicJson({
			works,
			count,
			source: overrides.orcid?.workCount != null ? 'admin' : 'orcid',
		})
	} catch (error) {
		console.error('ORCID API error:', error)
		return publicJson({ works: [], count: 0, source: 'error' })
	}
}
