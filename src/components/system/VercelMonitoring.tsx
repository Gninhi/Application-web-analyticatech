import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

/**
 * Intégration Vercel Speed Insights & Analytics (RUM).
 * Activé uniquement en production Vercel pour éviter les erreurs 404
 * sur les scripts injectés en environnement de test local (Playwright/Node).
 */
export function VercelMonitoring() {
  if (process.env.NODE_ENV !== "production" || !process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
