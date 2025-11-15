import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { listMDXFiles, readMDXFile, writeMDXFile, deleteMDXFile, ContentType } from 'app/lib/content-utils';
import path from 'path';

export const dynamic = 'force-dynamic';

// GET - List all content files
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as ContentType;
    const subfolder = searchParams.get('subfolder') || undefined;

    if (!type || !['blog', 'project', 'research', 'mantra'].includes(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const files = await listMDXFiles(type, subfolder);
    const contentList = [];

    for (const file of files) {
      try {
        const { frontmatter } = await readMDXFile(type, file);
        contentList.push({
          filepath: file,
          title: frontmatter.title || path.basename(file, '.mdx'),
          ...frontmatter,
        });
      } catch (error) {
        // Skip files that can't be read
        console.warn(`Failed to read ${file}:`, error);
      }
    }

    return NextResponse.json({ files: contentList }, { status: 200 });
  } catch (error: any) {
    console.error('[Content API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content list' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, filepath, frontmatter, content: bodyContent } = body;

    if (!type || !['blog', 'project', 'research', 'mantra'].includes(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!filepath || !frontmatter || bodyContent === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: filepath, frontmatter, content' },
        { status: 400 }
      );
    }

    const fullPath = await writeMDXFile(type, filepath, frontmatter, bodyContent);

    return NextResponse.json(
      { message: 'Content created successfully', filepath: fullPath },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Content API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create content' },
      { status: 500 }
    );
  }
}

// PUT - Update existing content
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, filepath, newFilepath, frontmatter, content: bodyContent } = body;

    if (!type || !['blog', 'project', 'research', 'mantra'].includes(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!filepath || !frontmatter || bodyContent === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: filepath, frontmatter, content' },
        { status: 400 }
      );
    }

    // If filepath changed, delete old file and create new one
    if (newFilepath && newFilepath !== filepath) {
      await deleteMDXFile(type, filepath);
      const fullPath = await writeMDXFile(type, newFilepath, frontmatter, bodyContent);
      return NextResponse.json(
        { message: 'Content updated and moved successfully', filepath: fullPath },
        { status: 200 }
      );
    }

    // Otherwise, just update the existing file
    const fullPath = await writeMDXFile(type, filepath, frontmatter, bodyContent);

    return NextResponse.json(
      { message: 'Content updated successfully', filepath: fullPath },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Content API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as ContentType;
    const filepath = searchParams.get('filepath');

    if (!type || !['blog', 'project', 'research', 'mantra'].includes(type)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    if (!filepath) {
      return NextResponse.json({ error: 'Missing filepath parameter' }, { status: 400 });
    }

    await deleteMDXFile(type, filepath);

    return NextResponse.json(
      { message: 'Content deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Content API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete content' },
      { status: 500 }
    );
  }
}
