'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, useEffect } from 'react';
import { uploadToBlob, uploadMultipleToBlob } from 'app/lib/blob-utils';
import { Upload, CheckCircle2, X, Image as ImageIcon, Loader2, Folder, FolderOpen, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from 'app/theme/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'app/theme/components/ui/select';

interface UploadResult {
  originalName: string;
  blob?: PutBlobResult;
  error?: string;
  folder?: string;
}

// Predefined folder categories
const FOLDER_CATEGORIES = [
  { value: 'mantra', label: 'Mantra', description: 'Images for mantra section', icon: '📿' },
  { value: 'project', label: 'Project', description: 'Images for projects section', icon: '💼' },
  { value: 'research', label: 'Research', description: 'Images for research articles', icon: '🔬' },
  { value: 'hobby', label: 'Hobby', description: 'Images for hobbies section', icon: '🎨' },
  { value: 'blog', label: 'Blog', description: 'Images for blog posts', icon: '📝' },
  { value: 'homepage', label: 'Homepage', description: 'Images for homepage sections', icon: '🏠' },
  { value: 'profile', label: 'Profile', description: 'Profile pictures and avatars', icon: '👤' },
  { value: 'certification', label: 'Certification', description: 'Certification badges and logos', icon: '🎓' },
  { value: 'gallery', label: 'Gallery', description: 'General gallery images', icon: '🖼️' },
  { value: 'public', label: 'Public', description: 'General public folder', icon: '📁' },
];

interface BlobItem {
  url: string;
  pathname: string;
  filename?: string;
  size?: number;
  uploadedAt?: Date;
}

interface BlobListResponse {
  blobs: BlobItem[];
  folders: Record<string, BlobItem[]>;
  rootFiles: BlobItem[];
  folderStats: Record<string, number>;
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

const fetcher = async (url: string): Promise<BlobListResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
};

export default function ImageUploadPage(): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [folderPath, setFolderPath] = useState<string>('mantra');
  const [customFolder, setCustomFolder] = useState<string>('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('');

  // Fetch existing images from blob store
  const { data: blobData, error: blobError, mutate: refetchBlobs } = useSWR<BlobListResponse>(
    `/api/admin/blob/list${selectedFolderFilter ? `?folder=${selectedFolderFilter}` : ''}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const handleSingleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      alert('No file selected');
      return;
    }

    const file = inputFileRef.current.files[0];
    setIsUploading(true);

    try {
      const selectedFolder = customFolder || folderPath;
      const blob = await uploadToBlob(file, undefined, selectedFolder);
      setUploads((prev) => [
        ...prev,
        { originalName: file.name, blob, folder: selectedFolder },
      ]);
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
      // Refetch blob list after successful upload
      refetchBlobs();
      toast.success('Image uploaded successfully!');
    } catch (error) {
      setUploads((prev) => [
        ...prev,
        {
          originalName: file.name,
          error: error instanceof Error ? error.message : 'Upload failed',
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);
    setIsUploading(true);
    setUploadProgress({});

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          try {
            const selectedFolder = customFolder || folderPath;
            const blob = await uploadToBlob(file, undefined, selectedFolder);
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }));
            return { originalName: file.name, blob, folder: selectedFolder };
          } catch (error) {
            return {
              originalName: file.name,
              error: error instanceof Error ? error.message : 'Upload failed',
            };
          }
        })
      );

      setUploads((prev) => [...prev, ...results]);
      // Refetch blob list after successful uploads
      refetchBlobs();
      toast.success(`${results.filter(r => r.blob).length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Error uploading files');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleDeleteImage = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blob/delete?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      toast.success('Image deleted successfully!');
      refetchBlobs();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Upload Images to Vercel Blob Storage
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Upload images to Vercel Blob Storage organized by category. Select a folder to organize your images.
            </p>
            
            {/* Folder Selection */}
            <Card className="mb-6 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Folder className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Select Upload Folder
                </CardTitle>
                <CardDescription>
                  Choose where to store your images. Each category has its own folder.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="folderSelect" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Category Folder:
                  </label>
                  <Select value={folderPath} onValueChange={(value) => {
                    setFolderPath(value);
                    setCustomFolder(''); // Clear custom folder when category changes
                  }}>
                    <SelectTrigger id="folderSelect" className="w-full">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOLDER_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-slate-500">{category.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Quick Select Buttons for Most Common Folders */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 self-center">Quick select:</span>
                    {FOLDER_CATEGORIES.filter(cat => ['mantra', 'project', 'research', 'hobby'].includes(cat.value)).map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setFolderPath(category.value);
                          setCustomFolder('');
                        }}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full border transition-colors",
                          folderPath === category.value
                            ? "bg-yellow-400 dark:bg-yellow-500 border-yellow-500 dark:border-yellow-400 text-slate-900 font-medium"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                      >
                        {category.icon} {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="customFolder" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Custom Folder Path (Optional):
                  </label>
                  <input
                    id="customFolder"
                    type="text"
                    value={customFolder}
                    onChange={(e) => setCustomFolder(e.target.value)}
                    placeholder={`e.g., ${folderPath}/subfolder`}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm font-mono"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Leave empty to use the selected category folder. You can add a subfolder path (e.g., <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">mantra/2024</code>).
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    <FolderOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-slate-600 dark:text-slate-400">Images will be uploaded to:</span>
                    <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded font-mono text-slate-900 dark:text-slate-50">
                      {customFolder || folderPath}/
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Single File Upload</span>
                <div className="flex items-center gap-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                  <Folder className="h-4 w-4" />
                  <span className="font-mono">
                    {customFolder || folderPath}/
                  </span>
                </div>
              </CardTitle>
              <CardDescription>Upload one image at a time</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSingleUpload} className="space-y-4">
                <div>
                  <input
                    name="file"
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/jpg, image/gif, image/svg+xml"
                    required
                    className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-slate-900 hover:file:bg-yellow-500 dark:file:bg-yellow-500 dark:file:text-slate-900 cursor-pointer"
                    disabled={isUploading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500",
                    "text-slate-900 hover:opacity-90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center gap-2"
                  )}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Multiple File Upload</span>
                <div className="flex items-center gap-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                  <Folder className="h-4 w-4" />
                  <span className="font-mono">
                    {customFolder || folderPath}/
                  </span>
                </div>
              </CardTitle>
              <CardDescription>Upload multiple images at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/webp, image/jpg, image/gif, image/svg+xml"
                  onChange={handleMultipleUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-slate-900 hover:file:bg-yellow-500 dark:file:bg-yellow-500 dark:file:text-slate-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-amber-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading files...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Existing Images from Blob Store */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Existing Images in Blob Store
                    {blobData && (
                      <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                        ({blobData.total} total)
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    View and manage all images stored in Vercel Blob Storage
                  </CardDescription>
                </div>
                <button
                  onClick={() => refetchBlobs()}
                  className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Folder Filter */}
              <div className="mb-4">
                <label htmlFor="folderFilter" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Filter by Folder:
                </label>
                <Select value={selectedFolderFilter} onValueChange={setSelectedFolderFilter}>
                  <SelectTrigger id="folderFilter" className="w-full">
                    <SelectValue placeholder="All folders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All folders</SelectItem>
                    {Object.keys(blobData?.folders || {}).map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>{folder}</span>
                          <span className="text-xs text-slate-500">
                            ({blobData?.folderStats[folder] || 0})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {blobError && (
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Error loading images: {blobError.message}
                  </p>
                </div>
              )}

              {!blobData && !blobError && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              )}

              {blobData && blobData.total === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No images found in blob store{selectedFolderFilter ? ` in "${selectedFolderFilter}" folder` : ''}.</p>
                </div>
              )}

              {blobData && blobData.total > 0 && (
                <div className="space-y-4">
                  {/* Show images grouped by folder */}
                  {Object.keys(blobData.folders || {}).length > 0 && (
                    <div className="space-y-6">
                      {Object.entries(blobData.folders || {})
                        .filter(([folder]) => !selectedFolderFilter || folder === selectedFolderFilter)
                        .map(([folder, files]) => (
                          <div key={folder} className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                              <Folder className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                              <h3 className="font-semibold text-slate-900 dark:text-slate-50">{folder}</h3>
                              <span className="text-sm text-slate-500 dark:text-slate-400">({files.length} images)</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {files.map((blob, index) => (
                                <div
                                  key={`${blob.url}-${index}`}
                                  className="group relative rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all"
                                >
                                  <div className="aspect-square relative">
                                    <img
                                      src={blob.url}
                                      alt={blob.filename || blob.pathname}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => copyToClipboard(blob.url)}
                                        className="p-2 bg-white/90 rounded hover:bg-white transition-colors"
                                        title="Copy URL"
                                      >
                                        <ImageIcon className="h-4 w-4 text-slate-900" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteImage(blob.url)}
                                        className="p-2 bg-red-500/90 rounded hover:bg-red-600 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-4 w-4 text-white" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="p-2">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate" title={blob.filename || blob.pathname}>
                                      {blob.filename || blob.pathname}
                                    </p>
                                    {blob.size && (
                                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                        {(blob.size / 1024).toFixed(2)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Root files (no folder) */}
                  {blobData.rootFiles && blobData.rootFiles.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                        <FolderOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Root</h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">({blobData.rootFiles.length} images)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {blobData.rootFiles.map((blob, index) => (
                          <div
                            key={`${blob.url}-${index}`}
                            className="group relative rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-all"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={blob.url}
                                alt={blob.filename || blob.pathname}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => copyToClipboard(blob.url)}
                                  className="p-2 bg-white/90 rounded hover:bg-white transition-colors"
                                  title="Copy URL"
                                >
                                  <ImageIcon className="h-4 w-4 text-slate-900" />
                                </button>
                                <button
                                  onClick={() => handleDeleteImage(blob.url)}
                                  className="p-2 bg-red-500/90 rounded hover:bg-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate" title={blob.filename || blob.pathname}>
                                {blob.filename || blob.pathname}
                              </p>
                              {blob.size && (
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                  {(blob.size / 1024).toFixed(2)} KB
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {uploads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Results ({uploads.length})</CardTitle>
                <CardDescription>View your uploaded images and copy URLs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {uploads.map((upload, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        upload.blob
                          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                          : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {upload.blob ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-slate-900 dark:text-slate-50 truncate block">
                                {upload.originalName}
                              </span>
                              {upload.folder && (
                                <div className="flex items-center gap-2 mt-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 w-fit">
                                  <Folder className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                                    {upload.folder}/
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {upload.blob ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">URL:</span>
                                <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded flex-1 truncate">
                                  {upload.blob.url}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(upload.blob!.url)}
                                  className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                                >
                                  Copy
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Pathname:</span>
                                <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded flex-1 truncate">
                                  {upload.blob.pathname}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(upload.blob!.pathname)}
                                  className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                                >
                                  Copy
                                </button>
                              </div>
                              <div className="mt-2">
                                <img
                                  src={upload.blob.url}
                                  alt={upload.originalName}
                                  className="max-w-xs max-h-32 object-contain rounded border border-slate-200 dark:border-slate-700"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-red-600 dark:text-red-400">
                              Error: {upload.error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {uploads.length > 0 && (
                  <button
                    onClick={() => setUploads([])}
                    className="mt-4 px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

