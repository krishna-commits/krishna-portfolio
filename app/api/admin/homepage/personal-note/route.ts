import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from 'lib/auth'
import { getSiteSettingJson, upsertSiteSettingJson } from 'lib/site-settings'
import {
	DEFAULT_PERSONAL_NOTE,
	mergePersonalNote,
	type PersonalNoteConfig,
} from 'lib/personal-note-config'

export const dynamic = 'force-dynamic'

export async function GET() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stored = await getSiteSettingJson<Partial<PersonalNoteConfig> | null>(
			'personal_note',
			null,
		)
		return NextResponse.json(mergePersonalNote(stored), { status: 200 })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to fetch personal note'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

    const body = await request.json()
    const stored = await getSiteSettingJson<Partial<PersonalNoteConfig> | null>(
      'personal_note',
      null,
    )
    let patch: Partial<PersonalNoteConfig> = { ...stored, ...body }
    if (typeof body.content === 'string' && body.heading === undefined) {
      patch = {
        ...stored,
        useSimpleContent: true,
        simpleContent: body.content,
      }
    }
    const config = mergePersonalNote(patch)
		await upsertSiteSettingJson('personal_note', config)

		return NextResponse.json(
			{ message: 'Personal note updated successfully', data: config },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to update personal note'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function POST() {
	try {
		const authenticated = await isAuthenticated()
		if (!authenticated) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await upsertSiteSettingJson('personal_note', DEFAULT_PERSONAL_NOTE)
		return NextResponse.json(
			{ message: 'Reset to defaults', data: DEFAULT_PERSONAL_NOTE },
			{ status: 200 },
		)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to reset'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
