import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { allProjects } from 'contentlayer/generated';
import { allBlogPosts } from 'contentlayer/generated';

export const dynamic = 'force-dynamic';

// GET - Get enhanced analytics with visitor, performance, and external metrics
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

    // ============ VISITOR ANALYTICS ============
    const visitors = await prisma.visitor.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
    });

    const pageViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
    });

    // Unique visitors (by session ID)
    const uniqueSessions = new Set(visitors.map(v => v.sessionId));
    const uniqueVisitors = uniqueSessions.size;

    // Total page views
    const totalPageViews = pageViews.length;

    // Traffic by country
    const trafficByCountry: Record<string, number> = {};
    visitors.forEach(v => {
      const country = v.country || 'Unknown';
      trafficByCountry[country] = (trafficByCountry[country] || 0) + 1;
    });

    // Traffic by pathname
    const trafficByPath: Record<string, number> = {};
    pageViews.forEach(pv => {
      trafficByPath[pv.pathname] = (trafficByPath[pv.pathname] || 0) + 1;
    });

    // Top pages
    const topPages = Object.entries(trafficByPath)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pathname, views]) => ({ pathname, views }));

    // Traffic sources (referrers)
    const trafficSources: Record<string, number> = {};
    visitors.forEach(v => {
      if (v.referrer) {
        try {
          const url = new URL(v.referrer);
          const domain = url.hostname.replace('www.', '');
          trafficSources[domain] = (trafficSources[domain] || 0) + 1;
        } catch {
          trafficSources['Direct'] = (trafficSources['Direct'] || 0) + 1;
        }
      } else {
        trafficSources['Direct'] = (trafficSources['Direct'] || 0) + 1;
      }
    });

    // Daily visitor trends
    const dailyVisitors: Record<string, { visitors: number; pageViews: number; unique: Set<string> }> = {};
    visitors.forEach(v => {
      const date = new Date(v.createdAt).toISOString().split('T')[0];
      if (!dailyVisitors[date]) {
        dailyVisitors[date] = { visitors: 0, pageViews: 0, unique: new Set() };
      }
      dailyVisitors[date].visitors++;
      dailyVisitors[date].unique.add(v.sessionId);
    });

    pageViews.forEach(pv => {
      const date = new Date(pv.createdAt).toISOString().split('T')[0];
      if (!dailyVisitors[date]) {
        dailyVisitors[date] = { visitors: 0, pageViews: 0, unique: new Set() };
      }
      dailyVisitors[date].pageViews++;
    });

    const dailyTrends = Object.entries(dailyVisitors)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-days)
      .map(([date, data]) => ({
        date,
        visitors: data.visitors,
        pageViews: data.pageViews,
        unique: data.unique.size,
      }));

    // ============ ENGAGEMENT METRICS ============
    const totalTimeOnPage = pageViews.reduce((sum, pv) => sum + pv.timeOnPage, 0);
    const averageTimeOnPage = pageViews.length > 0 
      ? Math.round(totalTimeOnPage / pageViews.length) 
      : 0;

    const totalScrollDepth = pageViews.reduce((sum, pv) => sum + pv.scrollDepth, 0);
    const averageScrollDepth = pageViews.length > 0
      ? Math.round(totalScrollDepth / pageViews.length)
      : 0;

    const bounceCount = pageViews.filter(pv => pv.bounce).length;
    const bounceRate = pageViews.length > 0
      ? Math.round((bounceCount / pageViews.length) * 100)
      : 0;

    // ============ PERFORMANCE METRICS ============
    const performanceMetrics = await prisma.performanceMetric.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    // Group by metric type and calculate averages
    const performanceByType: Record<string, any[]> = {};
    performanceMetrics.forEach(metric => {
      if (!performanceByType[metric.metricType]) {
        performanceByType[metric.metricType] = [];
      }
      performanceByType[metric.metricType].push(metric);
    });

    const performanceAverages: Record<string, { average: number; latest: number; score: number | null }> = {};
    Object.entries(performanceByType).forEach(([type, values]) => {
      const sum = values.reduce((acc, v) => acc + v.value, 0);
      const latestScore = values[0]?.score || null;
      performanceAverages[type] = {
        average: parseFloat((sum / values.length).toFixed(2)),
        latest: values[0]?.value || 0,
        score: latestScore,
      };
    });

    // ============ EXTERNAL API METRICS ============
    // Fetch GitHub stats
    let githubStats = null;
    try {
      const githubToken = process.env.GITHUB_ACCESS_TOKEN;
      const githubUsername = process.env.GITHUB_USERNAME || 'neupane-krishna';
      
      if (githubToken) {
        const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (reposResponse.ok) {
          const repos = await reposResponse.json();
          const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
          const totalForks = repos.reduce((sum: number, repo: any) => sum + (repo.forks_count || 0), 0);
          const publicRepos = repos.length;

          githubStats = {
            totalStars,
            totalForks,
            publicRepos,
            topRepos: repos
              .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
              .slice(0, 5)
              .map((repo: any) => ({
                name: repo.name,
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
              })),
          };
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
    }

    // Medium stats (would need Medium API or RSS parsing)
    const mediumStats = {
      totalReads: 25624, // Placeholder - would fetch from Medium API if available
      note: 'Medium API access required for real-time stats',
    };

    // ResearchGate stats (would need ResearchGate API)
    const researchGateStats = {
      note: 'ResearchGate API access required for real-time stats',
    };

    // ============ IP ADDRESSES AND EMAILS ============
    // Unique IP addresses
    const uniqueIPs = new Set(visitors.map(v => v.ipAddress));
    const ipList = Array.from(uniqueIPs).slice(0, 100); // Limit to 100 most recent

    // Visitors with email (if any)
    const visitorsWithEmail = visitors
      .filter(v => v.email)
      .map(v => ({
        email: v.email,
        country: v.country,
        lastVisit: v.createdAt,
      }))
      .slice(0, 50);

    return NextResponse.json({
      visitorAnalytics: {
        totalPageViews,
        uniqueVisitors,
        averageTimeOnPage,
        averageScrollDepth,
        bounceRate,
        dailyTrends,
        topPages,
        trafficByCountry: Object.entries(trafficByCountry)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
          .map(([country, count]) => ({ country, count })),
        trafficSources: Object.entries(trafficSources)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
          .map(([source, count]) => ({ source, count })),
      },
      performanceMetrics: performanceAverages,
      externalMetrics: {
        github: githubStats,
        medium: mediumStats,
        researchGate: researchGateStats,
      },
      details: {
        uniqueIPs: ipList.length,
        ipList: ipList.slice(0, 50), // Return first 50
        visitorsWithEmail: visitorsWithEmail.length > 0 ? visitorsWithEmail : null,
      },
      period: { days, startDate: startDate.toISOString() },
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Enhanced Analytics API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enhanced analytics' },
      { status: 500 }
    );
  }
}

