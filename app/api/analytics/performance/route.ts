import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// POST - Store performance metrics
export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ success: true }); // Silent fail
    }

    const body = await request.json();
    const { pathname, metrics } = body; // metrics: { LCP, FID, CLS, TTFB, FCP, etc. }

    if (!pathname || !metrics) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const records = [];

    // Store each metric
    for (const [metricType, data] of Object.entries(metrics)) {
      const value = typeof data === 'object' ? data.value : data;
      const score = typeof data === 'object' ? data.score : null;
      const metadata = typeof data === 'object' && data.metadata 
        ? JSON.stringify(data.metadata) 
        : null;

      records.push(
        prisma.performanceMetric.create({
          data: {
            pathname,
            metricType: metricType.toUpperCase(),
            value: parseFloat(value.toString()),
            score,
            metadata,
          },
        })
      );
    }

    await Promise.all(records);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Performance Metrics] Error:', error);
    return NextResponse.json({ success: true }, { status: 200 }); // Silent fail
  }
}

// GET - Get performance metrics (admin only)
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
    const pathname = searchParams.get('pathname');
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      createdAt: { gte: startDate },
    };

    if (pathname) {
      where.pathname = pathname;
    }

    const metrics = await prisma.performanceMetric.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    // Group by metric type and calculate averages
    const grouped: Record<string, any[]> = {};
    metrics.forEach(metric => {
      if (!grouped[metric.metricType]) {
        grouped[metric.metricType] = [];
      }
      grouped[metric.metricType].push(metric);
    });

    const averages: Record<string, { average: number; count: number; latest: number }> = {};
    Object.entries(grouped).forEach(([type, values]) => {
      const sum = values.reduce((acc, v) => acc + v.value, 0);
      averages[type] = {
        average: sum / values.length,
        count: values.length,
        latest: values[0]?.value || 0,
      };
    });

    return NextResponse.json({ metrics, averages }, { status: 200 });
  } catch (error: any) {
    console.error('[Performance Metrics GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

