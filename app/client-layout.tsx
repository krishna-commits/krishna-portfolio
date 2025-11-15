'use client'

import { usePathname } from 'next/navigation'
import { PortfolioThemeProvider } from './layouts/portfolio-layout'
import { NoSideBarThemeProvider } from './layouts/blog-layout'
import { ReactNode, useMemo } from 'react'
import { ErrorBoundary } from './components/error-boundary'
import { memo } from 'react'

const themeProviders: Record<string, typeof NoSideBarThemeProvider> = {
  'blog': NoSideBarThemeProvider,
  'contact': NoSideBarThemeProvider,
  'codecanvas': NoSideBarThemeProvider,
  'research-core': NoSideBarThemeProvider,
  'mantras': NoSideBarThemeProvider,
  'skill-lab': NoSideBarThemeProvider,
  'projects': NoSideBarThemeProvider,
  'home': NoSideBarThemeProvider,
  'admin': NoSideBarThemeProvider, // Admin routes should not have portfolio layout
  '*': PortfolioThemeProvider,
}

export const ClientLayoutWrapper = memo(function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const firstPathSegment = useMemo(() => pathname?.split('/')[1] || '', [pathname])
  
  // Check if this is an admin route - admin routes should bypass site layout entirely
  const isAdminRoute = useMemo(() => {
    return pathname?.startsWith('/admin') || false
  }, [pathname])
  
  const ThemeProviderComponent = useMemo(() => {
    // Admin routes: return children directly without any layout wrapper
    if (isAdminRoute) {
      return ({ children }: { children: ReactNode }) => <>{children}</>
    }
    
    return pathname === '/' 
      ? NoSideBarThemeProvider 
      : (themeProviders[firstPathSegment] || themeProviders['*'])
  }, [pathname, firstPathSegment, isAdminRoute])

  return (
    <ErrorBoundary>
      <ThemeProviderComponent>{children}</ThemeProviderComponent>
    </ErrorBoundary>
  )
})
