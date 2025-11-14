/**
 * Sentry Configuration for Server-Side Error Tracking
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
  dsn: process.env.SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  
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
        delete event.request.headers['x-api-key']
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
    // Database connection errors
    'ECONNREFUSED',
    'ENOTFOUND',
    // API rate limiting
    '429',
    'Too Many Requests',
    // Authentication errors (expected)
    '401',
    'Unauthorized',
    '403',
    'Forbidden',
  ],
})
*/

// Export empty object for now (will be populated when Sentry is enabled)
export {}

