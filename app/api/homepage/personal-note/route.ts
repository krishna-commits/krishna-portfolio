import { getSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_PERSONAL_NOTE,
	mergePersonalNote,
	type PersonalNoteConfig,
} from 'lib/personal-note-config'
import { publicJson } from 'lib/public-api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<PersonalNoteConfig> | null>(
			'personal_note',
			null,
		)
		const personalNote = mergePersonalNote(stored)
		return publicJson({ personalNote })
	} catch (error: unknown) {
		console.error('[Personal Note Public API]', error)
		return publicJson({ personalNote: DEFAULT_PERSONAL_NOTE })
	}
}
