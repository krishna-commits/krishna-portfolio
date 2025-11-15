'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'app/theme/components/ui/dialog';
import { Badge } from 'app/theme/components/ui/badge';
import { 
  Award, Plus, Edit, Trash2, Loader2, ArrowLeft, Save, Upload, X, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

interface CertificationItem {
  id: number;
  title: string;
  issuedby: string;
  imageUrl: string;
  link: string | null;
  time: string;
  orderIndex: number;
}

export default function CertificationsManagementPage() {
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    issuedby: '',
    imageUrl: '',
    link: '',
    time: '',
    orderIndex: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage/certifications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data.certifications || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&folder=public`, {
        method: 'POST',
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: CertificationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      issuedby: item.issuedby,
      imageUrl: item.imageUrl,
      link: item.link || '',
      time: item.time,
      orderIndex: item.orderIndex,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      issuedby: '',
      imageUrl: '',
      link: '',
      time: '',
      orderIndex: 0,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const url = '/api/admin/homepage/certifications';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Certification updated successfully' : 'Certification created successfully');
      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
      console.error('Error saving certification:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/homepage/certifications?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Certification deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
      console.error('Error deleting certification:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading certifications...</p>
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
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Certifications Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your professional certifications and credentials
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </div>

        {/* Certifications List */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No certifications yet. Add your first certification!
              </p>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain p-4"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-base mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.issuedby}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {item.time}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Order: {item.orderIndex}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {item.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.link!, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Certification' : 'Add Certification'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update certification information' : 'Add a new certification'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., AWS Knowledge: Architecting"
                  required
                />
              </div>

              <div>
                <Label htmlFor="issuedby">Issued By *</Label>
                <Input
                  id="issuedby"
                  value={formData.issuedby}
                  onChange={(e) => setFormData({ ...formData, issuedby: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Date *</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., Nov 1, 2024"
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
                <Label htmlFor="link">Certificate Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com/certificate"
                />
              </div>

              <div>
                <Label htmlFor="image">Certificate Image *</Label>
                <div className="space-y-2">
                  {formData.imageUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-800">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="cert-image-upload"
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </label>
                    <input
                      id="cert-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Max file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
                  </p>
                </div>
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
                  disabled={saving || !formData.title || !formData.issuedby || !formData.imageUrl || !formData.time}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
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

