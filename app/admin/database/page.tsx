'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Badge } from 'app/theme/components/ui/badge';
import { 
  Database, CheckCircle2, XCircle, Loader2, AlertCircle, 
  RefreshCw, Plus, Trash2, Activity, Server, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DatabaseTestResult {
  connected: boolean;
  tables: Record<string, { exists: boolean; count?: number; error?: string }>;
  models: string[];
  errors: string[];
  testQuery?: string;
  databaseInfo?: any;
  error?: string;
  errorCode?: string;
}

export default function DatabaseTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DatabaseTestResult | null>(null);
  const [creatingTestData, setCreatingTestData] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/database/test');
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast.success('Database connection successful!');
      } else {
        toast.error(data.error || 'Database connection failed');
      }
    } catch (error: any) {
      toast.error('Failed to test database connection');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestData = async () => {
    try {
      setCreatingTestData(true);
      const response = await fetch('/api/admin/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Test data created successfully!');
        testConnection(); // Refresh results
      } else {
        toast.error('Failed to create test data');
      }
    } catch (error: any) {
      toast.error('Failed to create test data');
      console.error('Error:', error);
    } finally {
      setCreatingTestData(false);
    }
  };

  const cleanupTestData = async () => {
    try {
      setCreatingTestData(true);
      const response = await fetch('/api/admin/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Test data cleaned up!');
        testConnection(); // Refresh results
      } else {
        toast.error('Failed to cleanup test data');
      }
    } catch (error: any) {
      toast.error('Failed to cleanup test data');
      console.error('Error:', error);
    } finally {
      setCreatingTestData(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                Database Setup & Testing
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Test database connection and verify schema
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={testConnection}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
            {result?.connected && (
              <>
                <Button
                  variant="outline"
                  onClick={createTestData}
                  disabled={creatingTestData}
                  className="gap-2"
                >
                  {creatingTestData ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Test Data
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={cleanupTestData}
                  disabled={creatingTestData}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  {creatingTestData ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Cleanup Test Data
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.connected ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Database Connected
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    Connection Failed
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {result.connected 
                  ? 'Database connection is active and working'
                  : result.error || 'Unable to connect to database'}
              </CardDescription>
            </CardHeader>
            {result.error && (
              <CardContent>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 font-semibold mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {result.error}
                  </p>
                  {result.errorCode && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Error Code: {result.errorCode}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      💡 Make sure you have:
                    </p>
                    <ul className="text-xs text-red-600 dark:text-red-400 mt-2 list-disc list-inside space-y-1">
                      <li>Created a <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">.env</code> file</li>
                      <li>Set <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">POSTGRES_PRISMA_URL</code> and <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">POSTGRES_URL_NON_POOLING</code></li>
                      <li>PostgreSQL is running (Docker or local)</li>
                      <li>Run <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">npx prisma db push</code> to create tables</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Tables Status */}
        {result && result.connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Database Models
                </CardTitle>
                <CardDescription>
                  {result.models.length} models available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.models.slice(0, 6).map((model) => (
                    <div key={model} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {model}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {result.tables[model]?.count || 0} records
                      </Badge>
                    </div>
                  ))}
                  {result.models.length > 6 && (
                    <p className="text-xs text-slate-500 mt-2">
                      +{result.models.length - 6} more models
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Test Status
                </CardTitle>
                <CardDescription>
                  Query test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.testQuery === 'success' ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Query test passed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Query test failed</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Database Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.databaseInfo ? (
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p>
                      {typeof result.databaseInfo === 'object' && result.databaseInfo[0]?.version
                        ? result.databaseInfo[0].version.split(',')[0]
                        : 'PostgreSQL Connected'}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Info not available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tables Details */}
        {result && result.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Table Status</CardTitle>
              <CardDescription>Detailed status of each database table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-2 px-4 font-semibold text-slate-900 dark:text-slate-50">Model</th>
                      <th className="text-left py-2 px-4 font-semibold text-slate-900 dark:text-slate-50">Status</th>
                      <th className="text-left py-2 px-4 font-semibold text-slate-900 dark:text-slate-50">Records</th>
                      <th className="text-left py-2 px-4 font-semibold text-slate-900 dark:text-slate-50">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.tables).map(([model, status]) => (
                      <tr key={model} className="border-b border-slate-100 dark:border-slate-900">
                        <td className="py-2 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                          {model}
                        </td>
                        <td className="py-2 px-4">
                          {status.exists ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Exists
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Missing
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-4 text-slate-600 dark:text-slate-400">
                          {status.count !== undefined ? status.count : '-'}
                        </td>
                        <td className="py-2 px-4 text-xs text-red-600 dark:text-red-400">
                          {status.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {(!result || !result.connected) && (
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <AlertCircle className="h-5 w-5" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
              <div>
                <p className="font-semibold mb-2">Step 1: Set up PostgreSQL</p>
                <p className="text-xs opacity-90">
                  Choose one: Docker, Vercel Postgres, or local PostgreSQL. See <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">DATABASE_SETUP.md</code> for details.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Step 2: Create .env file</p>
                <p className="text-xs opacity-90">
                  Add <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">POSTGRES_PRISMA_URL</code> and <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">POSTGRES_URL_NON_POOLING</code> to your <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">.env</code> file.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Step 3: Push schema</p>
                <p className="text-xs opacity-90">
                  Run <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx prisma db push</code> to create all tables.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Step 4: Test connection</p>
                <p className="text-xs opacity-90">
                  Click "Test Connection" above to verify everything is working.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

