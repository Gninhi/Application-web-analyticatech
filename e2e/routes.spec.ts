import { test, expect } from "@playwright/test";
import { collectErrors } from "./helpers";

/**
 * Couverture des routes App Router : statut HTTP, h1 unique, titre,
 * absence d'erreurs console, canonical. Les données viennent de la DB
 * réelle (Supabase) avec replis offline — les tests restent verts même
 * en mode résilience.
 */

const STATIC_ROUTES = [
  { path: "/", titleContains: "Analyticatech" },
  { path: "/services", titleContains: "Expertises" },
  { path: "/services/01", titleContains: "RAG" },
  { path: "/solutions", titleContains: "Solutions" },
  { path: "/insights", titleContains: "Insights" },
  { path: "/contact", titleContains: "Contact" },
  { path: "/confidentialite", titleContains: "confidentialit" },
  { path: "/mentions-legales", titleContains: "Mentions" },
  { path: "/a-propos", titleContains: "propos" },
];

for (const route of STATIC_ROUTES) {
  test.describe(`route ${route.path}`, () => {
    test("répond 200 avec un h1 unique et un titre", async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      const title = await page.title();
      expect(title).toContain(route.titleContains);
      expect(title.length).toBeGreaterThan(10);
      await page.waitForTimeout(400);
      expect(errors).toEqual([]);
    });
  });
}

test.describe("métadonnées & canonical", () => {
  test("canonical (URL de prod) + description sur /services", async ({ page }) => {
    await page.goto("/services", { waitUntil: "domcontentloaded" });
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
    expect(canonical).toBe("https://analyticatech.fr/services");
    const description = await page
      .locator("meta[name='description']")
      .getAttribute("content");
    expect((description ?? "").length).toBeGreaterThanOrEqual(50);
  });

  test("open graph présent sur une page de détail", async ({ page }) => {
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    const firstCard = page.locator("article").first();
    await expect(firstCard).toBeVisible();
    await page.waitForTimeout(500);
    await firstCard.click();
    await page.waitForURL(/\/solutions\/[a-z0-9-]+$/, { timeout: 15_000 });

    const ogUrl = await page.locator("meta[property='og:url']").last().getAttribute("content");
    expect(ogUrl).toContain("/solutions/");
    await expect(page.locator("h1")).toHaveCount(1);
  });
});
