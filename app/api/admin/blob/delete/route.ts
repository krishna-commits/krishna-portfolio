import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// DELETE - Delete a blob by URL
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Blob URL is required' },
        { status: 400 }
      );
    }

    // Delete the blob
    await del(url);

    return NextResponse.json({
      message: 'Blob deleted successfully',
      url,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Blob Delete API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete blob' },
      { status: 500 }
    );
  }
}

// POST - Delete multiple blobs
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Array of blob URLs is required' },
        { status: 400 }
      );
    }

    // Delete all blobs
    const results = await Promise.allSettled(
      urls.map((url: string) => del(url))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      message: `Deleted ${successful} blob(s), ${failed} failed`,
      successful,
      failed,
      total: urls.length,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Blob Delete Multiple API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete blobs' },
      { status: 500 }
    );
  }
}

