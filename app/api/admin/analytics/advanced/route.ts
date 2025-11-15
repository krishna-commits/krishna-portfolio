import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get advanced analytics (device, browser, user flows, etc.)
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
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const visitors = await prisma.visitor.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        userAgent: true,
        country: true,
        pathname: true,
        sessionId: true,
        createdAt: true,
      },
    });

    // Device & Browser Analytics
    const deviceTypes: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const operatingSystems: Record<string, number> = {};

    visitors.forEach(v => {
      if (!v.userAgent) return;

      const ua = v.userAgent.toLowerCase();

      // Device type
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        deviceTypes['Mobile'] = (deviceTypes['Mobile'] || 0) + 1;
      } else if (ua.includes('tablet') || ua.includes('ipad')) {
        deviceTypes['Tablet'] = (deviceTypes['Tablet'] || 0) + 1;
      } else {
        deviceTypes['Desktop'] = (deviceTypes['Desktop'] || 0) + 1;
      }

      // Browser
      if (ua.includes('chrome') && !ua.includes('edg')) {
        browsers['Chrome'] = (browsers['Chrome'] || 0) + 1;
      } else if (ua.includes('firefox')) {
        browsers['Firefox'] = (browsers['Firefox'] || 0) + 1;
      } else if (ua.includes('safari') && !ua.includes('chrome')) {
        browsers['Safari'] = (browsers['Safari'] || 0) + 1;
      } else if (ua.includes('edg')) {
        browsers['Edge'] = (browsers['Edge'] || 0) + 1;
      } else {
        browsers['Other'] = (browsers['Other'] || 0) + 1;
      }

      // OS
      if (ua.includes('windows')) {
        operatingSystems['Windows'] = (operatingSystems['Windows'] || 0) + 1;
      } else if (ua.includes('mac')) {
        operatingSystems['macOS'] = (operatingSystems['macOS'] || 0) + 1;
      } else if (ua.includes('linux')) {
        operatingSystems['Linux'] = (operatingSystems['Linux'] || 0) + 1;
      } else if (ua.includes('android')) {
        operatingSystems['Android'] = (operatingSystems['Android'] || 0) + 1;
      } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
        operatingSystems['iOS'] = (operatingSystems['iOS'] || 0) + 1;
      } else {
        operatingSystems['Other'] = (operatingSystems['Other'] || 0) + 1;
      }
    });

    // User Flow (session paths)
    const userFlows: Record<string, string[]> = {};
    visitors.forEach(v => {
      if (!userFlows[v.sessionId]) {
        userFlows[v.sessionId] = [];
      }
      userFlows[v.sessionId].push(v.pathname);
    });

    // Calculate most common paths
    const pathSequences: Record<string, number> = {};
    Object.values(userFlows).forEach(flow => {
      if (flow.length > 1) {
        for (let i = 0; i < flow.length - 1; i++) {
          const sequence = `${flow[i]} → ${flow[i + 1]}`;
          pathSequences[sequence] = (pathSequences[sequence] || 0) + 1;
        }
      }
    });

    // Top user flows (most common 2-page sequences)
    const topFlows = Object.entries(pathSequences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([sequence, count]) => ({ sequence, count }));

    // Hourly traffic distribution
    const hourlyTraffic: Record<number, number> = {};
    visitors.forEach(v => {
      const hour = new Date(v.createdAt).getHours();
      hourlyTraffic[hour] = (hourlyTraffic[hour] || 0) + 1;
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      visitors: hourlyTraffic[i] || 0,
      label: `${i}:00`,
    }));

    // Entry pages (first page in session)
    const entryPages: Record<string, number> = {};
    Object.values(userFlows).forEach(flow => {
      if (flow.length > 0) {
        const entry = flow[0];
        entryPages[entry] = (entryPages[entry] || 0) + 1;
      }
    });

    // Exit pages (last page in session)
    const exitPages: Record<string, number> = {};
    Object.values(userFlows).forEach(flow => {
      if (flow.length > 0) {
        const exit = flow[flow.length - 1];
        exitPages[exit] = (exitPages[exit] || 0) + 1;
      }
    });

    return NextResponse.json({
      deviceAnalytics: {
        deviceTypes: Object.entries(deviceTypes).map(([name, count]) => ({ name, count })),
        browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })),
        operatingSystems: Object.entries(operatingSystems).map(([name, count]) => ({ name, count })),
      },
      userFlow: {
        topFlows,
        entryPages: Object.entries(entryPages)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([path, count]) => ({ path, count })),
        exitPages: Object.entries(exitPages)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([path, count]) => ({ path, count })),
        averagePagesPerSession: visitors.length > 0
          ? (Object.values(userFlows).reduce((sum, flow) => sum + flow.length, 0) / Object.keys(userFlows).length).toFixed(2)
          : 0,
      },
      hourlyTraffic: hourlyData,
      period: { days, startDate: startDate.toISOString() },
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Advanced Analytics API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch advanced analytics' },
      { status: 500 }
    );
  }
}

