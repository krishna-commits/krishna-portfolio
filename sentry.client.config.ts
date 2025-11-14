/**
 * Sentry Configuration for Client-Side Error Tracking
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Add SENTRY_DSN to .env.local
 * 4. Uncomment the code below
 */

/*
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  
  // Set sample rate for profiling - this is relative to tracesSampleRate
  // Setting to 1.0 means 100% of transactions will be profiled
  profilesSampleRate: 1.0,
  
  // Enable capturing of unhandled promise rejections
  captureUnhandledRejections: true,
  
  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Release version
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Filter out sensitive information
    if (event.request) {
      // Remove sensitive headers
      if (event.request.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
      }
      
      // Remove sensitive query parameters
      if (event.request.query_string) {
        const params = new URLSearchParams(event.request.query_string)
        params.delete('token')
        params.delete('api_key')
        params.delete('password')
        event.request.query_string = params.toString()
      }
    }
    
    return event
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    'fb_xd_fragment',
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    'conduitPage',
    // Network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    // Third-party scripts
    'Script error',
    'Javascript error',
  ],
  
  // Filter out specific URLs
  denyUrls: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    // Facebook plugins
    /connect\.facebook\.net/i,
    // Google APIs
    /apis\.google\.com/i,
    // Other third-party scripts
    /doubleclick\.net/i,
    /googlesyndication\.com/i,
  ],
})
*/

// Export empty object for now (will be populated when Sentry is enabled)
export {}

