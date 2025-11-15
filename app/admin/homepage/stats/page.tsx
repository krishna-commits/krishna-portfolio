'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Badge } from 'app/theme/components/ui/badge';
import { 
  BarChart3, Loader2, ArrowLeft, Save, Plus, Edit, Trash2, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface StatItem {
  id: string;
  label: string;
  value: number;
  icon?: string;
  description?: string;
  enabled: boolean;
}

interface StatsSettings {
  title: string;
  description: string;
  stats: StatItem[];
}

export default function StatsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<StatsSettings>({
    title: 'Impact Metrics',
    description: 'Quantifying the impact of my work across security research, open source, and community engagement.',
    stats: [],
  });

  const [statForm, setStatForm] = useState<StatItem>({
    id: '',
    label: '',
    value: 0,
    icon: '',
    description: '',
    enabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      if (data.stats) {
        setFormData(data.stats);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/admin/homepage/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast.success('Impact metrics updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
      console.error('Error saving stats:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStat = () => {
    setEditingIndex(null);
    setStatForm({
      id: '',
      label: '',
      value: 0,
      icon: '',
      description: '',
      enabled: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditStat = (index: number) => {
    setEditingIndex(index);
    setStatForm(formData.stats[index]);
    setIsDialogOpen(true);
  };

  const handleSaveStat = () => {
    const stats = [...formData.stats];
    if (editingIndex !== null) {
      stats[editingIndex] = statForm;
    } else {
      stats.push({ ...statForm, id: `stat-${Date.now()}` });
    }
    setFormData({ ...formData, stats });
    setIsDialogOpen(false);
    toast.success(editingIndex !== null ? 'Stat updated' : 'Stat added');
  };

  const handleDeleteStat = (index: number) => {
    const stats = formData.stats.filter((_, i) => i !== index);
    setFormData({ ...formData, stats });
    toast.success('Stat deleted successfully');
  };

  const handleToggleStat = (index: number) => {
    const stats = [...formData.stats];
    stats[index].enabled = !stats[index].enabled;
    setFormData({ ...formData, stats });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading impact metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/homepage">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Impact Metrics
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage statistics and metrics displayed on homepage
                </p>
              </div>
            </div>
            <Button onClick={handleAddStat} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </div>
        </div>

        {/* Section Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Section Settings</CardTitle>
            <CardDescription>
              Configure section title and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Impact Metrics"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Section description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Metrics ({formData.stats.length})</CardTitle>
            <CardDescription>
              Manage your impact metrics and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formData.stats.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No metrics yet. Add your first metric!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.stats.map((stat, index) => (
                  <Card
                    key={stat.id}
                    className={`relative ${!stat.enabled ? 'opacity-50' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-lg">{stat.label}</CardTitle>
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {stat.value.toLocaleString()}
                          </div>
                          {stat.description && (
                            <CardDescription className="text-xs mt-1">
                              {stat.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStat(index)}
                          className={stat.enabled ? 'text-green-600' : 'text-slate-400'}
                        >
                          {stat.enabled ? 'Enabled' : 'Disabled'}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStat(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStat(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || !formData.title || !formData.description}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Add/Edit Stat Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>
                  {editingIndex !== null ? 'Edit Metric' : 'Add Metric'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="statLabel">Label *</Label>
                  <Input
                    id="statLabel"
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                    placeholder="e.g., Research Reads"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="statValue">Value *</Label>
                  <Input
                    id="statValue"
                    type="number"
                    value={statForm.value}
                    onChange={(e) => setStatForm({ ...statForm, value: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="statDescription">Description</Label>
                  <Input
                    id="statDescription"
                    value={statForm.description}
                    onChange={(e) => setStatForm({ ...statForm, description: e.target.value })}
                    placeholder="e.g., Total article reads on Medium"
                  />
                </div>
                <div>
                  <Label htmlFor="statIcon">Icon (emoji or text)</Label>
                  <Input
                    id="statIcon"
                    value={statForm.icon}
                    onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                    placeholder="📚 or Book"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="statEnabled"
                    checked={statForm.enabled}
                    onChange={(e) => setStatForm({ ...statForm, enabled: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700"
                  />
                  <Label htmlFor="statEnabled" className="cursor-pointer">
                    Enable this metric
                  </Label>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveStat}
                    disabled={!statForm.label || statForm.value === undefined}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

