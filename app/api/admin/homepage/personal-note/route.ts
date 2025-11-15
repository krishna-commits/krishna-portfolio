import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get personal note
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const personalNote = await prisma.siteSetting.findUnique({
      where: { key: 'personal_note' },
    });

    if (!personalNote) {
      return NextResponse.json({
        content: '',
      }, { status: 200 });
    }

    return NextResponse.json(JSON.parse(personalNote.value), { status: 200 });
  } catch (error: any) {
    console.error('[Personal Note API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch personal note' },
      { status: 500 }
    );
  }
}

// PUT - Update personal note
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { content } = body;

    const noteData = {
      content: content || '',
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'personal_note' },
      update: { value: JSON.stringify(noteData) },
      create: {
        key: 'personal_note',
        value: JSON.stringify(noteData),
      },
    });

    return NextResponse.json(
      { message: 'Personal note updated successfully', data: JSON.parse(updated.value) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Personal Note API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update personal note' },
      { status: 500 }
    );
  }
}

