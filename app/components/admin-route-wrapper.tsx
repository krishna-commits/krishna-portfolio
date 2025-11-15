'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminRouteWrapperProps {
  adminContent: ReactNode;
  siteContent: ReactNode;
}

export function AdminRouteWrapper({ adminContent, siteContent }: AdminRouteWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;

  if (isAdminRoute) {
    return <>{adminContent}</>;
  }

  return <>{siteContent}</>;
}

