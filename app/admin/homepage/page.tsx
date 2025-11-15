'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'app/theme/components/ui/card';
import { Button } from 'app/theme/components/ui/button';
import { 
  User, GraduationCap, Briefcase, Award, MessageSquare, Code, 
  Heart, Users, Settings, Image as ImageIcon, ArrowRight,
  BarChart3, Shield, BookOpen, Github, Link as LinkIcon, Database, Loader2, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const homepageSections = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Profile image, bio, title, and description',
    icon: User,
    gradient: 'from-blue-500 to-cyan-500',
    href: '/admin/homepage/hero',
    color: 'text-blue-500',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Manage education history and qualifications',
    icon: GraduationCap,
    gradient: 'from-purple-500 to-indigo-500',
    href: '/admin/homepage/education',
    color: 'text-purple-500',
  },
  {
    id: 'work',
    title: 'Work Experience',
    description: 'Manage work experience and employment history',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500',
    href: '/admin/homepage/work',
    color: 'text-amber-500',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Manage professional certifications and credentials',
    icon: Award,
    gradient: 'from-green-500 to-emerald-500',
    href: '/admin/homepage/certifications',
    color: 'text-green-500',
  },
  {
    id: 'recommendations',
    title: 'LinkedIn Recommendations',
    description: 'Manage LinkedIn recommendations and testimonials',
    icon: MessageSquare,
    gradient: 'from-blue-600 to-blue-800',
    href: '/admin/homepage/recommendations',
    color: 'text-blue-600',
  },
  {
    id: 'technology',
    title: 'Technology Stack',
    description: 'Manage technology stack and skills',
    icon: Code,
    gradient: 'from-rose-500 to-pink-500',
    href: '/admin/homepage/technology',
    color: 'text-rose-500',
  },
  {
    id: 'volunteering',
    title: 'Volunteering',
    description: 'Manage volunteering activities',
    icon: Heart,
    gradient: 'from-red-500 to-rose-500',
    href: '/admin/homepage/volunteering',
    color: 'text-red-500',
  },
  {
    id: 'stats',
    title: 'Impact Metrics',
    description: 'Manage statistics and metrics display',
    icon: BarChart3,
    gradient: 'from-indigo-500 to-purple-500',
    href: '/admin/homepage/stats',
    color: 'text-indigo-500',
  },
  {
    id: 'personal-note',
    title: 'What Drives Me',
    description: 'Manage personal philosophy section',
    icon: BookOpen,
    gradient: 'from-teal-500 to-cyan-500',
    href: '/admin/homepage/personal-note',
    color: 'text-teal-500',
  },
  {
    id: 'security',
    title: 'Security-First Approach',
    description: 'Manage security methodology section',
    icon: Shield,
    gradient: 'from-yellow-500 to-orange-500',
    href: '/admin/homepage/security',
    color: 'text-yellow-500',
  },
  {
    id: 'social',
    title: 'Connect & Collaborate',
    description: 'Manage social links and connections',
    icon: LinkIcon,
    gradient: 'from-sky-500 to-blue-500',
    href: '/admin/homepage/social',
    color: 'text-sky-500',
  },
  {
    id: 'github',
    title: 'GitHub Contributions',
    description: 'Configure GitHub display settings',
    icon: Github,
    gradient: 'from-slate-600 to-slate-800',
    href: '/admin/homepage/github',
    color: 'text-slate-600',
  },
];

export default function HomepageManagementPage() {
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'configured' | 'not-configured' | null>(null);

  useEffect(() => {
    // Check database status
    const checkDbStatus = async () => {
      try {
        const response = await fetch('/api/admin/homepage/education');
        if (response.ok) {
          setDbStatus('configured');
        } else {
          setDbStatus('not-configured');
        }
      } catch {
        setDbStatus('not-configured');
      }
    };
    checkDbStatus();
  }, []);

  const handleMigrate = async () => {
    if (!confirm('This will migrate all existing data from config/site.tsx to the database. Continue?')) {
      return;
    }

    try {
      setMigrating(true);
      const response = await fetch('/api/admin/homepage/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Migration failed');
      }

      // Check for errors in results
      const errors = Object.entries(data.results || {})
        .filter(([key]) => key.endsWith('_error'))
        .map(([key, value]) => `${key.replace('_error', '')}: ${value}`)
        .join(', ');

      if (errors) {
        toast.error(`Migration completed with errors: ${errors}`, { duration: 5000 });
        setMigrated(false); // Allow retry if there were errors
      } else {
        toast.success('Data migrated successfully!');
        setMigrated(true);
      }
      
      // Show results
      if (data.results) {
        const successResults = Object.entries(data.results)
          .filter(([key]) => !key.endsWith('_error') && !key.endsWith('_note'))
          .map(([key, value]) => `${key}: ${value} items`)
          .join(', ');
        
        if (successResults) {
          toast.success(`Migrated: ${successResults}`, { duration: 4000 });
        }

        // Show notes
        const notes = Object.entries(data.results)
          .filter(([key]) => key.endsWith('_note'))
          .map(([key, value]) => `${key.replace('_note', '')}: ${value}`)
          .join(', ');
        
        if (notes) {
          toast(notes, { icon: 'ℹ️', duration: 3000 });
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to migrate data');
      console.error('Error migrating data:', error);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
                <Settings className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Homepage Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage all sections of your homepage from one place
                </p>
              </div>
            </div>
            <Button
              onClick={handleMigrate}
              disabled={migrating || migrated}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {migrating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : migrated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Migrated
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Import from Config
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Migration Info */}
        {!migrated && (
          <Card className="mb-8 border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Database className="h-5 w-5" />
                Import Existing Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-800 dark:text-amber-200 space-y-3">
              <p className="mb-2">
                Your existing homepage data is stored in <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">config/site.tsx</code>. 
                Click the "Import from Config" button above to migrate all existing data (education, work experience, certifications, recommendations, technology stack, volunteering, and hero settings) to the database.
              </p>
              <p className="text-xs mt-2 opacity-75">
                This is a one-time migration. After migrating, you can manage all data through this admin panel.
              </p>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  📋 Database Setup Required:
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Make sure you have configured your database environment variables in <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">.env</code>:
                  <br />• <code>POSTGRES_PRISMA_URL</code>
                  <br />• <code>POSTGRES_URL_NON_POOLING</code>
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  After setting up the database, run: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">npx prisma db push</code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={section.href}>
                  <Card className="relative overflow-hidden border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-xl cursor-pointer h-full group">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${section.gradient} opacity-10 rounded-full -mr-20 -mt-20 group-hover:opacity-20 transition-opacity`} />
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${section.gradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Configure section
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
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              About Homepage Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>
              Manage all sections of your homepage including profile information, work experience, education, certifications, recommendations, and more.
            </p>
            <p className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <strong>Note:</strong> Changes may take a few moments to appear on the live site. All data is stored in the database and can be edited anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

