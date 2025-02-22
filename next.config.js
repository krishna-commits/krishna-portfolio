// import { sql } from '@vercel/postgres';

// const nextConfig = {
//   experimental: {
//     ppr: true,
//   },
//   async redirects() {
//     if (!process.env.POSTGRES_URL) {
//       return [];
//     }

//     const { rows: redirects } = await sql`
//       SELECT source, destination, permanent
//       FROM redirects;
//     `;

//     return redirects.map(({ source, destination, permanent }) => ({
//       source,
//       destination,
//       permanent: !!permanent,
//     }));
//   },
//   headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: securityHeaders,
//       },
//     ];
//   },
// };

// const ContentSecurityPolicy = `
//     default-src 'self' vercel.live;
//     script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live va.vercel-scripts.com;
//     style-src 'self' 'unsafe-inline';
//     img-src * blob: data:;
//     media-src 'none';
//     connect-src *;
//     font-src 'self' data:;
// `;

// const securityHeaders = [
//   {
//     key: 'Content-Security-Policy',
//     value: ContentSecurityPolicy.replace(/\n/g, ''),
//   },
//   {
//     key: 'Referrer-Policy',
//     value: 'origin-when-cross-origin',
//   },
//   {
//     key: 'X-Frame-Options',
//     value: 'DENY',
//   },
//   {
//     key: 'X-Content-Type-Options',
//     value: 'nosniff',
//   },
//   {
//     key: 'X-DNS-Prefetch-Control',
//     value: 'on',
//   },
//   {
//     key: 'Strict-Transport-Security',
//     value: 'max-age=31536000; includeSubDomains; preload',
//   },
//   {
//     key: 'Permissions-Policy',
//     value: 'camera=(), microphone=(), geolocation=()',
//   },
// ];

// export default nextConfig;







// import { withContentlayer } from "next-contentlayer";
 
// /** @type {import('next').NextConfig} */
// export default withContentlayer({
//   reactStrictMode: true,
// });





// import { createContentlayerPlugin } from "next-contentlayer"
const { createContentlayerPlugin } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"],
  },
  experimental: {
    // appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "mermaid": require.resolve("mermaid/dist/mermaid.min.js"),
      };
    }
    return config;
  },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

// export default withContentlayer(nextConfig)
module.exports = withContentlayer(nextConfig);