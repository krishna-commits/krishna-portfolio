'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { LinkIcon, Save, Loader2, Github, Linkedin, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SocialLinksPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    github: '',
    linkedIn: '',
    researchgate: '',
    orcid: '',
    medium: '',
    twitter: '',
    email: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/homepage/social');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setFormData(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load social links');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/admin/homepage/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save');

      toast.success('Social links updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
      </div>
    );
  }

  const socialFields = [
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username', icon: Github },
    { key: 'linkedIn', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: Linkedin },
    { key: 'researchgate', label: 'ResearchGate', placeholder: 'https://researchgate.net/profile/username', icon: LinkIcon },
    { key: 'orcid', label: 'ORCID', placeholder: 'https://orcid.org/0000-0000-0000-0000', icon: LinkIcon },
    { key: 'medium', label: 'Medium', placeholder: 'https://medium.com/@username', icon: LinkIcon },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/username', icon: LinkIcon },
    { key: 'email', label: 'Email', placeholder: 'your.email@example.com', icon: Mail },
  ];

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Connect & Collaborate</CardTitle>
                <CardDescription>Manage your social media and contact links</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {socialFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <Label htmlFor={field.key} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type={field.key === 'email' ? 'email' : 'url'}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="mt-2"
                    />
                  </div>
                );
              })}
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
