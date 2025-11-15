'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from 'app/theme/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Textarea } from 'app/theme/components/ui/textarea';
import { Label } from 'app/theme/components/ui/label';
import { Eye, Code, Loader2, Save, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import { cn } from 'app/theme/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MDXEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function MDXEditor({ content, onChange, className }: MDXEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [uploading, setUploading] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (value: string) => {
    setLocalContent(value);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key support
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = localContent.substring(0, start) + '  ' + localContent.substring(end);
      handleChange(newValue);

      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        textarea.focus();
      }, 0);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      // Upload to Vercel Blob Storage using the existing upload API
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&folder=public`, {
        method: 'POST',
        body: file, // Send file directly as blob
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Insert image markdown at cursor position
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const imageMarkdown = `![${file.name}](${data.url})`;
        const newValue = localContent.substring(0, start) + imageMarkdown + localContent.substring(end);
        handleChange(newValue);

        // Reset cursor position after image markdown
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
          textarea.focus();
        }, 0);
      } else {
        // If no cursor position, append to end
        handleChange(localContent + `\n\n![${file.name}](${data.url})\n\n`);
      }

      toast.success('Image uploaded successfully');
      setIsImageDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const insertImageMarkdown = (imageUrl: string, altText: string = '') => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const imageMarkdown = `![${altText}](${imageUrl})`;
      const newValue = localContent.substring(0, start) + imageMarkdown + localContent.substring(end);
      handleChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
        textarea.focus();
      }, 0);
    } else {
      handleChange(localContent + `\n\n![${altText}](${imageUrl})\n\n`);
    }
  };

  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle>MDX Content</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!isPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImageDialogOpen(true)}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            )}
            <Button
              variant={!isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              <Code className="h-4 w-4 mr-2" />
              Editor
            </Button>
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        <CardDescription>
          {isPreview ? 'Preview your MDX content' : 'Write and edit your MDX content'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[600px]">
          {!isPreview ? (
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={localContent}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm min-h-[600px] resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your MDX content here..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                {localContent.split('\n').length} lines • {localContent.length} characters
              </div>
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none p-4 border border-slate-200 dark:border-slate-800 rounded-lg min-h-[600px] bg-slate-50 dark:bg-slate-900/50">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {localContent || <span className="text-slate-400">Preview will appear here...</span>}
              </pre>
            </div>
          )}
        </div>
      </CardContent>

      {/* Image Upload Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Image</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Upload an image to Vercel Blob Storage and insert it into your MDX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Select Image</Label>
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Or paste an image URL:
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) {
                          insertImageMarkdown(url);
                          (e.target as HTMLInputElement).value = '';
                          setIsImageDialogOpen(false);
                          toast.success('Image markdown inserted');
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                      const url = input?.value;
                      if (url) {
                        insertImageMarkdown(url);
                        input.value = '';
                        setIsImageDialogOpen(false);
                        toast.success('Image markdown inserted');
                      }
                    }}
                  >
                    Insert
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}

