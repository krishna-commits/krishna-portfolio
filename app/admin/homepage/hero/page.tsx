'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Textarea } from 'app/theme/components/ui/textarea';
import { User, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Badge } from 'app/theme/components/ui/badge';
import { X } from 'lucide-react';

export default function HeroSectionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: '',
    name: '',
    bio: '',
    title: '',
    description: '',
    talksAbout: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage/hero');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFormData({
        profileImage: data.profileImage || '',
        name: data.name || '',
        bio: data.bio || '',
        title: data.title || '',
        description: data.description || '',
        talksAbout: Array.isArray(data.talksAbout) ? data.talksAbout : [],
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/admin/homepage/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save');

      toast.success('Hero section updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.talksAbout.includes(tag)) {
      setFormData({
        ...formData,
        talksAbout: [...formData.talksAbout, tag],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      talksAbout: formData.talksAbout.filter(t => t !== tag),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload?filename=profile.jpg&folder=public', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setFormData(prev => ({ ...prev, profileImage: data.url }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Manage your profile image, name, bio, and headline</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Image */}
              <div>
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="profileImage"
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                    placeholder="/photo.jpg"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </span>
                    </Button>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                {formData.profileImage && (
                  <div className="mt-2">
                    <img
                      src={formData.profileImage}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800"
                      onError={() => toast.error('Failed to load image')}
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Krishna Neupane"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio/Tagline *</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Senior DevSecOps Engineer | Cybersecurity Expert"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Hero Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Building Secure Cloud Infrastructure"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Automating threat detection, implementing zero-trust architectures..."
                  rows={4}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (#DevSecOps, #Cybersecurity, etc.)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.talksAbout.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.talksAbout.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
