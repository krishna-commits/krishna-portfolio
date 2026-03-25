import './globals.css';
import { Suspense } from 'react';
import { AnalyticsProvider } from './components/analytics-provider';
import { ThemeProvider } from "./components/theme-provider"
import { SiteHeader } from './components/site-header';
import { Subheader } from './components/subheader';
import { ScrollToTop } from './components/scroll-to-top';
import { CustomCursor } from './components/custom-cursor';
import { ReadingProgress } from './components/reading-progress';
import { PageTransition } from './components/page-transitions';
import { ClientLayoutWrapper } from './client-layout';
import { PerformanceMonitor } from './components/performance-monitor';
import { AdminRouteWrapper } from './components/admin-route-wrapper';
import { VisitorTracker } from './components/visitor-tracker';
import { PerformanceTracker } from './components/performance-tracker';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { rootLayoutMetadata } from './metadata';

export const metadata = rootLayoutMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://krishnaneupane.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body className="antialiased overflow-x-clip">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayoutWrapper>
            <AdminRouteWrapper
              adminContent={children}
              siteContent={
                <>
                  <CustomCursor />
                  <ReadingProgress />
                  <SiteHeader />
                  <Subheader />
                  <main id="main-content">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <AnalyticsProvider />
                  <ScrollToTop />
                  <PerformanceMonitor />
                  <Suspense fallback={null}>
                    <VisitorTracker />
                  </Suspense>
                  <PerformanceTracker />
                  <SpeedInsights />
                  <Analytics />
                </>
              }
            />
          </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
