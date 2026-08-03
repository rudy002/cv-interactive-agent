import type { NextConfig } from "next";

/**
 * Baseline hardening for a public site. No CSP here on purpose: next-themes and
 * the Next runtime both inject inline scripts, so a strict policy needs nonces
 * and deserves a deliberate pass rather than a drive-by one.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The chat endpoint must never be cached by a CDN or a browser. Scoped to
      // /api/chat on purpose: /api/knowledge sets its own caching policy and a
      // blanket no-store here would silently override it.
      {
        source: "/api/chat",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
