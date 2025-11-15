import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// POST - Track page view
export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ success: true }); // Silent fail if DB not configured
    }

    const body = await request.json().catch(() => ({}));
    const { pathname, referrer, timeOnPage, scrollDepth, sessionId } = body;

    if (!pathname || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get IP address and user agent from headers
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || null;

    // Try to get geolocation from Vercel (if available)
    const country = headersList.get('x-vercel-ip-country') || null;
    const city = headersList.get('x-vercel-ip-city') || null;
    const region = headersList.get('x-vercel-ip-country-region') || null;

    // Create or update visitor record
    const visitor = await prisma.visitor.create({
      data: {
        ipAddress: ipAddress.split(',')[0], // Take first IP if multiple
        userAgent,
        country,
        city,
        region,
        pathname,
        referrer: referrer || null,
        sessionId,
        timeOnPage: timeOnPage || null,
      },
    });

    // Track page view for engagement metrics
    const bounce = (timeOnPage || 0) < 10 && (scrollDepth || 0) < 25; // Less than 10 seconds and less than 25% scroll = bounce
    
    await prisma.pageView.create({
      data: {
        sessionId,
        pathname,
        timeOnPage: timeOnPage || 0,
        scrollDepth: scrollDepth || 0,
        bounce,
      },
    });

    return NextResponse.json({ success: true, visitorId: visitor.id }, { status: 200 });
  } catch (error: any) {
    console.error('[Track Analytics] Error:', error);
    // Return success even on error to not break user experience
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

// GET - Track page view (for image pixel tracking)
export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return new NextResponse(null, { status: 204 }); // No content
    }

    const { searchParams } = new URL(request.url);
    const pathname = searchParams.get('path') || '/';
    const sessionId = searchParams.get('session') || `sess_${Date.now()}_${Math.random()}`;
    const referrer = request.headers.get('referer') || null;

    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || null;
    const country = headersList.get('x-vercel-ip-country') || null;
    const city = headersList.get('x-vercel-ip-city') || null;
    const region = headersList.get('x-vercel-ip-country-region') || null;

    await prisma.visitor.create({
      data: {
        ipAddress: ipAddress.split(',')[0],
        userAgent,
        country,
        city,
        region,
        pathname,
        referrer,
        sessionId,
      },
    });

    // Return 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[Track Analytics GET] Error:', error);
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      status: 200,
      headers: { 'Content-Type': 'image/gif' },
    });
  }
}

