import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get security-first approach
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const securityApproach = await prisma.siteSetting.findUnique({
      where: { key: 'security_approach' },
    });

    if (!securityApproach) {
      return NextResponse.json({
        content: '',
      }, { status: 200 });
    }

    return NextResponse.json(JSON.parse(securityApproach.value), { status: 200 });
  } catch (error: any) {
    console.error('[Security Approach API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch security approach' },
      { status: 500 }
    );
  }
}

// PUT - Update security-first approach
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { content } = body;

    const approachData = {
      content: content || '',
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'security_approach' },
      update: { value: JSON.stringify(approachData) },
      create: {
        key: 'security_approach',
        value: JSON.stringify(approachData),
      },
    });

    return NextResponse.json(
      { message: 'Security approach updated successfully', data: JSON.parse(updated.value) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Security Approach API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update security approach' },
      { status: 500 }
    );
  }
}

