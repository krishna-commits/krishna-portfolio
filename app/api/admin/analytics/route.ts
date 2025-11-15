import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';
import { allProjects } from 'contentlayer/generated';
import { allBlogPosts } from 'contentlayer/generated';
import { allResearchCores } from 'contentlayer/generated';
import { allMantras } from 'contentlayer/generated';

export const dynamic = 'force-dynamic';

// GET - Get comprehensive analytics
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Content statistics
    const totalProjects = allProjects.length;
    const totalBlogPosts = allBlogPosts.length;
    const totalResearch = allResearchCores.length;
    const totalMantras = allMantras.length;

    // Database statistics
    let totalHobbies = 0;
    let totalNewsletterSubs = 0;
    let totalEducation = 0;
    let totalWorkExp = 0;
    let totalCertifications = 0;
    let totalRecommendations = 0;
    let totalTechnology = 0;
    let totalVolunteering = 0;

    if (prisma) {
      try {
        totalHobbies = await prisma.hobby.count({ where: { isActive: true } });
        totalNewsletterSubs = await prisma.newsletterSubscriber.count();
        totalEducation = await prisma.education.count();
        totalWorkExp = await prisma.workExperience.count();
        totalCertifications = await prisma.certification.count();
        totalRecommendations = await prisma.linkedInRecommendation.count();
        totalTechnology = await prisma.technologyStack.count();
        totalVolunteering = await prisma.volunteering.count();
      } catch (error) {
        console.error('Error fetching database stats:', error);
      }
    }

    // Newsletter growth over time (last 30 days)
    const newsletterGrowth = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (prisma) {
      try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
          orderBy: { createdAt: 'asc' },
        });

        const subscribersByDate: Record<string, number> = {};
        subscribers.forEach(sub => {
          const date = new Date(sub.createdAt).toISOString().split('T')[0];
          subscribersByDate[date] = (subscribersByDate[date] || 0) + 1;
        });

        let cumulative = 0;
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          cumulative += subscribersByDate[dateStr] || 0;
          newsletterGrowth.push({
            date: dateStr,
            count: cumulative,
            new: subscribersByDate[dateStr] || 0,
          });
        }
      } catch (error) {
        console.error('Error calculating newsletter growth:', error);
      }
    }

    // Content distribution
    const contentDistribution = [
      { name: 'Blog Posts', value: totalBlogPosts, color: '#3b82f6' },
      { name: 'Projects', value: totalProjects, color: '#10b981' },
      { name: 'Research', value: totalResearch, color: '#8b5cf6' },
      { name: 'Mantras', value: totalMantras, color: '#f59e0b' },
    ];

    // Homepage sections activity
    const homepageStats = [
      { name: 'Education', count: totalEducation, icon: '🎓' },
      { name: 'Work Experience', count: totalWorkExp, icon: '💼' },
      { name: 'Certifications', count: totalCertifications, icon: '🏆' },
      { name: 'Recommendations', count: totalRecommendations, icon: '💬' },
      { name: 'Technology Stack', count: totalTechnology, icon: '💻' },
      { name: 'Volunteering', count: totalVolunteering, icon: '❤️' },
    ];

    // Recent content activity (by date)
    const recentBlogPosts = allBlogPosts
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        date: post.date,
        published: new Date(post.date || 0).toLocaleDateString(),
      }));

    const recentProjects = allProjects
      .sort((a, b) => (b.order || 0) - (a.order || 0))
      .slice(0, 5)
      .map(project => ({
        title: project.title,
        date: null,
        published: 'N/A',
      }));

    // Engagement metrics
    const engagementMetrics = {
      totalContent: totalBlogPosts + totalProjects + totalResearch + totalMantras,
      totalHomepageSections: totalEducation + totalWorkExp + totalCertifications + totalRecommendations + totalTechnology + totalVolunteering,
      newsletterSubscribers: totalNewsletterSubs,
      hobbies: totalHobbies,
    };

    // Monthly content creation trend (last 6 months)
    const monthlyContent = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().slice(0, 7); // YYYY-MM
      
      const blogsInMonth = allBlogPosts.filter(post => {
        if (!post.date) return false;
        return new Date(post.date).toISOString().slice(0, 7) === monthStr;
      }).length;

      // Projects don't have date fields, so we can't filter by month
      // Using 0 as placeholder since projects don't have dates
      const projectsInMonth = 0;

      monthlyContent.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        blogs: blogsInMonth,
        projects: projectsInMonth,
      });
    }

    return NextResponse.json({
      overview: {
        totalContent: engagementMetrics.totalContent,
        totalHomepageSections: engagementMetrics.totalHomepageSections,
        newsletterSubscribers: engagementMetrics.newsletterSubscribers,
        hobbies: engagementMetrics.hobbies,
      },
      contentStats: {
        blogPosts: totalBlogPosts,
        projects: totalProjects,
        research: totalResearch,
        mantras: totalMantras,
      },
      homepageStats,
      contentDistribution,
      newsletterGrowth,
      recentContent: {
        blogPosts: recentBlogPosts,
        projects: recentProjects,
      },
      monthlyContent,
      engagementMetrics,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

