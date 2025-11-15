import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';
import { prisma } from 'lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// GET - Get login attempts (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const email = searchParams.get('email');
    const success = searchParams.get('success');

    const where: any = {};
    if (email) {
      where.email = email;
    }
    if (success !== null) {
      where.success = success === 'true';
    }

    const [attempts, total] = await Promise.all([
      prisma.loginAttempt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.loginAttempt.count({ where }),
    ]);

    // Get account lockout status
    const lockouts = await prisma.accountLockout.findMany({
      where: {
        lockedUntil: {
          gt: new Date(),
        },
      },
    });

    return NextResponse.json({
      attempts,
      total,
      lockouts,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Auth Attempts API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch login attempts' },
      { status: 500 }
    );
  }
}

