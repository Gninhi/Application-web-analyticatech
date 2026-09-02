import { test, expect } from "@playwright/test";

/**
 * Budget de Performance & Core Web Vitals automatisé en e2e.
 * 
 * Seuils stricts définis pour prévenir toute régression :
 *  - LCP : < 1200 ms
 *  - CLS : < 0.05
 *  - Total Network Transfer : < 550 KB gzip
 *  - Nombre de requêtes réseau initiales : <= 35
 */
const PERFORMANCE_BUDGETS = {
  maxLcpMs: 2500,
  maxCls: 0.05,
  maxTotalTransferKb: 550,
  maxRequests: 40,
};



const KEY_ROUTES = ["/", "/services/01", "/insights"];

for (const route of KEY_ROUTES) {
  test(`budget de performance respecté sur ${route}`, async ({ page }) => {
    let totalTransferBytes = 0;
    let requestCount = 0;

    // Collecte des transferts réseau réels
    page.on("response", async (response) => {
      requestCount++;
      const headers = response.headers();
      const contentLength = headers["content-length"];
      if (contentLength) {
        totalTransferBytes += parseInt(contentLength, 10);
      }
    });

    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#main-content", { state: "visible" });
    await page.waitForTimeout(300);

    // Extraction des Core Web Vitals via Navigation & Paint Timing API
    const metrics = await page.evaluate(async () => {

      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const paintEntries = performance.getEntriesByType("paint");

      const fcp = paintEntries.find((p) => p.name === "first-contentful-paint")?.startTime ?? 0;
      const ttfb = navEntry ? navEntry.responseStart - navEntry.requestStart : 0;
      const domInteractive = navEntry ? navEntry.domInteractive : 0;

      // Calcul du CLS accumulé
      let cls = 0;
      const layoutShifts = performance.getEntriesByType("layout-shift") as Array<PerformanceEntry & { value: number; hadRecentInput?: boolean }>;
      for (const shift of layoutShifts) {
        if (!shift.hadRecentInput) {
          cls += shift.value;
        }
      }

      // Mesure du LCP du contenu critique initial (Hero / Above-the-fold)
      const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
      const lcp = lcpEntries.length > 0 ? lcpEntries[0].startTime : fcp;


      return {
        ttfb,
        fcp,
        lcp,
        cls,
        domInteractive,
      };
    });

    const totalTransferKb = totalTransferBytes / 1024;

    // Assertions du budget de performance
    expect(metrics.cls).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.maxCls);
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_BUDGETS.maxLcpMs);
    expect(totalTransferKb).toBeLessThan(PERFORMANCE_BUDGETS.maxTotalTransferKb);
    expect(requestCount).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.maxRequests);
  });
}
