import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get stats from database
    const stats: any = {
      hobbies: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      newsletter: {
        total: 0,
        recent: 0, // Last 7 days
        weekly: 0,
        monthly: 0,
      },
      content: {
        blogPosts: 0,
        researchArticles: 0,
        projects: 0,
      },
      newsletterChartData: [],
      hobbiesChartData: [],
      activityData: [],
    };

    if (prisma) {
      try {
        // Hobbies stats
        const hobbiesTotal = await prisma.hobby.count();
        const hobbiesActive = await prisma.hobby.count({
          where: { isActive: true },
        });

        stats.hobbies.total = hobbiesTotal;
        stats.hobbies.active = hobbiesActive;
        stats.hobbies.inactive = hobbiesTotal - hobbiesActive;

        // Newsletter stats
        const newsletterTotal = await prisma.newsletterSubscriber.count();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newsletterRecent = await prisma.newsletterSubscriber.count({
          where: {
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
        });

        const newsletterMonthly = await prisma.newsletterSubscriber.count({
          where: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        });

        stats.newsletter.total = newsletterTotal;
        stats.newsletter.recent = newsletterRecent;
        stats.newsletter.weekly = newsletterRecent;
        stats.newsletter.monthly = newsletterMonthly;

        // Newsletter chart data (last 7 days)
        const newsletterChartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const count = await prisma.newsletterSubscriber.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });

          newsletterChartData.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            Subscribers: count,
            date: date.toISOString().split('T')[0],
          });
        }
        stats.newsletterChartData = newsletterChartData;

        // Activity data (last 7 days)
        const activityData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const hobbiesCount = await prisma.hobby.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });

          const subscribersCount = await prisma.newsletterSubscriber.count({
            where: {
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });

          activityData.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            Hobbies: hobbiesCount,
            Subscribers: subscribersCount,
            date: date.toISOString().split('T')[0],
          });
        }
        stats.activityData = activityData;
      } catch (dbError) {
        // Database not configured or error
        console.warn('[Admin Stats] Database not available:', dbError);
      }
    }

    // Content stats (from MDX files - would need to fetch from Contentlayer)
    // These are placeholders - in production, you'd fetch from Contentlayer
    stats.content.blogPosts = 0; // Would count from Contentlayer
    stats.content.researchArticles = 0; // Would count from Contentlayer
    stats.content.projects = 0; // Would count from Contentlayer

    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error('[Admin Stats API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

