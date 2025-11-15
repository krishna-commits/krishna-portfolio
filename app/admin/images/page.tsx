'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { 
  Image as ImageIcon, Trash2, Loader2, Search, Folder, FolderOpen,
  Grid, List, Eye, Download, RefreshCw, Filter, X, CheckSquare, Square
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from 'app/theme/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'app/theme/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'app/theme/components/ui/dialog';

interface Blob {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  filename?: string;
}

interface FolderData {
  [folderName: string]: Blob[];
}

const FOLDER_CATEGORIES = [
  { value: '', label: 'All Folders', icon: '📁' },
  { value: 'mantra', label: 'Mantra', icon: '📿' },
  { value: 'project', label: 'Project', icon: '💼' },
  { value: 'research', label: 'Research', icon: '🔬' },
  { value: 'hobby', label: 'Hobby', icon: '🎨' },
  { value: 'blog', label: 'Blog', icon: '📝' },
  { value: 'homepage', label: 'Homepage', icon: '🏠' },
  { value: 'profile', label: 'Profile', icon: '👤' },
  { value: 'certification', label: 'Certification', icon: '🎓' },
  { value: 'gallery', label: 'Gallery', icon: '🖼️' },
  { value: 'public', label: 'Public', icon: '📁' },
];

export default function ImageManagerPage() {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<Blob[]>([]);
  const [folders, setFolders] = useState<FolderData>({});
  const [folderStats, setFolderStats] = useState<Record<string, number>>({});
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<Blob | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchImages();
  }, [selectedFolder]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const url = selectedFolder
        ? `/api/admin/blob/list?folder=${selectedFolder}`
        : '/api/admin/blob/list';
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch images');
      
      const data = await response.json();
      setImages(data.blobs || []);
      setFolders(data.folders || {});
      setFolderStats(data.folderStats || {});
      setTotal(data.total || 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/blob/delete?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      toast.success('Image deleted successfully!');
      fetchImages();
      setSelectedImages(new Set());
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) {
      toast.error('No images selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch('/api/admin/blob/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: Array.from(selectedImages) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      toast.success(`Deleted ${data.successful} image(s) successfully!`);
      fetchImages();
      setSelectedImages(new Set());
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete images');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectImage = (url: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(img => img.url)));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFolderFromPath = (pathname: string): string => {
    const parts = pathname.split('/');
    return parts.length > 1 ? parts[0] : 'root';
  };

  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      img.pathname.toLowerCase().includes(search) ||
      (img.filename && img.filename.toLowerCase().includes(search))
    );
  });

  const filteredFolders = Object.entries(folders).filter(([folderName]) => {
    if (!searchQuery) return true;
    return folderName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Image Manager
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  View, manage, and delete images from blob storage
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={fetchImages}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {selectedImages.size > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete ({selectedImages.size})</span>
                      <span className="sm:hidden">({selectedImages.size})</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search images by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOLDER_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                          {category.value && folderStats[category.value] && (
                            <span className="text-xs text-slate-500">
                              ({folderStats[category.value]})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Folder Stats */}
        {!selectedFolder && Object.keys(folders).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Folders ({Object.keys(folders).length})
              </CardTitle>
              <CardDescription>Images organized by folders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {Object.entries(folders).map(([folderName, files]) => (
                  <button
                    key={folderName}
                    onClick={() => setSelectedFolder(folderName)}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Folder className="h-5 w-5 text-purple-500" />
                      <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                        {folderName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {files.length} image{files.length !== 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {selectedFolder ? (
                    <>
                      <Folder className="h-5 w-5" />
                      {selectedFolder} ({filteredImages.length})
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      All Images ({filteredImages.length})
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedFolder
                    ? `Images in ${selectedFolder} folder`
                    : 'All images in blob storage'}
                </CardDescription>
              </div>
              {filteredImages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="gap-2"
                >
                  {selectedImages.size === filteredImages.length ? (
                    <>
                      <CheckSquare className="h-4 w-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {searchQuery ? 'No images found matching your search' : 'No images found'}
                </p>
                {selectedFolder && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFolder('')}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Folder Filter
                  </Button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredImages.map((image) => {
                  const isSelected = selectedImages.has(image.url);
                  const folder = getFolderFromPath(image.pathname);
                  return (
                    <div
                      key={image.url}
                      className={cn(
                        "relative group rounded-lg border overflow-hidden transition-all cursor-pointer",
                        isSelected
                          ? "border-purple-500 ring-2 ring-purple-500"
                          : "border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600"
                      )}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-2 left-2 z-10">
                        <button
                          onClick={() => toggleSelectImage(image.url)}
                          className={cn(
                            "p-1 rounded bg-white dark:bg-slate-900 shadow-md border transition-colors",
                            isSelected
                              ? "border-purple-500 bg-purple-500 text-white"
                              : "border-slate-300 dark:border-slate-700"
                          )}
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Image */}
                      <div
                        className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden"
                        onClick={() => setPreviewImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.filename || image.pathname}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-50 truncate mb-1">
                          {image.filename || image.pathname.split('/').pop()}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {folder}
                          </span>
                          <span>{formatFileSize(image.size)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.url, image.filename || image.pathname);
                          }}
                          disabled={deleting}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => {
                  const isSelected = selectedImages.has(image.url);
                  const folder = getFolderFromPath(image.pathname);
                  return (
                    <div
                      key={image.url}
                      className={cn(
                        "p-4 rounded-lg border flex items-center gap-4 transition-all",
                        isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600"
                      )}
                    >
                      <button
                        onClick={() => toggleSelectImage(image.url)}
                        className={cn(
                          "p-1 rounded border transition-colors",
                          isSelected
                            ? "border-purple-500 bg-purple-500 text-white"
                            : "border-slate-300 dark:border-slate-700"
                        )}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <img
                        src={image.url}
                        alt={image.filename || image.pathname}
                        className="w-16 h-16 object-cover rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                        onClick={() => setPreviewImage(image)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {image.filename || image.pathname.split('/').pop()}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {folder}
                          </span>
                          <span>{formatFileSize(image.size)}</span>
                          <span>
                            {new Date(image.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <code className="text-xs text-slate-600 dark:text-slate-400 truncate block mt-1">
                          {image.url}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewImage(image)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.url, image.filename || image.pathname)}
                          disabled={deleting}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            {previewImage && (
              <>
                <DialogHeader>
                  <DialogTitle>{previewImage.filename || previewImage.pathname.split('/').pop()}</DialogTitle>
                  <DialogDescription>
                    {getFolderFromPath(previewImage.pathname)} • {formatFileSize(previewImage.size)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <img
                      src={previewImage.url}
                      alt={previewImage.filename || previewImage.pathname}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL:</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded truncate">
                          {previewImage.url}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(previewImage.url);
                            toast.success('URL copied!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pathname:</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded truncate">
                          {previewImage.pathname}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(previewImage.pathname);
                            toast.success('Pathname copied!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDelete(previewImage.url, previewImage.filename || previewImage.pathname);
                          setPreviewImage(null);
                        }}
                        disabled={deleting}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Image
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = previewImage.url;
                          link.download = previewImage.filename || previewImage.pathname.split('/').pop() || 'image';
                          link.click();
                        }}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

