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
  '*': PortfolioThemeProvider,
}

export const ClientLayoutWrapper = memo(function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const firstPathSegment = useMemo(() => pathname?.split('/')[1] || '', [pathname])
  
  const ThemeProviderComponent = useMemo(() => {
    return pathname === '/' 
      ? NoSideBarThemeProvider 
      : (themeProviders[firstPathSegment] || themeProviders['*'])
  }, [pathname, firstPathSegment])

  return (
    <ErrorBoundary>
      <ThemeProviderComponent>{children}</ThemeProviderComponent>
    </ErrorBoundary>
  )
})
