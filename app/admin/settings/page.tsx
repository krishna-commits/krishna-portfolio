'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Badge } from 'app/theme/components/ui/badge';
import { Settings, Database, Image as ImageIcon, Mail, Key, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  const checkEnvironmentVariable = (name: string) => {
    // In production, these would be checked server-side
    // For now, we show what should be configured
    return {
      configured: false,
      value: '••••••••',
    };
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Admin Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your admin panel configuration
          </p>
        </div>

        {/* Current Session */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>Your current admin session information</CardDescription>
          </CardHeader>
          <CardContent>
            {session?.authenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">Logged in</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Email: {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-slate-600 dark:text-slate-400">Not authenticated</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Configure these in Vercel environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Authentication */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Key className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold">Authentication</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div>
                    <Label htmlFor="admin_email">ADMIN_EMAIL</Label>
                    <Input
                      id="admin_email"
                      value={process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Set in Vercel'}
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Your admin login email address
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="admin_password">ADMIN_PASSWORD</Label>
                    <Input
                      id="admin_password"
                      type="password"
                      value="••••••••"
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Your admin login password (set in Vercel, not visible here)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="auth_secret">AUTH_SECRET</Label>
                    <Input
                      id="auth_secret"
                      type="password"
                      value="••••••••"
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Secret key for JWT token signing (generate a random string)
                    </p>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold">Database (Optional)</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div>
                    <Label htmlFor="postgres_url">POSTGRES_URL</Label>
                    <Input
                      id="postgres_url"
                      value={process.env.NEXT_PUBLIC_POSTGRES_URL ? 'Configured' : 'Not configured'}
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      PostgreSQL connection string (optional - for hobbies and newsletter)
                    </p>
                  </div>
                </div>
              </div>

              {/* Blob Storage */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold">Blob Storage</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div>
                    <Label htmlFor="blob_read_write_token">BLOB_READ_WRITE_TOKEN</Label>
                    <Input
                      id="blob_read_write_token"
                      type="password"
                      value="••••••••"
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Vercel Blob Storage token (for image uploads)
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold">Email (Optional)</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div>
                    <Label htmlFor="resend_api_key">RESEND_API_KEY</Label>
                    <Input
                      id="resend_api_key"
                      type="password"
                      value="••••••••"
                      disabled
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Resend API key (for contact form emails)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Instructions</CardTitle>
            <CardDescription>How to configure your admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Vercel Dashboard</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Go to your Vercel project settings and navigate to Environment Variables.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Required Variables</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">ADMIN_EMAIL</code> - Your admin email</li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">ADMIN_PASSWORD</code> - Your admin password</li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">AUTH_SECRET</code> - Random secret key (generate with: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">openssl rand -base64 32</code>)</li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">BLOB_READ_WRITE_TOKEN</code> - From Vercel Blob Storage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Optional Variables</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">POSTGRES_URL</code> - For database features</li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">RESEND_API_KEY</code> - For contact form emails</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Important:</strong> After setting environment variables, redeploy your application for changes to take effect.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

