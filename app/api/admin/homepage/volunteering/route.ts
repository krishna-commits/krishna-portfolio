import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getVolunteeringFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all volunteering entries (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let volunteering: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbVolunteering = await prisma.volunteering.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbVolunteering.length > 0) {
          volunteering = dbVolunteering;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Volunteering API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (volunteering.length === 0) {
      const configVolunteering = getVolunteeringFromConfig();
      volunteering = configVolunteering.map((vol: any, index: number) => ({
        id: `config-${index}`,
        organization: vol.organization,
        role: vol.role,
        time: vol.time,
        duration: vol.duration || null,
        type: vol.type || null,
        orderIndex: index,
        _isConfig: true,
      }));
      source = 'config';
    }

    return NextResponse.json({ volunteering, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Volunteering API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteering' },
      { status: 500 }
    );
  }
}

// POST - Create new volunteering entry
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
    const { organization, role, time, duration, type, orderIndex } = body;

    if (!organization || !role || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: organization, role, time' },
        { status: 400 }
      );
    }

    const volunteering = await prisma.volunteering.create({
      data: {
        organization,
        role,
        time,
        duration: duration || null,
        type: type || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Volunteering entry created successfully', volunteering },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Volunteering API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create volunteering entry' },
      { status: 500 }
    );
  }
}

// PUT - Update volunteering entry
export async function PUT(request: NextRequest) {
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
    const { id, organization, role, time, duration, type, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const volunteering = await prisma.volunteering.update({
      where: { id },
      data: {
        organization,
        role,
        time,
        duration: duration || null,
        type: type || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Volunteering entry updated successfully', volunteering },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Volunteering API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update volunteering entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete volunteering entry
export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    await prisma.volunteering.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Volunteering entry deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Volunteering API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete volunteering entry' },
      { status: 500 }
    );
  }
}

