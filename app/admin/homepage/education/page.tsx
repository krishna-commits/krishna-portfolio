'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Textarea } from 'app/theme/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'app/theme/components/ui/dialog';
import { Badge } from 'app/theme/components/ui/badge';
import { 
  GraduationCap, Plus, Edit, Trash2, Loader2, ArrowLeft,
  Save, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface EducationItem {
  id: number;
  organization: string;
  course: string;
  university: string | null;
  time: string;
  thesis: string | null;
  modules: string[];
  orderIndex: number;
}

export default function EducationManagementPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    organization: '',
    course: '',
    university: '',
    time: '',
    thesis: '',
    modules: '',
    orderIndex: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage/education');
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data.education || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: EducationItem) => {
    setEditingItem(item);
    setFormData({
      organization: item.organization,
      course: item.course,
      university: item.university || '',
      time: item.time,
      thesis: item.thesis || '',
      modules: item.modules.join('\n'),
      orderIndex: item.orderIndex,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      organization: '',
      course: '',
      university: '',
      time: '',
      thesis: '',
      modules: '',
      orderIndex: 0,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const modules = formData.modules.split('\n').filter(m => m.trim());
      
      const url = editingItem 
        ? '/api/admin/homepage/education'
        : '/api/admin/homepage/education';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...formData,
          modules,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Education updated successfully' : 'Education created successfully');
      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
      console.error('Error saving education:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homepage/education?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Education deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
      console.error('Error deleting education:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading education...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/homepage">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Education Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your education history and qualifications
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </div>

        {/* Education List */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No education entries yet. Add your first entry!
              </p>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{item.course}</CardTitle>
                        <Badge variant="outline">Order: {item.orderIndex}</Badge>
                      </div>
                      <CardDescription className="text-base">
                        {item.organization}
                      </CardDescription>
                      {item.university && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {item.university}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {item.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {item.thesis && (
                  <CardContent>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      <strong>Thesis:</strong> {item.thesis}
                    </p>
                  </CardContent>
                )}
                {item.modules.length > 0 && (
                  <CardContent>
                    <p className="text-sm font-semibold mb-2">Modules:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.modules.map((module, idx) => (
                        <Badge key={idx} variant="secondary">{module}</Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Education' : 'Add Education'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update education information' : 'Add a new education entry'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g., Islington College"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course/Degree *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="e.g., Information Technology and Applied Security, MSc"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g., London Metropolitan University"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time Period *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 09/2023"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="orderIndex">Order Index</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thesis">Thesis</Label>
                <Textarea
                  id="thesis"
                  value={formData.thesis}
                  onChange={(e) => setFormData({ ...formData, thesis: e.target.value })}
                  placeholder="Thesis title or description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="modules">Modules (one per line)</Label>
                <Textarea
                  id="modules"
                  value={formData.modules}
                  onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                  placeholder="Security Auditing&#10;Penetration Testing&#10;Digital Forensics"
                  rows={6}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter each module on a new line
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.organization || !formData.course || !formData.time}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingItem ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

