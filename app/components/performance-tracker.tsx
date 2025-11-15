'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PerformanceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track on client side
    if (typeof window === 'undefined') return;

    // Wait for page to be fully loaded
    const trackPerformance = () => {
      // Track Core Web Vitals
      const metrics: Record<string, number | null> = {};

      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          metrics.LCP = Math.round(lastEntry.renderTime || lastEntry.loadTime);
          
          // Send to API
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pathname,
              metrics: { LCP: metrics.LCP },
            }),
          }).catch(() => {});
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            metrics.FID = Math.round(entry.processingStart - entry.startTime);
            
            fetch('/api/analytics/performance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pathname,
                metrics: { FID: metrics.FID },
              }),
            }).catch(() => {});
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.CLS = Math.round(clsValue * 1000) / 1000;
            
            // Only send final CLS on page unload
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        metrics.TTFB = Math.round(ttfb);

        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathname,
            metrics: { TTFB: metrics.TTFB },
          }),
        }).catch(() => {});
      }

      // First Contentful Paint (FCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.FCP = Math.round(entry.startTime);
            
            fetch('/api/analytics/performance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pathname,
                metrics: { FCP: metrics.FCP },
              }),
            }).catch(() => {});
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Send final CLS on page unload
      const handleBeforeUnload = () => {
        if (metrics.CLS !== undefined && clsValue > 0) {
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/performance', JSON.stringify({
              pathname,
              metrics: { CLS: metrics.CLS },
            }));
          }
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    const timeoutId = setTimeout(trackPerformance, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}

