'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { 
  BarChart3, TrendingUp, Users, FileText, Code, Book, Sparkles, Loader2,
  Mail, Heart, Calendar, Eye, Download, Share2, ExternalLink, RefreshCw
} from 'lucide-react';
import { StatCard } from '../components/charts/stat-card';
import { AdminLineChart } from '../components/charts/line-chart';
import { AdminBarChart } from '../components/charts/bar-chart';
import { AdminPieChart } from '../components/charts/pie-chart';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AnalyticsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/analytics', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load analytics</p>
          <Button onClick={() => mutate()}>Retry</Button>
        </div>
      </div>
    );
  }

  const {
    overview,
    contentStats,
    homepageStats,
    contentDistribution,
    newsletterGrowth,
    recentContent,
    monthlyContent,
  } = data;

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Portfolio Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Comprehensive analytics and insights for your portfolio
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => mutate()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Content"
            value={overview?.totalContent || 0}
            icon={FileText}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Newsletter Subs"
            value={overview?.newsletterSubscribers || 0}
            icon={Mail}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Homepage Sections"
            value={overview?.totalHomepageSections || 0}
            icon={Code}
            gradient="from-purple-500 to-indigo-500"
          />
          <StatCard
            title="Active Hobbies"
            value={overview?.hobbies || 0}
            icon={Heart}
            gradient="from-rose-500 to-pink-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Content Distribution */}
          {contentDistribution && contentDistribution.length > 0 && (
            <AdminPieChart
              data={contentDistribution}
              title="Content Distribution"
              description="Distribution of content types"
              height={300}
            />
          )}

          {/* Content Stats */}
          {contentStats && (
            <AdminBarChart
              data={[
                { name: 'Blogs', count: contentStats.blogPosts || 0 },
                { name: 'Projects', count: contentStats.projects || 0 },
                { name: 'Research', count: contentStats.research || 0 },
                { name: 'Mantras', count: contentStats.mantras || 0 },
              ]}
              title="Content Statistics"
              description="Total count by content type"
              dataKeys={['count']}
              height={300}
              colors={['#6366f1']}
            />
          )}
        </div>

        {/* Newsletter Growth */}
        {newsletterGrowth && newsletterGrowth.length > 0 && (
          <AdminLineChart
            data={newsletterGrowth.map((item: { date: string; count: number; new?: number }) => ({ name: item.date, value: item.count }))}
            title="Newsletter Growth (Last 30 Days)"
            description="Subscriber growth over time"
            dataKey="value"
            color="#10b981"
            height={300}
          />
        )}

        {/* Monthly Content Creation */}
        {monthlyContent && monthlyContent.length > 0 && (
          <div className="mb-6">
            <AdminBarChart
              data={monthlyContent}
              title="Monthly Content Creation"
              description="Content published in the last 6 months"
              dataKeys={['blogs', 'projects']}
              height={300}
              colors={['#3b82f6', '#10b981']}
              stacked={true}
            />
          </div>
        )}

        {/* Homepage Sections Stats */}
        {homepageStats && homepageStats.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Homepage Sections</CardTitle>
              <CardDescription>Data count for each homepage section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homepageStats.map((stat: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stat.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            {stat.name}
                          </p>
                          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                            {stat.count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Blog Posts
              </CardTitle>
              <CardDescription>Latest blog posts by publish date</CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent?.blogPosts && recentContent.blogPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentContent.blogPosts.map((post: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Calendar className="inline-block h-3 w-3 mr-1" />
                            {post.published}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No recent blog posts</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <CardDescription>Latest projects by publish date</CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent?.projects && recentContent.projects.length > 0 ? (
                <div className="space-y-3">
                  {recentContent.projects.map((project: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                            {project.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Calendar className="inline-block h-3 w-3 mr-1" />
                            {project.published}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No recent projects</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

