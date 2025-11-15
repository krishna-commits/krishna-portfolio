import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { readMDXFile, ContentType } from 'app/lib/content-utils';

export const dynamic = 'force-dynamic';

// GET - Read specific content file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> | { type: string } }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const type = resolvedParams.type as ContentType;
    const searchParams = request.nextUrl.searchParams;
    const filepath = searchParams.get('filepath');

    if (!type || !['blog', 'project', 'research', 'mantra'].includes(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!filepath) {
      return NextResponse.json({ error: 'Missing filepath parameter' }, { status: 400 });
    }

    const { frontmatter, body } = await readMDXFile(type, filepath);

    return NextResponse.json(
      {
        frontmatter,
        content: body,
        filepath,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Content API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to read content' },
      { status: 500 }
    );
  }
}

