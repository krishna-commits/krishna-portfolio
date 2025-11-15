'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Textarea } from 'app/theme/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from 'app/theme/components/ui/dialog';
import { Badge } from 'app/theme/components/ui/badge';
import { 
  FileText, Plus, Edit, Trash2, Save, X, Loader2, Calendar, Tag,
  ArrowLeft, ExternalLink, Folder
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MDXEditor } from '../../components/mdx-editor';
import Link from 'next/link';

type ContentType = 'blog' | 'project' | 'research' | 'mantra';

interface ContentItem {
  filepath: string;
  title: string;
  [key: string]: any;
}

export default function ContentManagementPage() {
  const params = useParams();
  const router = useRouter();
  const type = (params?.type as ContentType) || 'blog';
  
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<any>({});
  const [mdxContent, setMdxContent] = useState('');
  const [filepath, setFilepath] = useState('');

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content?type=${type}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      const files = data.files || [];
      
      // Sort items by order field (for research and mantra) or by title
      const sortedFiles = files.sort((a: ContentItem, b: ContentItem) => {
        // For research and mantra, prioritize order field
        if ((type === 'research' || type === 'mantra') && a.order !== undefined && b.order !== undefined) {
          return (a.order || 0) - (b.order || 0);
        }
        // Fallback to alphabetical by title
        return (a.title || '').localeCompare(b.title || '');
      });
      
      setItems(sortedFiles);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (item: ContentItem) => {
    try {
      setEditingItem(item);
      const response = await fetch(`/api/admin/content/${type}?filepath=${encodeURIComponent(item.filepath)}`);
      
      if (!response.ok) {
        throw new Error('Failed to load item');
      }
      
      const data = await response.json();
      setFormData(data.frontmatter || {});
      setMdxContent(data.content || '');
      setFilepath(item.filepath);
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load item');
      console.error('Error loading item:', error);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setMdxContent('');
    setFilepath('');
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const url = editingItem 
        ? '/api/admin/content'
        : '/api/admin/content';
      const method = editingItem ? 'PUT' : 'POST';

      // Generate filename if not provided
      let finalFilepath = filepath;
      if (!finalFilepath && formData.title) {
        const slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        finalFilepath = `${slug}.mdx`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          filepath: editingItem?.filepath || finalFilepath,
          newFilepath: editingItem && filepath !== editingItem.filepath ? filepath : undefined,
          frontmatter: formData,
          content: mdxContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Content updated successfully' : 'Content created successfully');
      setIsDialogOpen(false);
      fetchItems();
      
      // Reset form
      setFormData({});
      setMdxContent('');
      setFilepath('');
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/content?type=${type}&filepath=${encodeURIComponent(item.filepath)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Content deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
      console.error('Error deleting content:', error);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'blog': return 'Blog Posts';
      case 'project': return 'Projects';
      case 'research': return 'Research Articles';
      case 'mantra': return 'Mantras';
      default: return 'Content';
    }
  };

  const getFormFields = () => {
    switch (type) {
      case 'blog':
        return (
          <>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Blog post title"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Blog post description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : (formData.keywords || '')}
                onChange={(e) => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                  setFormData({ ...formData, keywords });
                }}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </>
        );
      case 'project':
        return (
          <>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </>
        );
      case 'research':
      case 'mantra':
        return (
          <>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Article description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="parent">Parent</Label>
              <Input
                id="parent"
                value={formData.parent || ''}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                placeholder="e.g., Chapter 1: Introduction"
              />
            </div>
            <div>
              <Label htmlFor="grand_parent">Grand Parent</Label>
              <Input
                id="grand_parent"
                value={formData.grand_parent || ''}
                onChange={(e) => setFormData({ ...formData, grand_parent: e.target.value })}
                placeholder="e.g., Linux"
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 lg:pt-0">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading content...</p>
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
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin/content">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {getTypeLabel()}
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your {type} content in MDX format
              </p>
            </div>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {/* Content List */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No {type} content yet. Create your first item!
              </p>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.filepath} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <CardDescription className="text-xs font-mono">
                        {item.filepath}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {item.date && (
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </Badge>
                    )}
                    {item.order !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Order: {item.order}
                      </Badge>
                    )}
                  </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
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
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${type}` : `Create New ${type}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the content below' : 'Fill in the details and write your MDX content'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Filepath */}
              <div>
                <Label htmlFor="filepath">File Path (e.g., post-name.mdx or folder/post-name.mdx)</Label>
                <Input
                  id="filepath"
                  value={filepath}
                  onChange={(e) => setFilepath(e.target.value)}
                  placeholder="my-post.mdx"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Leave empty to auto-generate from title
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFormFields()}
              </div>

              {/* MDX Editor */}
              <div>
                <Label>MDX Content *</Label>
                <MDXEditor
                  content={mdxContent}
                  onChange={setMdxContent}
                  className="mt-2"
                />
              </div>

              {/* Actions */}
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
                  disabled={saving || !formData.title || !mdxContent}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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

