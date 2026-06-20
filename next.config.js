const { createContentlayerPlugin } = require("next-contentlayer");

const researchCoreRedirects = [
  { source: "/research-core/DevSecOps/:path*", destination: "/research-core/01-security-engineering/devsecops/:path*", permanent: true },
  { source: "/research-core/Security/:path*", destination: "/research-core/01-security-engineering/security/:path*", permanent: true },
  { source: "/research-core/Kubernetes-Security/:path*", destination: "/research-core/01-security-engineering/kubernetes-security/:path*", permanent: true },
  { source: "/research-core/Zero-Trust-Architecture/:path*", destination: "/research-core/01-security-engineering/zero-trust-architecture/:path*", permanent: true },
  { source: "/research-core/Supply-Chain-Security/:path*", destination: "/research-core/01-security-engineering/supply-chain-security/:path*", permanent: true },
  { source: "/research-core/Incident-Response/:path*", destination: "/research-core/01-security-engineering/incident-response/:path*", permanent: true },
  { source: "/research-core/Cloud-Security-Posture/:path*", destination: "/research-core/01-security-engineering/cloud-security-posture/:path*", permanent: true },
  { source: "/research-core/CyberSecurity/:path*", destination: "/research-core/01-security-engineering/cybersecurity/:path*", permanent: true },
  { source: "/research-core/Cloud-Platform/:path*", destination: "/research-core/02-platform-cloud/cloud-platform/:path*", permanent: true },
  { source: "/research-core/Infranstracture-as-a-Code/:path*", destination: "/research-core/02-platform-cloud/infrastructure-as-code/:path*", permanent: true },
  { source: "/research-core/Containerization-and-Orchestration/:path*", destination: "/research-core/02-platform-cloud/containerization-and-orchestration/:path*", permanent: true },
  { source: "/research-core/CI-CD-Pipelines/:path*", destination: "/research-core/02-platform-cloud/ci-cd-pipelines/:path*", permanent: true },
  { source: "/research-core/Scripting/:path*", destination: "/research-core/02-platform-cloud/scripting/:path*", permanent: true },
  { source: "/research-core/Logging-and-Monitoring/:path*", destination: "/research-core/03-operations-reliability/logging-and-monitoring/:path*", permanent: true },
  { source: "/research-core/SRE-Reliability/:path*", destination: "/research-core/03-operations-reliability/sre-reliability/:path*", permanent: true },
  { source: "/research-core/linux/:path*", destination: "/research-core/03-operations-reliability/linux/:path*", permanent: true },
  { source: "/research-core/Networking/:path*", destination: "/research-core/03-operations-reliability/networking/:path*", permanent: true },
  { source: "/research-core/Database/:path*", destination: "/research-core/03-operations-reliability/database/:path*", permanent: true },
  { source: "/research-core/Communication/:path*", destination: "/research-core/04-collaboration-governance/communication/:path*", permanent: true },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.credly.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.okta.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.icsi.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'medium.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      /* Any path under /npm/ (e.g. simple-icons@11.x)  do not use /npm/simple-icons/** only */
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/npm/**',
      },
      {
        protocol: 'https',
        hostname: 'd3njjcbhbojbot.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'coursera.s3.amazonaws.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "prisma",
      "@neondatabase/serverless",
      "@vercel/blob",
      "undici",
    ],
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Output optimization
  output: 'standalone',
  // Compression
  compress: true,
  // PoweredBy header
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "mermaid": require.resolve("mermaid/dist/mermaid.min.js"),
      };
    }
    // Avoid corrupted vendor-chunks when contentlayer rebuilds during dev (common on Windows)
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Security headers
  async redirects() {
    return researchCoreRedirects;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.github.com https://api.rss2json.com https://pub.orcid.org https://*.vercel.app https://vitals.vercel-insights.com; frame-src 'self' https://vercel.live; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;"
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },
        ],
      },
    ];
  },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

module.exports = withContentlayer(nextConfig);
