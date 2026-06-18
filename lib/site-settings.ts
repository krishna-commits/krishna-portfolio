import { prisma } from 'lib/prisma'

export async function getSiteSettingJson<T>(key: string, fallback: T): Promise<T> {
	if (!prisma) return fallback
	try {
		const row = await prisma.siteSetting.findUnique({ where: { key } })
		if (!row?.value) return fallback
		return JSON.parse(row.value) as T
	} catch {
		return fallback
	}
}

export async function upsertSiteSettingJson<T>(key: string, value: T) {
	if (!prisma) {
		throw new Error('Database not configured')
	}
	const payload = JSON.stringify(value)
	return prisma.siteSetting.upsert({
		where: { key },
		update: { value: payload },
		create: { key, value: payload },
	})
}
