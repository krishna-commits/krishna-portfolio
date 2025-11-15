import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getTechnologyStackFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all technology stack items (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let technology: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbTech = await prisma.technologyStack.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbTech.length > 0) {
          technology = dbTech;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Technology API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (technology.length === 0) {
      const configTech = getTechnologyStackFromConfig();
      technology = configTech.map((tech: any, index: number) => ({
        id: `config-${index}`,
        name: tech.name,
        imageUrl: tech.imageUrl || tech.imageURL || null,
        orderIndex: index,
        _isConfig: true,
      }));
      source = 'config';
    }

    return NextResponse.json({ technology, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Technology API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technology stack' },
      { status: 500 }
    );
  }
}

// POST - Create new technology item
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
    const { name, imageUrl, category, orderIndex } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, imageUrl' },
        { status: 400 }
      );
    }

    const technology = await prisma.technologyStack.create({
      data: {
        name,
        imageUrl,
        category: category || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Technology item created successfully', technology },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Technology API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create technology item' },
      { status: 500 }
    );
  }
}

// PUT - Update technology item
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
    const { id, name, imageUrl, category, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const technology = await prisma.technologyStack.update({
      where: { id },
      data: {
        name,
        imageUrl,
        category: category || null,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Technology item updated successfully', technology },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Technology API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update technology item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete technology item
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

    await prisma.technologyStack.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Technology item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Technology API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete technology item' },
      { status: 500 }
    );
  }
}

