'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login' || pathname?.startsWith('/admin/login')) {
      setIsChecking(false);
      return;
    }

    // Check authentication for all other admin pages
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading while checking authentication
  if (isChecking && pathname !== '/admin/login' && !pathname?.startsWith('/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    );
  }

  // Login page - render without sidebar
  if (pathname === '/admin/login' || pathname?.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  // Not authenticated and not on login page - should redirect
  if (isAuthenticated === false) {
    return null;
  }

  // Authenticated - show admin panel with sidebar
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="lg:pl-64 transition-all duration-200">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
