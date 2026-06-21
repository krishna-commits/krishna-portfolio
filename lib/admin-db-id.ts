/** Admin lists use `config-0` ids before data is migrated to Postgres. */
export function isConfigAdminId(id: unknown): boolean {
	return typeof id === 'string' && id.startsWith('config-')
}

export function parseAdminRecordId(id: unknown): number | null {
	if (typeof id === 'number' && Number.isFinite(id) && id > 0) return id
	if (typeof id === 'string' && /^\d+$/.test(id)) return parseInt(id, 10)
	return null
}

export function configAdminIndex(id: unknown): number | null {
	if (!isConfigAdminId(id)) return null
	const index = parseInt(String(id).replace('config-', ''), 10)
	return Number.isFinite(index) ? index : null
}
