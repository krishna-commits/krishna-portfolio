'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { 
  Cloud, TrendingUp, Server, Zap, Download, Globe, Eye, 
  RefreshCw, Loader2, AlertCircle, CheckCircle2, BarChart3,
  Upload, Activity
} from 'lucide-react';
import { StatCard } from '../components/charts/stat-card';
import { AdminLineChart } from '../components/charts/line-chart';
import { AdminBarChart } from '../components/charts/bar-chart';
import { AdminPieChart } from '../components/charts/pie-chart';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CloudflareAnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/cloudflare/analytics?days=${days}`, 
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading Cloudflare analytics...</p>
        </div>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-900 dark:text-red-100">
                  Cloudflare Analytics Error
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {data?.error || error?.message || 'Failed to load Cloudflare analytics'}
              </p>
              {data?.message && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  {data.message}
                </p>
              )}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                  To enable Cloudflare Analytics:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <li>Go to Cloudflare Dashboard → Your Domain → Overview</li>
                  <li>Copy your Zone ID (found in the right sidebar)</li>
                  <li>Create an API Token: Account → API Tokens → Create Token</li>
                  <li>Grant permissions: Zone → Zone → Read</li>
                  <li>Add to Vercel Environment Variables:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">CLOUDFLARE_ZONE_ID</code></li>
                      <li><code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">CLOUDFLARE_API_TOKEN</code></li>
                    </ul>
                  </li>
                </ol>
              </div>
              <Button onClick={() => mutate()} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { summary, chartData, dailyData } = data || {};

  if (!summary) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No data available</p>
      </div>
    );
  }

  // Ensure dailyData is available
  const safeDailyData = dailyData || [];

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Cloudflare Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Traffic, bandwidth, and cache performance metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      days === d
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={() => mutate()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Requests"
            value={formatNumber(summary.totalRequests)}
            subtitle={`${formatNumber(summary.avgRequestsPerDay)} avg/day`}
            icon={Globe}
            gradient="from-blue-500 to-cyan-500"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Total Bandwidth"
            value={formatBytes(summary.totalBytes)}
            subtitle={`${formatBytes(summary.bandwidthSaved)} saved`}
            icon={Download}
            gradient="from-purple-500 to-pink-500"
            iconColor="text-purple-500"
          />
          <StatCard
            title="Cache Hit Rate"
            value={`${summary.cacheHitRate.toFixed(1)}%`}
            subtitle={`${formatNumber(summary.totalCachedRequests)} cached`}
            icon={Zap}
            gradient="from-green-500 to-emerald-500"
            iconColor="text-green-500"
            trend={summary.cacheHitRate > 80 ? {
              value: Math.round(summary.cacheHitRate),
              isPositive: true,
            } : undefined}
          />
          <StatCard
            title="Page Views"
            value={formatNumber(summary.totalPageViews)}
            subtitle={`Over ${summary.days} days`}
            icon={Eye}
            gradient="from-orange-500 to-red-500"
            iconColor="text-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Requests Over Time
              </CardTitle>
              <CardDescription>Daily HTTP requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLineChart
                data={chartData.requests}
                title=""
                description=""
                dataKey="value"
                color="#3b82f6"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Bandwidth Usage
              </CardTitle>
              <CardDescription>Daily bandwidth in MB</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLineChart
                data={chartData.bandwidth}
                title=""
                description=""
                dataKey="value"
                color="#8b5cf6"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Cache Hit Rate
              </CardTitle>
              <CardDescription>Percentage of cached requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLineChart
                data={chartData.cacheHitRate}
                title=""
                description=""
                dataKey="value"
                color="#10b981"
                suffix="%"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Page Views
              </CardTitle>
              <CardDescription>Daily page views</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminBarChart
                data={chartData.pageViews}
                title=""
                description=""
                dataKey="value"
                color="#f97316"
              />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Summary
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Bandwidth Saved</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {formatBytes(summary.bandwidthSaved)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Through caching
                </div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cached Requests</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {formatNumber(summary.totalCachedRequests)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {((summary.totalCachedRequests / summary.totalRequests) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Requests/Day</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {formatNumber(summary.avgRequestsPerDay)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Over {summary.days} days
                </div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Data Transferred</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {formatBytes(summary.totalBytes)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {formatBytes(summary.totalCachedBytes)} cached
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Cache Performance
              </CardTitle>
              <CardDescription>Cached vs Uncached requests</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPieChart
                data={[
                  { 
                    name: 'Cached', 
                    value: summary.totalCachedRequests,
                    color: '#10b981'
                  },
                  { 
                    name: 'Uncached', 
                    value: summary.totalRequests - summary.totalCachedRequests,
                    color: '#ef4444'
                  }
                ]}
                title=""
                description=""
                dataKey="value"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Bandwidth Distribution
              </CardTitle>
              <CardDescription>Cached vs Uncached bandwidth</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPieChart
                data={[
                  { 
                    name: 'Cached Bandwidth', 
                    value: Math.round(summary.totalCachedBytes / 1024 / 1024), // MB
                    color: '#10b981'
                  },
                  { 
                    name: 'Uncached Bandwidth', 
                    value: Math.round((summary.totalBytes - summary.totalCachedBytes) / 1024 / 1024), // MB
                    color: '#ef4444'
                  }
                ]}
                title=""
                description=""
                dataKey="value"
              />
            </CardContent>
          </Card>
        </div>

        {/* Bandwidth Comparison Chart */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bandwidth Comparison Over Time
            </CardTitle>
            <CardDescription>Cached vs Uncached bandwidth daily</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminBarChart
              data={chartData.bandwidth.map((item: any, idx: number) => ({
                date: item.date,
                'Cached': Math.round((safeDailyData[idx]?.cachedBytes || 0) / 1024 / 1024),
                'Uncached': Math.round(((safeDailyData[idx]?.bytes || 0) - (safeDailyData[idx]?.cachedBytes || 0)) / 1024 / 1024),
              }))}
              title=""
              description=""
              dataKeys={['Cached', 'Uncached']}
              stacked={true}
            />
          </CardContent>
        </Card>

        {/* Detailed Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Statistics
            </CardTitle>
            <CardDescription>Detailed breakdown by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Requests</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Cached</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Cache %</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Bandwidth</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Saved</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-50">Page Views</th>
                  </tr>
                </thead>
                <tbody>
                  {safeDailyData.slice(-10).reverse().map((day: any, idx: number) => (
                    <tr 
                      key={idx} 
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-50 font-medium">
                        {formatNumber(day.requests)}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                        {formatNumber(day.cachedRequests)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${
                          day.cacheHitRate >= 80 
                            ? 'text-green-600 dark:text-green-400' 
                            : day.cacheHitRate >= 60 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {day.cacheHitRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-50">
                        {formatBytes(day.bytes)}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                        {formatBytes(day.bandwidthSaved)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-50">
                        {formatNumber(day.pageViews)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

