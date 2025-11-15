'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from 'app/theme/components/ui/dialog';
import { Badge } from 'app/theme/components/ui/badge';
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AdminSectionProps<T extends { id: number; orderIndex?: number }> {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  apiPath: string;
  backHref: string;
  fields: Array<{
    name: keyof T | string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'url' | 'date' | 'image' | 'multiline';
    required?: boolean;
    placeholder?: string;
    rows?: number;
  }>;
  renderCard: (item: T, onEdit: (item: T) => void, onDelete: (id: number) => void) => React.ReactNode;
  getInitialFormData: () => Partial<T>;
}

export function AdminSectionManager<T extends { id: number; orderIndex?: number }>({
  title,
  description,
  icon: Icon,
  gradient,
  apiPath,
  backHref,
  fields,
  renderCard,
  getInitialFormData,
}: AdminSectionProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>(getInitialFormData());

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      const itemsList = Object.values(data)[0] as T[];
      setItems(itemsList || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(getInitialFormData());
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const url = apiPath;
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

      toast.success(editingItem ? 'Item updated successfully' : 'Item created successfully');
      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
      console.error('Error saving item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${apiPath}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
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
              <Link href={backHref}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              </div>
            </div>
            <Button onClick={handleCreate} className={`bg-gradient-to-r ${gradient} text-white`}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No items yet. Add your first item!
              </p>
              <Button onClick={handleCreate} className={`bg-gradient-to-r ${gradient} text-white`}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => renderCard(item, handleEdit, handleDelete))}
          </div>
        )}

        {/* Create/Edit Dialog - Would need form field rendering based on fields prop */}
        {/* For now, keeping it simple - will expand in next iterations */}
      </div>
    </div>
  );
}

