import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy
 *
 * - **Production** : stricte, sans `unsafe-eval`. Compatible avec la
 *   recommandation "niveau bancaire" du projet.
 * - **Développement** : `unsafe-eval` + extension `connect-src`/`frame-src`
 *   sont nécessaires pour React/Turbopack (HMR, DevTools overlay, WebSocket).
 *
 * TODO P1 : migrer vers un CSP nonce-based pour retirer `'unsafe-inline'`
 * côté styles/scripts en production (cf. commentaire dans AUDIT.md §6).
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
]
  .filter(Boolean)
  .join(" ");

const connectSrc = [
  "'self'",
  isDev ? "ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*" : "",
]
  .filter(Boolean)
  .join(" ");

const frameSrc = isDev ? "'self' http://localhost:* http://127.0.0.1:*" : "'none'";

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  `connect-src ${connectSrc}`,
  `frame-src ${frameSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
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
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
