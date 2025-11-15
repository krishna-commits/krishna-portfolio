'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { 
  Globe, TrendingUp, Users, Eye, Clock, MousePointerClick, Loader2,
  Download, FileDown, RefreshCw, MapPin, Server, BarChart3, Zap,
  Github, BookOpen, FileText, ExternalLink, Mail, Globe2
} from 'lucide-react';
import { StatCard } from '../../components/charts/stat-card';
import { AdminLineChart } from '../../components/charts/line-chart';
import { AdminBarChart } from '../../components/charts/bar-chart';
import { AdminPieChart } from '../../components/charts/pie-chart';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EnhancedAnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data, error, isLoading, mutate } = useSWR(`/api/admin/analytics/enhanced?days=${days}`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60000, // Refresh every minute
  });
  
  const { data: advancedData, mutate: mutateAdvanced } = useSWR(
    `/api/admin/analytics/advanced?days=${days}`, 
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 60000 }
  );

  const handleExport = async (type: 'visitors' | 'pageviews' | 'performance') => {
    try {
      const response = await fetch(`/api/admin/analytics/export?type=${type}&format=csv&days=${days}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${type} exported successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Export failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading enhanced analytics...</p>
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
    visitorAnalytics,
    performanceMetrics,
    externalMetrics,
    details,
  } = data;

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Enhanced Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Comprehensive visitor, performance, and external metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Button variant="outline" onClick={() => mutate()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download analytics data as CSV files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleExport('visitors')} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export Visitors
              </Button>
              <Button variant="outline" onClick={() => handleExport('pageviews')} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export Page Views
              </Button>
              <Button variant="outline" onClick={() => handleExport('performance')} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export Performance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Page Views"
            value={visitorAnalytics?.totalPageViews || 0}
            icon={Eye}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Unique Visitors"
            value={visitorAnalytics?.uniqueVisitors || 0}
            icon={Users}
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Avg. Time on Page"
            value={`${Math.round(visitorAnalytics?.averageTimeOnPage || 0)}s`}
            icon={Clock}
            gradient="from-purple-500 to-indigo-500"
          />
          <StatCard
            title="Bounce Rate"
            value={`${visitorAnalytics?.bounceRate || 0}%`}
            icon={TrendingUp}
            gradient="from-rose-500 to-pink-500"
          />
        </div>

        {/* Daily Trends */}
        {visitorAnalytics?.dailyTrends && visitorAnalytics.dailyTrends.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Daily Visitor Trends</CardTitle>
              <CardDescription>Page views and unique visitors over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminBarChart
                data={visitorAnalytics.dailyTrends.map((item: any) => ({
                  name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  'Page Views': item.pageViews,
                  'Unique Visitors': item.unique,
                }))}
                title=""
                dataKeys={['Page Views', 'Unique Visitors']}
                height={300}
                colors={['#3b82f6', '#10b981']}
              />
            </CardContent>
          </Card>
        )}

        {/* Traffic by Country and Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Traffic by Country */}
          {visitorAnalytics?.trafficByCountry && visitorAnalytics.trafficByCountry.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Traffic by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {visitorAnalytics.trafficByCountry.slice(0, 20).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          {item.country || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Pages */}
          {visitorAnalytics?.topPages && visitorAnalytics.topPages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {visitorAnalytics.topPages.map((page: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                        {page.pathname}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-2">
                        {page.views}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Traffic Sources */}
        {visitorAnalytics?.trafficSources && visitorAnalytics.trafficSources.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPieChart
                data={visitorAnalytics.trafficSources.slice(0, 10).map((item: any, index: number) => ({
                  name: item.source,
                  value: item.count,
                }))}
                title=""
                height={300}
              />
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        {performanceMetrics && Object.keys(performanceMetrics).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Core Web Vitals
              </CardTitle>
              <CardDescription>Performance metrics (LCP, FID, CLS, TTFB, FCP)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(performanceMetrics).map(([metric, data]: [string, any]) => (
                  <div
                    key={metric}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{metric}</span>
                      {data.score !== null && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          data.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          data.score >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {data.score}/100
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {metric === 'CLS' ? data.latest.toFixed(3) : `${Math.round(data.latest)}ms`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Avg: {metric === 'CLS' ? data.average.toFixed(3) : `${Math.round(data.average)}ms`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* External Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* GitHub Stats */}
          {externalMetrics?.github && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Stars</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {externalMetrics.github.totalStars}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Forks</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {externalMetrics.github.totalForks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Public Repos</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {externalMetrics.github.publicRepos}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medium Stats */}
          {externalMetrics?.medium && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Medium Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Reads</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {externalMetrics.medium.totalReads?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* IP & Email Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Visitor Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Unique IPs</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {details?.uniqueIPs || 0}
                  </span>
                </div>
                {details?.visitorsWithEmail && details.visitorsWithEmail.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">With Email</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      {details.visitorsWithEmail.length}
                    </span>
                  </div>
                )}
              </div>
              {details?.visitorsWithEmail && details.visitorsWithEmail.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Recent emails:</p>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {details.visitorsWithEmail.slice(0, 5).map((item: any, index: number) => (
                      <div key={index} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {item.email} ({item.country || 'Unknown'})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        {advancedData && (
          <>
            {/* Device Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  {advancedData.deviceAnalytics?.deviceTypes && advancedData.deviceAnalytics.deviceTypes.length > 0 ? (
                    <AdminPieChart
                      data={advancedData.deviceAnalytics.deviceTypes.map((item: any) => ({
                        name: item.name,
                        value: item.count,
                      }))}
                      title=""
                      height={250}
                    />
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">No device data</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browsers</CardTitle>
                </CardHeader>
                <CardContent>
                  {advancedData.deviceAnalytics?.browsers && advancedData.deviceAnalytics.browsers.length > 0 ? (
                    <AdminPieChart
                      data={advancedData.deviceAnalytics.browsers.map((item: any) => ({
                        name: item.name,
                        value: item.count,
                      }))}
                      title=""
                      height={250}
                    />
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">No browser data</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Operating Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  {advancedData.deviceAnalytics?.operatingSystems && advancedData.deviceAnalytics.operatingSystems.length > 0 ? (
                    <AdminPieChart
                      data={advancedData.deviceAnalytics.operatingSystems.map((item: any) => ({
                        name: item.name,
                        value: item.count,
                      }))}
                      title=""
                      height={250}
                    />
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">No OS data</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Hourly Traffic */}
            {advancedData.hourlyTraffic && advancedData.hourlyTraffic.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Hourly Traffic Distribution</CardTitle>
                  <CardDescription>Visitor activity by hour of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminBarChart
                    data={advancedData.hourlyTraffic.map((item: any) => ({
                      name: item.label,
                      'Visitors': item.visitors,
                    }))}
                    title=""
                    dataKeys={['Visitors']}
                    height={300}
                    colors={['#6366f1']}
                  />
                </CardContent>
              </Card>
            )}

            {/* User Flow */}
            {advancedData.userFlow && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top User Flows */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top User Flows</CardTitle>
                    <CardDescription>Most common page transitions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {advancedData.userFlow.topFlows && advancedData.userFlow.topFlows.length > 0 ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {advancedData.userFlow.topFlows.map((flow: any, index: number) => (
                          <div key={index} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                              {flow.sequence}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {flow.count} sessions
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-8">No flow data</p>
                    )}
                  </CardContent>
                </Card>

                {/* Entry & Exit Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Entry & Exit Pages</CardTitle>
                    <CardDescription>Where visitors enter and leave</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Top Entry Pages</h4>
                        <div className="space-y-2">
                          {advancedData.userFlow.entryPages && advancedData.userFlow.entryPages.slice(0, 5).map((page: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 truncate">{page.path}</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-50">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2">Top Exit Pages</h4>
                        <div className="space-y-2">
                          {advancedData.userFlow.exitPages && advancedData.userFlow.exitPages.slice(0, 5).map((page: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 truncate">{page.path}</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-50">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {advancedData.userFlow.averagePagesPerSession && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Avg. pages per session: <span className="font-semibold text-slate-900 dark:text-slate-50">{advancedData.userFlow.averagePagesPerSession}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

