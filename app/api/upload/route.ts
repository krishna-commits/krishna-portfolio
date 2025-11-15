import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunction = async () => {
  const { isAuthenticated } = await import('lib/auth');
  return isAuthenticated;
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    // Check authentication
    const isAuthenticated = await getAuthFunction();
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let filename = searchParams.get('filename');
    const folder = searchParams.get('folder') || 'public';

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Normalize folder path (remove leading/trailing slashes)
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '');
    
    // Construct full path with folder prefix
    if (normalizedFolder) {
      filename = `${normalizedFolder}/${filename}`;
    }

    const blob = await request.blob();

    if (!blob) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const putBlobResult = await put(filename, blob, {
      access: 'public',
      addRandomSuffix: true, // Add random suffix to prevent name conflicts
    });

    return NextResponse.json(putBlobResult);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

