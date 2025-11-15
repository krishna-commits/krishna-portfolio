'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Badge } from 'app/theme/components/ui/badge';
import { Mail, Search, Download, Trash2, Loader2, CheckCircle2, AlertCircle, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from 'app/theme/lib/utils';
import { StatCard } from '../components/charts/stat-card';
import { AdminLineChart } from '../components/charts/line-chart';
import { AdminPieChart } from '../components/charts/pie-chart';

interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [chartData, setChartData] = useState<Array<{ name: string; Subscribers: number; date: string }>>([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscribers.filter((sub) =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchTerm, subscribers]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/newsletter/subscribers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);
      setFilteredSubscribers(data.subscribers || []);

      // Generate chart data from subscribers
      if (data.subscribers && data.subscribers.length > 0) {
        const chartDataMap: Record<string, number> = {};
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        data.subscribers.forEach((sub: NewsletterSubscriber) => {
          const subDate = new Date(sub.createdAt);
          if (subDate >= sevenDaysAgo) {
            const dateKey = subDate.toLocaleDateString('en-US', { weekday: 'short' });
            chartDataMap[dateKey] = (chartDataMap[dateKey] || 0) + 1;
          }
        });

        // Fill in all 7 days
        const chartDataArray = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          chartDataArray.push({
            name: dayName,
            Subscribers: chartDataMap[dayName] || 0,
            date: date.toISOString().split('T')[0],
          });
        }
        setChartData(chartDataArray);
      }
    } catch (error: any) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }

      toast.success('Subscriber deleted successfully');
      fetchSubscribers();
    } catch (error: any) {
      console.error('Failed to delete subscriber:', error);
      toast.error('Failed to delete subscriber');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Created At'],
      ...subscribers.map((sub) => [
        sub.email,
        new Date(sub.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Subscribers exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Newsletter Subscribers
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your newsletter subscribers list
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Subscribers"
            value={subscribers.length}
            subtitle="All time subscribers"
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
            iconColor="text-blue-500"
          />

          <StatCard
            title="This Week"
            value={subscribers.filter((sub) => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(sub.createdAt) >= weekAgo;
            }).length}
            subtitle="New subscriptions"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
            iconColor="text-green-500"
            trend={
              subscribers.length > 0
                ? {
                    value: Math.round(
                      (subscribers.filter((sub) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(sub.createdAt) >= weekAgo;
                      }).length /
                        subscribers.length) *
                        100
                    ),
                    isPositive: true,
                  }
                : undefined
            }
          />

          <StatCard
            title="This Month"
            value={subscribers.filter((sub) => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return new Date(sub.createdAt) >= monthAgo;
            }).length}
            subtitle="Last 30 days"
            icon={Mail}
            gradient="from-purple-500 to-indigo-500"
            iconColor="text-purple-500"
          />
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AdminLineChart
              data={chartData}
              title="Subscription Trend"
              description="New subscriptions over the last 7 days"
              dataKey="Subscribers"
              color="#3b82f6"
            />

            <AdminPieChart
              data={[
                {
                  name: 'This Week',
                  value: subscribers.filter((sub) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(sub.createdAt) >= weekAgo;
                  }).length,
                },
                {
                  name: 'Older',
                  value: subscribers.filter((sub) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(sub.createdAt) < weekAgo;
                  }).length,
                },
              ].filter((item) => item.value > 0)}
              title="Subscription Distribution"
              description="New vs existing subscribers"
            />
          </div>
        )}

        {/* Actions */}
        <Card className="mb-8 border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage your subscriber list</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={fetchSubscribers} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Subscribers ({filteredSubscribers.length})
            </CardTitle>
            <CardDescription>
              {searchTerm
                ? `Showing results for "${searchTerm}"`
                : 'All newsletter subscribers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  {searchTerm
                    ? 'No subscribers found matching your search'
                    : 'No subscribers yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            {subscriber.email}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Subscribed on{' '}
                            {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subscriber.id)}
                      disabled={deleting === subscriber.id}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {deleting === subscriber.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

