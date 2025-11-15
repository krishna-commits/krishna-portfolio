'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from 'app/theme/lib/utils';
import {
    LayoutDashboard,
    Image,
    Heart,
    Mail,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    Database,
    BarChart3,
    Home,
    Search,
    Lock,
    FolderOpen,
    Shield,
    Cloud
  } from 'lucide-react';
import { Button } from 'app/theme/components/ui/button';
import toast from 'react-hot-toast';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    title: 'Upload Images',
    href: '/admin/upload-images',
    icon: Image,
    description: 'Upload to Blob Storage',
  },
  {
    title: 'Image Manager',
    href: '/admin/images',
    icon: FolderOpen,
    description: 'View & delete images',
  },
  {
    title: 'Hobbies',
    href: '/admin/hobbies',
    icon: Heart,
    description: 'Manage hobbies',
  },
  {
    title: 'Newsletter',
    href: '/admin/newsletter',
    icon: Mail,
    description: 'Manage subscribers',
  },
  {
    title: 'Homepage Management',
    href: '/admin/homepage',
    icon: Home,
    description: 'Manage homepage sections',
  },
  {
    title: 'Database Test',
    href: '/admin/database',
    icon: Database,
    description: 'Test database connection',
  },
  {
    title: 'Content Management',
    href: '/admin/content',
    icon: FileText,
    description: 'Manage MDX content',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Portfolio analytics & insights',
  },
  {
    title: 'Enhanced Analytics',
    href: '/admin/analytics/enhanced',
    icon: BarChart3,
    description: 'Visitor, performance & external metrics',
  },
  {
    title: 'SEO Tools',
    href: '/admin/seo',
    icon: Search,
    description: 'Meta tags, sitemap, robots.txt',
  },
  {
    title: 'Environment Variables',
    href: '/admin/env',
    icon: Lock,
    description: 'Manage env vars securely',
  },
  {
    title: 'Security & Login',
    href: '/admin/security',
    icon: Shield,
    description: 'Monitor login attempts',
  },
  {
    title: 'Cloudflare Analytics',
    href: '/admin/cloudflare',
    icon: Cloud,
    description: 'CDN & cache metrics',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Admin settings',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
        router.refresh();
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast.error('Failed to logout');
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="touch-manipulation"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 sm:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg lg:shadow-sm transition-transform",
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
                <LayoutDashboard className="h-5 w-5 text-slate-900" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Admin Panel
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Portfolio Management
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200",
                    "text-slate-700 dark:text-slate-300 min-h-[56px] sm:min-h-auto",
                    "touch-manipulation", // Better touch handling on mobile
                    isActive
                      ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-900 font-semibold shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 active:bg-slate-200 dark:active:bg-slate-700"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">{item.title}</div>
                    <div className="text-xs opacity-70 hidden sm:block">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="mr-2 h-5 w-5" />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

