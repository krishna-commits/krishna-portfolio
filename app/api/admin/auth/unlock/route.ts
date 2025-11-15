import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { prisma } from 'lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// POST - Unlock an account
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await prisma.accountLockout.deleteMany({
      where: { email },
    });

    return NextResponse.json(
      { message: 'Account unlocked successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Unlock API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unlock account' },
      { status: 500 }
    );
  }
}

