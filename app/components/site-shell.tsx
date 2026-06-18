'use client'

import { ReactNode, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { AnalyticsProvider } from './analytics-provider'
import { SiteHeader } from './site-header'
import { Subheader } from './subheader'
import { ScrollToTop } from './scroll-to-top'
import { ReadingProgress } from './reading-progress'
import { PageTransition } from './page-transitions'
import { PerformanceMonitor } from './performance-monitor'
import { VisitorTracker } from './visitor-tracker'
import { PerformanceTracker } from './performance-tracker'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

/**
 * Renders public site chrome once. Admin routes pass children through unchanged
 * so App Router slots are never duplicated in the React tree.
 */
export function SiteShell({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const isAdminRoute = pathname?.startsWith('/admin') ?? false

	if (isAdminRoute) {
		return <>{children}</>
	}

	return (
		<>
			<ReadingProgress />
			<SiteHeader />
			<Subheader />
			<main id="main-content">
				<PageTransition>{children}</PageTransition>
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
	)
}
