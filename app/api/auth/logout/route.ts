import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunctions = async () => {
  const { deleteSession } = await import('lib/auth');
  return { deleteSession };
};

export async function POST(request: NextRequest) {
  try {
    const { deleteSession } = await getAuthFunctions();
    await deleteSession();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Auth API] Logout Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

