'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { uploadToBlob, uploadMultipleToBlob } from 'app/lib/blob-utils';
import { Upload, CheckCircle2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from 'app/theme/lib/utils';

interface UploadResult {
  originalName: string;
  blob?: PutBlobResult;
  error?: string;
}

export default function ImageUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleSingleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      alert('No file selected');
      return;
    }

    const file = inputFileRef.current.files[0];
    setIsUploading(true);

    try {
      const blob = await uploadToBlob(file);
      setUploads((prev) => [
        ...prev,
        { originalName: file.name, blob },
      ]);
      // Reset input
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
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
            const blob = await uploadToBlob(file);
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: 100,
            }));
            return { originalName: file.name, blob };
          } catch (error) {
            return {
              originalName: file.name,
              error: error instanceof Error ? error.message : 'Upload failed',
            };
          }
        })
      );

      setUploads((prev) => [...prev, ...results]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Upload Images to Vercel Blob Storage
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload images from your public folder to Vercel Blob Storage. All images will be publicly accessible.
          </p>
        </div>

        {/* Single File Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Single File Upload
          </h2>
          <form onSubmit={handleSingleUpload} className="space-y-4">
            <div>
              <input
                name="file"
                ref={inputFileRef}
                type="file"
                accept="image/jpeg, image/png, image/webp, image/jpg, image/gif, image/svg+xml"
                required
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-400 file:text-slate-900
                  hover:file:bg-yellow-500
                  dark:file:bg-yellow-500 dark:file:text-slate-900
                  cursor-pointer"
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
        </div>

        {/* Multiple File Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Multiple File Upload
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp, image/jpg, image/gif, image/svg+xml"
              onChange={handleMultipleUpload}
              disabled={isUploading}
              className="block w-full text-sm text-slate-500 dark:text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-yellow-400 file:text-slate-900
                hover:file:bg-yellow-500
                dark:file:bg-yellow-500 dark:file:text-slate-900
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-amber-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading files...</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Results */}
        {uploads.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Upload Results ({uploads.length})
            </h2>
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
                        <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {upload.originalName}
                        </span>
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
          </div>
        )}
      </div>
    </div>
  );
}

