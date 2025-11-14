import './globals.css';
import { AnalyticsProvider } from './components/analytics-provider';
import { ThemeProvider } from "./components/theme-provider"
import { SiteHeader } from './components/site-header';
import { Subheader } from './components/subheader';
import { ScrollToTop } from './components/scroll-to-top';
import { CustomCursor } from './components/custom-cursor';
import { ReadingProgress } from './components/reading-progress';
import { PageTransition } from './components/page-transitions';
import {
  SidebarInset,
  SidebarProvider,
} from "app/theme/components/ui/sidebar"
import { AppSidebar } from './components/sidebar/sidebar';
import { ClientLayoutWrapper } from './client-layout';
import { PerformanceMonitor } from './components/performance-monitor';

export const metadata = {
  metadataBase: new URL('https://krishnaneupane.com'),
  title: {
    default: 'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
    template: '%s | Krishna Neupane'
  },
  description: 'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure, scalable cloud infrastructure with automated threat detection, zero-trust architectures, and defense-in-depth security strategies.',
  keywords: ['DevSecOps', 'DevOps', 'Cybersecurity', 'Cloud Security', 'Research', 'Krishna Neupane'],
  authors: [{ name: 'Krishna Neupane' }],
  creator: 'Krishna Neupane',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishnaneupane.com',
    siteName: 'Krishna Neupane',
    title: 'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
    description: 'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure cloud infrastructure with automated threat detection and zero-trust architectures.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Neupane - Senior DevSecOps Engineer | Cybersecurity Expert',
    description: 'Senior DevSecOps Engineer | Cybersecurity Expert | Security Researcher. Building secure cloud infrastructure with automated threat detection and zero-trust architectures.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

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
      <body className="antialiased">
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
            <CustomCursor />
            <ReadingProgress />
            <SidebarProvider>
              <SidebarInset>
                <SiteHeader />
                <Subheader />
                <main id="main-content">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
              </SidebarInset>
              <AppSidebar side="right"/>
            </SidebarProvider>
            <AnalyticsProvider />
            <ScrollToTop />
            <PerformanceMonitor />
          </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
