import createMDX from "@next/mdx";
import { securityHeaders } from "./lib/security-headers.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  env: {
    // Shown in the footer deploy stamp and on /colophon.
    BUILD_TIME: new Date().toISOString(),
  },
  experimental: {
    // TypeScript 7 has no JS compiler API; type-check with the project's tsc instead.
    useTypeScriptCli: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.credly.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/research", destination: "/research-core", permanent: true },
      { source: "/canvas", destination: "/codecanvas", permanent: true },
      { source: "/writing", destination: "/blog", permanent: true },
      { source: "/writing/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/security.txt", destination: "/.well-known/security.txt", permanent: true },
    ];
  },
};

// Plugins are passed by name so the config stays serializable for Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm"]],
    // Build-time syntax highlighting: zero client JavaScript, light and dark themes via CSS variables.
    rehypePlugins: [["rehype-pretty-code", { theme: { light: "github-light", dark: "github-dark-dimmed" }, keepBackground: false }]],
  },
});

export default withMDX(nextConfig);
