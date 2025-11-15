'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Badge } from 'app/theme/components/ui/badge';
import {
  Shield, Lock, AlertTriangle, CheckCircle2, XCircle, Clock, MapPin, Monitor,
  RefreshCw, Trash2, Loader2, Unlock
} from 'lucide-react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface LoginAttempt {
  id: number;
  email: string;
  ipAddress: string;
  userAgent: string | null;
  success: boolean;
  reason: string | null;
  createdAt: string;
}

interface AccountLockout {
  id: number;
  email: string;
  ipAddress: string | null;
  lockedUntil: string;
  attempts: number;
}

export default function SecurityPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/auth/attempts', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const handleUnlockAccount = async (email: string) => {
    try {
      const response = await fetch(`/api/admin/auth/unlock?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to unlock account');

      toast.success('Account unlocked successfully');
      mutate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unlock account');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (lockedUntil: string) => {
    const now = new Date();
    const until = new Date(lockedUntil);
    const diff = until.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.ceil(diff / (60 * 1000));
    return `${minutes} minute(s)`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
      </div>
    );
  }

  const attempts: LoginAttempt[] = data?.attempts || [];
  const lockouts: AccountLockout[] = data?.lockouts || [];
  const total = data?.total || 0;

  const recentFailed = attempts.filter(a => !a.success).slice(0, 10);
  const recentSuccessful = attempts.filter(a => a.success).slice(0, 10);

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Security & Login Attempts
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Monitor login attempts and manage account security
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => mutate()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Failed Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {attempts.filter(a => !a.success).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Successful Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {attempts.filter(a => a.success).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Locked Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {lockouts.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Lockouts */}
        {lockouts.length > 0 && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-orange-500" />
                Locked Accounts
              </CardTitle>
              <CardDescription>
                Accounts temporarily locked due to failed login attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lockouts.map((lockout) => (
                  <div
                    key={lockout.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                          {lockout.email}
                        </span>
                        <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
                          {lockout.attempts} attempts
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        {lockout.ipAddress && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lockout.ipAddress}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeRemaining(lockout.lockedUntil)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlockAccount(lockout.email)}
                      className="gap-2"
                    >
                      <Unlock className="h-4 w-4" />
                      Unlock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Failed Attempts */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Recent Failed Attempts
            </CardTitle>
            <CardDescription>
              Failed login attempts in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentFailed.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No failed attempts in the last 24 hours
              </p>
            ) : (
              <div className="space-y-2">
                {recentFailed.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {attempt.email}
                        </span>
                        {attempt.reason && (
                          <Badge variant="outline" className="text-xs">
                            {attempt.reason}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {attempt.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(attempt.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Successful Logins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Recent Successful Logins
            </CardTitle>
            <CardDescription>
              Successful login attempts in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSuccessful.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No successful logins in the last 24 hours
              </p>
            ) : (
              <div className="space-y-2">
                {recentSuccessful.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {attempt.email}
                        </span>
                        <Badge variant="outline" className="text-green-600 dark:text-green-400">
                          Success
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {attempt.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(attempt.createdAt)}
                        </span>
                        {attempt.userAgent && (
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <Monitor className="h-3 w-3" />
                            <span className="truncate">{attempt.userAgent}</span>
                          </span>
                        )}
                      </div>
                    </div>
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

