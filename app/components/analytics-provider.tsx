'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect } from 'react'

/**
 * Privacy-first analytics and monitoring provider
 * Uses Vercel Analytics (privacy-respecting) and Speed Insights
 * 
 * For self-hosted analytics, you can add:
 * - Plausible Analytics (privacy-first, no cookies)
 * - Umami Analytics (self-hosted, privacy-first)
 * - Posthog (open-source, privacy-focused)
 */
export function AnalyticsProvider() {
  useEffect(() => {
    // Initialize any additional analytics here
    // Example: Plausible Analytics
    // if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    //   const script = document.createElement('script')
    //   script.defer = true
    //   script.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
    //   script.src = 'https://plausible.io/js/script.js'
    //   document.head.appendChild(script)
    // }

    // Example: Umami Analytics
    // if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    //   const script = document.createElement('script')
    //   script.defer = true
    //   script.setAttribute('data-website-id', process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID)
    //   script.src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://analytics.umami.is/script.js'
    //   document.head.appendChild(script)
    // }
  }, [])

  return (
    <>
      {/* Vercel Analytics - Privacy-respecting, GDPR compliant */}
      <Analytics />
      
      {/* Vercel Speed Insights - Performance monitoring */}
      <SpeedInsights />
    </>
  )
}

