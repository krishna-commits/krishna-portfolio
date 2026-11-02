// Shared by next.config.mjs (sends the headers) and /colophon (displays them), so the page can never drift from reality.

/*
 * script-src needs 'unsafe-inline' because statically rendered Next.js pages inline their RSC payload.
 * A nonce would force every page to render dynamically and lose CDN caching; everything else is locked down.
 */
// React uses eval() in development only (to rebuild server-side call stacks); production never allows it.
const isDev = process.env.NODE_ENV === "development";

export const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
];

export const securityHeaders = [
  { key: "Content-Security-Policy", value: csp.join("; ") },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];
