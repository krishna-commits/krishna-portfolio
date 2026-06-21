import { configAdminIndex, parseAdminRecordId } from 'lib/admin-db-id'

type PutByAdminIdOptions<T> = {
	id: unknown
	importIfEmpty: () => Promise<boolean>
	listOrdered: () => Promise<Array<{ id: number }>>
	update: (dbId: number) => Promise<T>
	create: () => Promise<T>
}

/** Resolve numeric id, config-N index, or create when editing pre-migration config rows. */
export async function putByAdminId<T>({
	id,
	importIfEmpty,
	listOrdered,
	update,
	create,
}: PutByAdminIdOptions<T>): Promise<T> {
	await importIfEmpty()

	const dbId = parseAdminRecordId(id)
	if (dbId) {
		return update(dbId)
	}

	const configIndex = configAdminIndex(id)
	if (configIndex !== null) {
		const rows = await listOrdered()
		const target = rows[configIndex]
		if (target) {
			return update(target.id)
		}
	}

	return create()
}
