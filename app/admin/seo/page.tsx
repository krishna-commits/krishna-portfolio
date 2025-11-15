'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { Input } from 'app/theme/components/ui/input';
import { Label } from 'app/theme/components/ui/label';
import { Textarea } from 'app/theme/components/ui/textarea';
import { 
  Search, Save, Loader2, Globe, FileText, Settings, RefreshCw,
  CheckCircle2, AlertCircle, ExternalLink, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'app/theme/components/ui/tabs';

export default function SEOToolsPage() {
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    canonical: '',
  });

  const [robotsTxt, setRobotsTxt] = useState('');
  const [sitemapStatus, setSitemapStatus] = useState<'checking' | 'exists' | 'missing'>('checking');

  useEffect(() => {
    checkSitemap();
    loadRobotsTxt();
    loadMetaTags();
  }, []);

  const loadRobotsTxt = async () => {
    try {
      const response = await fetch('/api/admin/seo/robots');
      const data = await response.json();
      setRobotsTxt(data.content || '');
    } catch {
      // Ignore errors
    }
  };

  const loadMetaTags = async () => {
    try {
      const response = await fetch('/api/admin/seo/meta');
      if (response.ok) {
        const data = await response.json();
        if (data.title || data.description) {
          setMetaData(data);
        }
      }
    } catch {
      // Use defaults if fetch fails
    }
  };

  const checkSitemap = async () => {
    try {
      const response = await fetch('/sitemap.xml', { method: 'HEAD' });
      setSitemapStatus(response.ok ? 'exists' : 'missing');
    } catch {
      setSitemapStatus('missing');
    }
  };

  const generateSitemap = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/generate-sitemap', {
        method: 'POST',
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate sitemap');
      
      // Download sitemap
      const blob = new Blob([data.sitemap], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Sitemap generated with ${data.urlCount} URLs! Save to public/sitemap.xml`);
      checkSitemap();
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  const saveRobotsTxt = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/robots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: robotsTxt }),
      });

      if (!response.ok) throw new Error('Failed to save robots.txt');
      
      toast.success('robots.txt updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save robots.txt');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSEO = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: metaData.canonical }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      
      toast.success(`SEO Score: ${data.analysis?.score || 0}/100`);
      
      // Show recommendations if available
      if (data.analysis?.recommendations?.length > 0) {
        setTimeout(() => {
          toast(`Recommendations: ${data.analysis.recommendations.join(', ')}`, {
            duration: 5000,
            icon: '💡',
          });
        }, 500);
      }
    } catch (error: any) {
      toast.error(error.message || 'SEO analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                SEO Tools
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage meta tags, sitemap, robots.txt, and analyze SEO
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="meta" className="space-y-6">
          <TabsList>
            <TabsTrigger value="meta">Meta Tags</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="robots">Robots.txt</TabsTrigger>
            <TabsTrigger value="analyze">SEO Analyzer</TabsTrigger>
          </TabsList>

          {/* Meta Tags Tab */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <CardTitle>Meta Tags Manager</CardTitle>
                <CardDescription>Manage SEO meta tags for your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Meta */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Meta Tags</h3>
                  <div>
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={metaData.title}
                      onChange={(e) => setMetaData({ ...metaData, title: e.target.value })}
                      placeholder="Page title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea
                      id="description"
                      value={metaData.description}
                      onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                      placeholder="Meta description (150-160 characters)"
                      rows={3}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {metaData.description.length}/160 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={metaData.keywords}
                      onChange={(e) => setMetaData({ ...metaData, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      value={metaData.canonical}
                      onChange={(e) => setMetaData({ ...metaData, canonical: e.target.value })}
                      placeholder="https://krishnaneupane.com"
                    />
                  </div>
                </div>

                {/* Open Graph */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Open Graph Tags</h3>
                  <div>
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={metaData.ogTitle}
                      onChange={(e) => setMetaData({ ...metaData, ogTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ogDescription">OG Description</Label>
                    <Textarea
                      id="ogDescription"
                      value={metaData.ogDescription}
                      onChange={(e) => setMetaData({ ...metaData, ogDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={metaData.ogImage}
                      onChange={(e) => setMetaData({ ...metaData, ogImage: e.target.value })}
                      placeholder="https://krishnaneupane.com/og-image.jpg"
                    />
                  </div>
                </div>

                {/* Twitter Card */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Twitter Card</h3>
                  <div>
                    <Label htmlFor="twitterCard">Card Type</Label>
                    <select
                      id="twitterCard"
                      value={metaData.twitterCard}
                      onChange={(e) => setMetaData({ ...metaData, twitterCard: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="twitterTitle">Twitter Title</Label>
                    <Input
                      id="twitterTitle"
                      value={metaData.twitterTitle}
                      onChange={(e) => setMetaData({ ...metaData, twitterTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterDescription">Twitter Description</Label>
                    <Textarea
                      id="twitterDescription"
                      value={metaData.twitterDescription}
                      onChange={(e) => setMetaData({ ...metaData, twitterDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await fetch('/api/admin/seo/meta', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(metaData),
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.error || 'Failed to save');
                        toast.success('Meta tags saved successfully!');
                      } catch (error: any) {
                        toast.error(error.message || 'Failed to save meta tags');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading} 
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Meta Tags
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sitemap Tab */}
          <TabsContent value="sitemap">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Generator</CardTitle>
                <CardDescription>Generate and manage your XML sitemap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {sitemapStatus === 'exists' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">Sitemap Status</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {sitemapStatus === 'exists' 
                          ? 'sitemap.xml exists' 
                          : 'sitemap.xml not found'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {sitemapStatus === 'exists' && (
                      <Button variant="outline" size="sm" asChild>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                    )}
                    <Button
                      onClick={generateSitemap}
                      disabled={loading}
                      size="sm"
                      className="gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A sitemap helps search engines discover and index all pages on your site.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Robots.txt Tab */}
          <TabsContent value="robots">
            <Card>
              <CardHeader>
                <CardTitle>Robots.txt Editor</CardTitle>
                <CardDescription>Configure how search engines crawl your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Sitemap: https://krishnaneupane.com/sitemap.xml"
                  rows={10}
                  className="font-mono text-sm"
                />
                <div className="flex justify-end">
                  <Button onClick={saveRobotsTxt} disabled={loading} className="gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save robots.txt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Analyzer Tab */}
          <TabsContent value="analyze">
            <Card>
              <CardHeader>
                <CardTitle>SEO Analyzer</CardTitle>
                <CardDescription>Analyze your site's SEO performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="analyzeUrl">URL to Analyze</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="analyzeUrl"
                      value={metaData.canonical}
                      onChange={(e) => setMetaData({ ...metaData, canonical: e.target.value })}
                      placeholder="https://krishnaneupane.com"
                    />
                    <Button onClick={analyzeSEO} disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Analyze your site's SEO score and get recommendations for improvement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

