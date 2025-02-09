"use client"
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from "./components/theme-provider"
import { SiteHeader } from './components/site-header';
import Stroke from './components/pattern/stroke';
import Gradient from './components/pattern/gradient';
import { PortfolioThemeProvider } from './layouts/portfolio-layout';
import { usePathname } from 'next/navigation'
import { NoSideBarThemeProvider } from './layouts/blog-layout';
import Copyright from './components/footer/copyright';

const themeProviders = {
  'blog': NoSideBarThemeProvider,
  'contact': NoSideBarThemeProvider,
  'codecanvas':NoSideBarThemeProvider,
  'research-core':NoSideBarThemeProvider,
  'mantras':NoSideBarThemeProvider,
  'skill-lab':NoSideBarThemeProvider,
  '*': PortfolioThemeProvider,
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname()
  // Extract the first segment of the path
  const firstPathSegment = pathname.split('/')[1];

  // Use the selected theme provider or default to PortfolioThemeProvider
  const ThemeProviderComponent = themeProviders[firstPathSegment] || themeProviders['*'];


  return (
    <html lang="en" suppressHydrationWarning 
    className={`scroll-smooth focus:scroll-auto`}

    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {/* <Stroke /> */}
          <div className="relative isolate">
            {/* <Gradient /> */}
          

            <ThemeProviderComponent>
                {children}
            </ThemeProviderComponent>

            <Analytics />
            <SpeedInsights />
          </div>
        </ThemeProvider>
        {/* <Copyright /> */}
      </body>
    </html>
  );
}
