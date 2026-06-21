import { getGitHubIntegrationSettings } from 'lib/integration-settings'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	const settings = await getGitHubIntegrationSettings()
	return publicJson({ github: settings })
}
