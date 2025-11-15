import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
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

