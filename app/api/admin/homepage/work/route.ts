import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getWorkExperienceFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all work experience entries (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let workExperience: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbWork = await prisma.workExperience.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbWork.length > 0) {
          workExperience = dbWork;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Work Experience API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (workExperience.length === 0) {
      const configWork = getWorkExperienceFromConfig();
      workExperience = configWork.map((work: any, index: number) => ({
        id: `config-${index}`,
        organization: work.organization,
        role: work.role || work.course, // Some configs use 'course' instead of 'role'
        time: work.time,
        description: work.description || null,
        imageUrl: work.imageUrl || work.imageURL || null,
        url: work.url || null,
        orderIndex: index,
        _isConfig: true,
      }));
      source = 'config';
    }

    return NextResponse.json({ workExperience, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
      { status: 500 }
    );
  }
}

// POST - Create new work experience entry
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
    const { organization, role, time, description, imageUrl, url, orderIndex } = body;

    if (!organization || !role || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: organization, role, time' },
        { status: 400 }
      );
    }

    const workExperience = await prisma.workExperience.create({
      data: {
        organization,
        role,
        time,
        description: description || null,
        imageUrl: imageUrl || null,
        url: url || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Work experience entry created successfully', workExperience },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create work experience entry' },
      { status: 500 }
    );
  }
}

// PUT - Update work experience entry
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
    const { id, organization, role, time, description, imageUrl, url, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const workExperience = await prisma.workExperience.update({
      where: { id },
      data: {
        organization,
        role,
        time,
        description: description || null,
        imageUrl: imageUrl || null,
        url: url || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Work experience entry updated successfully', workExperience },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update work experience entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete work experience entry
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

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Work experience entry deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Work Experience API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete work experience entry' },
      { status: 500 }
    );
  }
}
