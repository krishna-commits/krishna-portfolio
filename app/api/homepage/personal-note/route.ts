import { NextResponse } from 'next/server'
import { getSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_PERSONAL_NOTE,
	mergePersonalNote,
	type PersonalNoteConfig,
} from 'lib/personal-note-config'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const stored = await getSiteSettingJson<Partial<PersonalNoteConfig> | null>(
			'personal_note',
			null,
		)
		const personalNote = mergePersonalNote(stored)
		return NextResponse.json({ personalNote }, { status: 200 })
	} catch (error: unknown) {
		console.error('[Personal Note Public API]', error)
		return NextResponse.json({ personalNote: DEFAULT_PERSONAL_NOTE }, { status: 200 })
	}
}
