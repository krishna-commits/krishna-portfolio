'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

let sessionId: string | null = null;
let startTime: number = Date.now();
let maxScrollDepth: number = 0;

// Initialize session ID
if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('analytics_session') || 
              `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('analytics_session', sessionId);
}

export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on mount
    const trackPageView = async () => {
      if (!sessionId) return;

      const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      const referrer = document.referrer || '';
      
      // Track initial page view
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathname: fullPath,
          referrer,
          sessionId,
          timeOnPage: 0,
          scrollDepth: 0,
        }),
      }).catch(() => {}); // Silent fail
    };

    // Reset tracking for new page
    startTime = Date.now();
    maxScrollDepth = 0;

    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;
      maxScrollDepth = Math.max(maxScrollDepth, depth);
    };

    // Track time on page before leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      const referrer = document.referrer || '';

      // Send beacon or fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          pathname: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
          referrer,
          sessionId,
          timeOnPage,
          scrollDepth: maxScrollDepth,
        }));
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pathname: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
            referrer,
            sessionId,
            timeOnPage,
            scrollDepth: maxScrollDepth,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Periodic update (every 30 seconds)
    const intervalId = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathname: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
          referrer: document.referrer || '',
          sessionId,
          timeOnPage,
          scrollDepth: maxScrollDepth,
        }),
      }).catch(() => {});
    }, 30000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    trackPageView();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Final tracking
    };
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

