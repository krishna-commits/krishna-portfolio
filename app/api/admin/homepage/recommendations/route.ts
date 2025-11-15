import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getRecommendationsFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all recommendations (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let recommendations: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbRecs = await prisma.linkedInRecommendation.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbRecs.length > 0) {
          recommendations = dbRecs;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Recommendations API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (recommendations.length === 0) {
      const configRecs = getRecommendationsFromConfig();
      recommendations = configRecs.map((rec: any, index: number) => ({
        id: `config-${index}`,
        name: rec.name,
        title: rec.title,
        company: rec.company || '',
        text: rec.text,
        date: rec.date || '',
        orderIndex: index,
        _isConfig: true,
      }));
      source = 'config';
    }

    return NextResponse.json({ recommendations, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// POST - Create new recommendation
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
    const { name, title, company, text, date, orderIndex } = body;

    if (!name || !title || !text || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: name, title, text, date' },
        { status: 400 }
      );
    }

    const recommendation = await prisma.linkedInRecommendation.create({
      data: {
        name,
        title,
        company: company || null,
        text,
        date,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Recommendation created successfully', recommendation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create recommendation' },
      { status: 500 }
    );
  }
}

// PUT - Update recommendation
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
    const { id, name, title, company, text, date, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const recommendation = await prisma.linkedInRecommendation.update({
      where: { id },
      data: {
        name,
        title,
        company: company || null,
        text,
        date,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Recommendation updated successfully', recommendation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}

// DELETE - Delete recommendation
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

    await prisma.linkedInRecommendation.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Recommendation deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete recommendation' },
      { status: 500 }
    );
  }
}

