import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Export analytics data as CSV
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
    const type = searchParams.get('type') || 'visitors';
    const format = searchParams.get('format') || 'csv';
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (type === 'visitors' && format === 'csv') {
      const visitors = await prisma.visitor.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
      });

      // CSV headers
      const headers = [
        'Date',
        'IP Address',
        'Country',
        'City',
        'Region',
        'Pathname',
        'Referrer',
        'Email',
        'Session ID',
        'Time on Page (seconds)',
        'User Agent',
      ];

      // CSV rows
      const rows = visitors.map(v => [
        new Date(v.createdAt).toISOString(),
        v.ipAddress,
        v.country || '',
        v.city || '',
        v.region || '',
        v.pathname,
        v.referrer || '',
        v.email || '',
        v.sessionId,
        v.timeOnPage?.toString() || '',
        v.userAgent?.replace(/,/g, ';') || '',
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="visitors-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (type === 'pageviews' && format === 'csv') {
      const pageViews = await prisma.pageView.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Date', 'Session ID', 'Pathname', 'Time on Page (seconds)', 'Scroll Depth (%)', 'Bounce'];
      const rows = pageViews.map(pv => [
        new Date(pv.createdAt).toISOString(),
        pv.sessionId,
        pv.pathname,
        pv.timeOnPage.toString(),
        pv.scrollDepth.toString(),
        pv.bounce ? 'Yes' : 'No',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="pageviews-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (type === 'performance' && format === 'csv') {
      const metrics = await prisma.performanceMetric.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Date', 'Pathname', 'Metric Type', 'Value', 'Score', 'Metadata'];
      const rows = metrics.map(m => [
        new Date(m.createdAt).toISOString(),
        m.pathname,
        m.metricType,
        m.value.toString(),
        m.score?.toString() || '',
        m.metadata || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="performance-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid type or format' }, { status: 400 });
  } catch (error: any) {
    console.error('[Export Analytics] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export analytics' },
      { status: 500 }
    );
  }
}

