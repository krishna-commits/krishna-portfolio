import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunctions = async () => {
  const { readSession } = await import('lib/auth');
  return { readSession };
};

export async function GET(request: NextRequest) {
  try {
    const { readSession } = await getAuthFunctions();
    const session = await readSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          email: session.email,
          userId: session.userId,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}

