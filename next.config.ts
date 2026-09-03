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
  // Vercel n'utilise PAS `output: "standalone"` (il passe par son propre
  // adaptateur). Le laisser activé sur Vercel casse le build Next 16.3+
  // (ENOENT .next/next-server.js.nft.json, vercel/next.js#96646).
  // Standalone reste utile pour Docker / auto-hébergement → activé hors Vercel.
  output: process.env.VERCEL ? undefined : "standalone",
  // Dossier de build isolé pour les tests e2e (ne touche pas au build prod).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  turbopack: {
    root: __dirname,
  },
  // Prisma est auto-opté-out par Next, mais on le déclare explicitement pour
  // garantir que le client + moteur (binaryTargets rhel-openssl-3.0.x) sont
  // chargés nativement par Node et tracés dans le bundle serveur Vercel.
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Fichiers non-importés par le code à inclure dans le traçage standalone
  // (Docker / auto-hébergement) : la CA racine Supabase lue par db/client.ts.
  outputFileTracingIncludes: {
    "/**": ["src/lib/db/supabase-ca-2021.crt"],
  },
  // Configuration optimisée pour images modernes (AVIF + WebP)
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  // Compression Brotli / Gzip active au niveau serveur Next.js
  compress: true,
  // Reverse proxy pour PostHog EU (contourne les bloqueurs tout en restant discret)
  async rewrites() {
    return [
      {
        source: "/_edge-relay/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/_edge-relay/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/_edge-relay/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // Security & Cache headers globaux
  async headers() {
    return [
      {
        source: "/services/:all*(webp|png|jpg|jpeg|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/screenshots/:all*(webp|png|jpg|jpeg|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:file(logo\\.svg|og-image\\.jpg|og-image\\.png|llms\\.txt|favicon\\.ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
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
