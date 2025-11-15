import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getEducationFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all education entries (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let education: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbEducation = await prisma.education.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbEducation.length > 0) {
          education = dbEducation;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Education API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (education.length === 0) {
      const configEducation = getEducationFromConfig();
      education = configEducation.map((edu: any, index: number) => ({
        id: `config-${index}`, // Temporary ID for config items
        organization: edu.organization,
        course: edu.course,
        university: edu.university || null,
        time: edu.time,
        thesis: edu.thesis || null,
        modules: edu.modules || [],
        orderIndex: index,
        _isConfig: true, // Flag to indicate this is from config
      }));
      source = 'config';
    }

    return NextResponse.json({ education, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Education API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// POST - Create new education entry
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
    const { organization, course, university, time, thesis, modules, orderIndex } = body;

    if (!organization || !course || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: organization, course, time' },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: {
        organization,
        course,
        university: university || null,
        time,
        thesis: thesis || null,
        modules: modules || [],
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Education entry created successfully', education },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Education API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create education entry' },
      { status: 500 }
    );
  }
}

// PUT - Update education entry
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
    const { id, organization, course, university, time, thesis, modules, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        organization,
        course,
        university: university || null,
        time,
        thesis: thesis || null,
        modules: modules || [],
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Education entry updated successfully', education },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Education API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update education entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete education entry
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

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Education entry deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Education API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete education entry' },
      { status: 500 }
    );
  }
}

