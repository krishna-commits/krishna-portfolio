import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route segment config - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunctions = async () => {
  const { verifyCredentials, createSession } = await import('lib/auth');
  return { verifyCredentials, createSession };
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { verifyCredentials, createSession } = await getAuthFunctions();
    const isValid = await verifyCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await createSession(email);

    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Auth API] Login Error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

