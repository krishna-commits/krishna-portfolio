'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Badge } from 'app/theme/components/ui/badge';
import {
  Heart,
  Mail,
  Image as ImageIcon,
  FileText,
  Database,
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Home,
  Search,
  Lock,
  Shield,
  Cloud,
  RefreshCw,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from 'app/theme/lib/utils';
import { StatCard } from './components/charts/stat-card';
import { AdminLineChart } from './components/charts/line-chart';
import { AdminBarChart } from './components/charts/bar-chart';
import { AdminPieChart } from './components/charts/pie-chart';

interface AdminStats {
  hobbies: {
    total: number;
    active: number;
    inactive: number;
  };
  newsletter: {
    total: number;
    recent: number;
    weekly: number;
    monthly: number;
  };
  content: {
    blogPosts: number;
    researchArticles: number;
    projects: number;
  };
  newsletterChartData?: Array<{
    name: string;
    Subscribers: number;
    date: string;
  }>;
  hobbiesChartData?: Array<{
    name: string;
    value: number;
  }>;
  activityData?: Array<{
    name: string;
    Hobbies: number;
    Subscribers: number;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    hobbies: { total: 0, active: 0, inactive: 0 },
    newsletter: { total: 0, recent: 0, weekly: 0, monthly: 0 },
    content: { blogPosts: 0, researchArticles: 0, projects: 0 },
    newsletterChartData: [],
    hobbiesChartData: [],
    activityData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch stats (${response.status})`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load stats';
      setError(errorMessage);
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
              <BarChart3 className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Overview of your portfolio statistics and quick actions
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500">
                  <X className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Error loading dashboard</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
                  <Button
                    onClick={fetchStats}
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Hobbies"
            value={stats.hobbies.total}
            subtitle={`${stats.hobbies.active} active, ${stats.hobbies.inactive} inactive`}
            icon={Heart}
            gradient="from-rose-500 to-pink-500"
            iconColor="text-rose-500"
          />
          
          <StatCard
            title="Newsletter Subscribers"
            value={stats.newsletter.total}
            subtitle={`${stats.newsletter.recent} new this week`}
            icon={Mail}
            gradient="from-blue-500 to-cyan-500"
            iconColor="text-blue-500"
            trend={stats.newsletter.total > 0 ? {
              value: Math.round((stats.newsletter.recent / stats.newsletter.total) * 100),
              isPositive: true,
            } : undefined}
          />
          
          <StatCard
            title="Blog Posts"
            value={stats.content.blogPosts}
            subtitle="Published articles"
            icon={FileText}
            gradient="from-amber-500 to-orange-500"
            iconColor="text-amber-500"
          />
          
          <StatCard
            title="Research Articles"
            value={stats.content.researchArticles}
            subtitle="Research publications"
            icon={BarChart3}
            gradient="from-purple-500 to-indigo-500"
            iconColor="text-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.newsletterChartData && stats.newsletterChartData.length > 0 && (
            <AdminLineChart
              data={stats.newsletterChartData}
              title="Newsletter Subscribers Trend"
              description="New subscriptions over the last 7 days"
              dataKey="Subscribers"
              color="#3b82f6"
            />
          )}

          {stats.hobbies && (
            <AdminPieChart
              data={[
                { name: 'Active', value: stats.hobbies.active },
                { name: 'Inactive', value: stats.hobbies.inactive },
              ].filter(item => item.value > 0)}
              title="Hobbies Distribution"
              description="Active vs inactive hobbies"
            />
          )}
        </div>

        {stats.activityData && stats.activityData.length > 0 && (
          <div className="mb-8">
            <AdminBarChart
              data={stats.activityData}
              title="Activity Overview"
              description="Daily activity for hobbies and newsletter subscriptions"
              dataKeys={['Hobbies', 'Subscribers']}
              colors={['#ec4899', '#3b82f6']}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 rounded-full -mr-20 -mt-20" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/upload-images">
                <Button variant="outline" className="w-full justify-start group hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                  <ImageIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Upload Images
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/admin/hobbies">
                <Button variant="outline" className="w-full justify-start group hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
                  <Heart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Manage Hobbies
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/admin/newsletter">
                <Button variant="outline" className="w-full justify-start group hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Newsletter
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 rounded-full -mr-20 -mt-20" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>Manage content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/homepage">
                <Button variant="outline" className="w-full justify-start group hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                  <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Homepage
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button variant="outline" className="w-full justify-start group hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                  <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  MDX Content
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 rounded-full -mr-20 -mt-20" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                  <BarChart3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Portfolio Analytics
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/admin/cloudflare">
                <Button variant="outline" className="w-full justify-start group hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                  <Cloud className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Cloudflare Metrics
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system configuration and health</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className={cn(
                  "relative h-4 w-4 rounded-full",
                  stats.hobbies.total > 0 ? "bg-green-500" : "bg-yellow-500"
                )}>
                  {stats.hobbies.total > 0 && (
                    <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-500 animate-ping opacity-75" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Database</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stats.hobbies.total > 0 ? "Connected & Operational" : "Not configured"}
                  </div>
                </div>
                <Badge variant={stats.hobbies.total > 0 ? "default" : "secondary"}>
                  {stats.hobbies.total > 0 ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="relative h-4 w-4 rounded-full bg-green-500">
                  <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Blob Storage</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ready for uploads</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="relative h-4 w-4 rounded-full bg-green-500">
                  <div className="absolute inset-0 h-4 w-4 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">API Routes</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">All endpoints operational</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
