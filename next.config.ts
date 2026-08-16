import type { NextConfig } from "next";

/**
 * Content-Security-Policy — émise dynamiquement par le proxy de sécurité
 * (src/proxy.ts) : nonce par requête pour `script-src`, sans `unsafe-inline`
 * en production. La CSP n'est PAS posée ici pour éviter un double header
 * (les CSP multiples sont intersectées et bloqueraient nos scripts noncés).
 *
 * - Développement : `unsafe-eval` + extension `connect-src`/`frame-src`
 *   nécessaires pour React/Turbopack (HMR, DevTools overlay, WebSocket).
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  // Security headers globaux — appliqués sur TOUTES les routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
