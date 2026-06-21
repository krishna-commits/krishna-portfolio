/**
 * Resolve direct Postgres URL for migrations / db push.
 * Falls back to POSTGRES_URL when NON_POOLING still points at localhost.
 */
export function resolveDirectDatabaseUrl(): {
	prismaUrl?: string
	directUrl?: string
	usedFallback: boolean
} {
	const prismaUrl = process.env.POSTGRES_PRISMA_URL
	const directUrl = process.env.POSTGRES_URL_NON_POOLING
	const remoteUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

	let resolvedDirect = directUrl || remoteUrl
	let usedFallback = false

	const directLooksLocal =
		resolvedDirect &&
		/localhost|127\.0\.0\.1/.test(resolvedDirect) &&
		remoteUrl &&
		!/localhost|127\.0\.0\.1/.test(remoteUrl)

	if (directLooksLocal) {
		resolvedDirect = remoteUrl
		usedFallback = true
	}

	if (resolvedDirect) {
		process.env.POSTGRES_URL_NON_POOLING = resolvedDirect
	}

	return { prismaUrl, directUrl: resolvedDirect, usedFallback }
}
