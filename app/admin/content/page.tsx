'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { FileText, BookOpen, Code, Sparkles, ArrowRight, Database } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const contentTypes = [
  {
    type: 'blog',
    title: 'Blog Posts',
    description: 'Manage blog posts and articles',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    href: '/admin/content/blog',
  },
  {
    type: 'project',
    title: 'Projects',
    description: 'Manage project showcases',
    icon: Code,
    gradient: 'from-purple-500 to-indigo-500',
    href: '/admin/content/project',
  },
  {
    type: 'research',
    title: 'Research Articles',
    description: 'Manage research content and publications',
    icon: BookOpen,
    gradient: 'from-amber-500 to-orange-500',
    href: '/admin/content/research',
  },
  {
    type: 'mantra',
    title: 'Mantras',
    description: 'Manage mantra content',
    icon: Sparkles,
    gradient: 'from-rose-500 to-pink-500',
    href: '/admin/content/mantra',
  },
];

export default function ContentIndexPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
              <Database className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                Content Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Create, edit, and manage all your content in MDX format
              </p>
            </div>
          </div>
        </div>

        {/* Content Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentTypes.map((contentType, index) => {
            const Icon = contentType.icon;
            return (
              <motion.div
                key={contentType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={contentType.href}>
                  <Card className="relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-xl cursor-pointer h-full group">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${contentType.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:opacity-20 transition-opacity`} />
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${contentType.gradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{contentType.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {contentType.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Manage {contentType.type} content
                        </span>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              About MDX Content Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>
              All content is stored as MDX files in the <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-xs">content/</code> directory.
            </p>
            <p>
              • <strong>Blog Posts:</strong> Stored in <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-xs">content/blog/</code>
            </p>
            <p>
              • <strong>Projects:</strong> Stored in <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-xs">content/projects/</code>
            </p>
            <p>
              • <strong>Research:</strong> Stored in <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-xs">content/research-core/</code>
            </p>
            <p>
              • <strong>Mantras:</strong> Stored in <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-xs">content/mantras/</code>
            </p>
            <p className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <strong>Note:</strong> After creating or updating content, Contentlayer will automatically regenerate the site. Changes may take a few moments to appear.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
