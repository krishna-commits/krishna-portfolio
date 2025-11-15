import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// GET - Get robots.txt content
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const robotsPath = join(process.cwd(), 'public', 'robots.txt');
      const content = await readFile(robotsPath, 'utf-8');
      return NextResponse.json({ content }, { status: 200 });
    } catch (error: any) {
      // File doesn't exist, return default
      const defaultContent = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://krishnaneupane.com'}/sitemap.xml`;

      return NextResponse.json({ content: defaultContent }, { status: 200 });
    }
  } catch (error: any) {
    console.error('[Robots.txt GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to read robots.txt' },
      { status: 500 }
    );
  }
}

// PUT - Update robots.txt
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const robotsPath = join(process.cwd(), 'public', 'robots.txt');
    await writeFile(robotsPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'robots.txt updated successfully',
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Robots.txt PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update robots.txt' },
      { status: 500 }
    );
  }
}

