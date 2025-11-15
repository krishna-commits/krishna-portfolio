import { NextRequest, NextResponse } from 'next/server';
import { list, head } from '@vercel/blob';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - List all blobs (optionally filtered by folder prefix)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const prefix = folder ? `${folder}/` : '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const cursor = searchParams.get('cursor') || undefined;

    // List blobs with optional prefix (folder filter)
    const { blobs, cursor: nextCursor, hasMore } = await list({
      prefix,
      limit,
      cursor,
    });

    // Organize blobs by folder
    const folders: Record<string, any[]> = {};
    const rootFiles: any[] = [];

    blobs.forEach((blob) => {
      // Extract folder from pathname
      const pathParts = blob.pathname.split('/');
      if (pathParts.length > 1) {
        const folderName = pathParts[0];
        if (!folders[folderName]) {
          folders[folderName] = [];
        }
        folders[folderName].push({
          ...blob,
          filename: pathParts[pathParts.length - 1],
        });
      } else {
        rootFiles.push({
          ...blob,
          filename: blob.pathname,
        });
      }
    });

    // Get folder counts
    const folderStats: Record<string, number> = {};
    for (const [folderName, files] of Object.entries(folders)) {
      folderStats[folderName] = files.length;
    }

    return NextResponse.json({
      blobs,
      folders,
      rootFiles,
      folderStats,
      hasMore,
      nextCursor,
      total: blobs.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Blob List API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list blobs' },
      { status: 500 }
    );
  }
}

