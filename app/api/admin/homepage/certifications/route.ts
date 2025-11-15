import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { getCertificationsFromConfig } from 'lib/homepage-data';

export const dynamic = 'force-dynamic';

// GET - List all certifications (from database or config/site.tsx)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let certifications: any[] = [];
    let source = 'config';

    // Try to get from database first
    if (prisma) {
      try {
        const dbCerts = await prisma.certification.findMany({
          orderBy: { orderIndex: 'asc' },
        });
        if (dbCerts.length > 0) {
          certifications = dbCerts;
          source = 'database';
        }
      } catch (error) {
        console.warn('[Certifications API] Database error, falling back to config:', error);
      }
    }

    // If not in database, use config/site.tsx
    if (certifications.length === 0) {
      const configCerts = getCertificationsFromConfig();
      certifications = configCerts.map((cert: any, index: number) => ({
        id: `config-${index}`,
        title: cert.title,
        issuedBy: cert.issuedby || cert.issuedBy || '',
        time: cert.time || '',
        imageUrl: cert.imageURL || cert.imageUrl || null,
        link: cert.link || null,
        orderIndex: index,
        _isConfig: true,
      }));
      source = 'config';
    }

    return NextResponse.json({ certifications, _source: source }, { status: 200 });
  } catch (error: any) {
    console.error('[Certifications API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

// POST - Create new certification
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
    const { title, issuedby, imageUrl, link, time, orderIndex } = body;

    if (!title || !issuedby || !imageUrl || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: title, issuedby, imageUrl, time' },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: {
        title,
        issuedby,
        imageUrl,
        link: link || null,
        time,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Certification created successfully', certification },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Certifications API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create certification' },
      { status: 500 }
    );
  }
}

// PUT - Update certification
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
    const { id, title, issuedby, imageUrl, link, time, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        title,
        issuedby,
        imageUrl,
        link: link || null,
        time,
        orderIndex: orderIndex || 0,
      },
    });

    return NextResponse.json(
      { message: 'Certification updated successfully', certification },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Certifications API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update certification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete certification
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

    await prisma.certification.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Certification deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Certifications API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete certification' },
      { status: 500 }
    );
  }
}

