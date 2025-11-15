import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get meta tags
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const metaSetting = await prisma.siteSetting.findUnique({
      where: { key: 'meta_tags' },
    });

    if (!metaSetting) {
      return NextResponse.json({
        title: '',
        description: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: '',
        canonical: '',
      }, { status: 200 });
    }

    return NextResponse.json(JSON.parse(metaSetting.value), { status: 200 });
  } catch (error: any) {
    console.error('[Meta Tags API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch meta tags' },
      { status: 500 }
    );
  }
}

// PUT - Update meta tags
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
    const metaData = {
      title: body.title || '',
      description: body.description || '',
      keywords: body.keywords || '',
      ogTitle: body.ogTitle || '',
      ogDescription: body.ogDescription || '',
      ogImage: body.ogImage || '',
      twitterCard: body.twitterCard || 'summary_large_image',
      twitterTitle: body.twitterTitle || '',
      twitterDescription: body.twitterDescription || '',
      canonical: body.canonical || '',
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'meta_tags' },
      update: { value: JSON.stringify(metaData) },
      create: {
        key: 'meta_tags',
        value: JSON.stringify(metaData),
      },
    });

    return NextResponse.json({
      message: 'Meta tags updated successfully',
      data: JSON.parse(updated.value),
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Meta Tags API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update meta tags' },
      { status: 500 }
    );
  }
}

