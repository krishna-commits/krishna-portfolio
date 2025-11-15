import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get stats settings
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ stats: {} }, { status: 200 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'stats' },
    });

    let statsData = {};
    if (setting) {
      try {
        statsData = JSON.parse(setting.value);
      } catch {
        statsData = {};
      }
    }

    return NextResponse.json({ stats: statsData }, { status: 200 });
  } catch (error: any) {
    console.error('[Stats API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats settings' },
      { status: 500 }
    );
  }
}

// POST - Save stats settings
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const valueString = JSON.stringify(body);

    const setting = await prisma.siteSetting.upsert({
      where: { key: 'stats' },
      update: { value: valueString },
      create: { key: 'stats', value: valueString },
    });

    return NextResponse.json(
      { message: 'Stats settings saved successfully', stats: body },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Stats API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save stats settings' },
      { status: 500 }
    );
  }
}

