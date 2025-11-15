'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Textarea } from 'app/theme/components/ui/textarea';
import { 
  Lock, Save, Loader2, Plus, Trash2, Eye, EyeOff, AlertCircle,
  Shield, Key, RefreshCw, CheckCircle2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'app/theme/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'app/theme/components/ui/select';

interface EnvVar {
  key: string;
  value: string;
  masked: boolean;
  protected: boolean;
  environment: string;
  description: string;
  updatedAt?: string;
}

export default function EnvManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVar, setEditingVar] = useState<EnvVar | null>(null);
  
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    environment: 'production',
    description: '',
  });

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const fetchEnvVars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/env');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setEnvVars(data.envVars || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load environment variables');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validate key format
      if (!/^[A-Z_][A-Z0-9_]*$/.test(formData.key)) {
        toast.error('Invalid key format. Use uppercase letters, numbers, and underscores only.');
        return;
      }

      const response = await fetch('/api/admin/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save');

      toast.success('Environment variable saved successfully!');
      setIsAddDialogOpen(false);
      setEditingVar(null);
      setFormData({ key: '', value: '', environment: 'production', description: '' });
      fetchEnvVars();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete ${key}?`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/env?key=${key}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      toast.success('Environment variable deleted successfully!');
      fetchEnvVars();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const toggleShowValue = (key: string) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startEdit = (envVar: EnvVar) => {
    if (envVar.protected) {
      toast.error('This key is protected and cannot be edited');
      return;
    }
    setEditingVar(envVar);
    setFormData({
      key: envVar.key,
      value: envVar.masked ? '' : envVar.value,
      environment: envVar.environment,
      description: envVar.description,
    });
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Environment Variables
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage sensitive environment variables securely
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchEnvVars}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white">
                    <Plus className="h-4 w-4" />
                    Add Variable
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVar ? 'Edit Environment Variable' : 'Add Environment Variable'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingVar 
                        ? 'Update the environment variable. Sensitive values will be encrypted.'
                        : 'Add a new environment variable. Sensitive keys (containing password, secret, token, key) will be automatically encrypted.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <Label htmlFor="key">Key *</Label>
                      <Input
                        id="key"
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                        placeholder="GITHUB_ACCESS_TOKEN"
                        required
                        disabled={!!editingVar}
                        pattern="^[A-Z_][A-Z0-9_]*$"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Uppercase letters, numbers, and underscores only
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="value">Value *</Label>
                      <Textarea
                        id="value"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="Enter the value"
                        required
                        rows={3}
                        className="font-mono text-sm"
                      />
                      {formData.key && formData.key.toLowerCase().match(/(password|secret|token|key)/) && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          This value will be encrypted for security
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="environment">Environment</Label>
                      <Select
                        value={formData.environment}
                        onValueChange={(value) => setFormData({ ...formData, environment: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe what this variable is used for"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          setEditingVar(null);
                          setFormData({ key: '', value: '', environment: 'production', description: '' });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving} className="gap-2">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="mb-6 border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Security Notice
                  </p>
                  <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                    <li>All sensitive values (passwords, secrets, tokens, keys) are automatically encrypted</li>
                    <li>Values are stored in the database and never exposed to the frontend</li>
                    <li>Protected keys (database URLs) cannot be modified via this panel</li>
                    <li>Never share or expose these values in logs or error messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environment Variables List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Managed Environment Variables ({envVars.length})
            </CardTitle>
            <CardDescription>
              These variables are stored in the database and encrypted when sensitive
            </CardDescription>
          </CardHeader>
          <CardContent>
            {envVars.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No environment variables found
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Variable
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3 px-4 font-semibold">Key</th>
                      <th className="text-left py-3 px-4 font-semibold">Value</th>
                      <th className="text-left py-3 px-4 font-semibold">Environment</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {envVars.map((envVar) => (
                      <tr
                        key={envVar.key}
                        className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-slate-700 dark:text-slate-300">
                              {envVar.key}
                            </code>
                            {envVar.protected && (
                              <Shield className="h-4 w-4 text-amber-500" title="Protected" />
                            )}
                            {envVar.masked && (
                              <Lock className="h-4 w-4 text-red-500" title="Encrypted" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-slate-600 dark:text-slate-400 max-w-md truncate">
                              {showValues[envVar.key] && !envVar.masked
                                ? envVar.value
                                : envVar.masked
                                ? envVar.value
                                : '••••••••'}
                            </code>
                            {!envVar.masked && (
                              <button
                                type="button"
                                onClick={() => toggleShowValue(envVar.key)}
                                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                              >
                                {showValues[envVar.key] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {envVar.environment}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {envVar.description || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(envVar)}
                              disabled={envVar.protected}
                              className="h-8"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(envVar.key)}
                              disabled={envVar.protected}
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

