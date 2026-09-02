import { test, expect, type Page } from "@playwright/test";

/**
 * Stabilité au scroll (fix « révélation au montage ») :
 *  1. Après un scroll rapide de haut en bas, toutes les sections LazySection
 *     doivent être montées (`[data-lazy-mounted="false"]` → 0) : aucun
 *     contenu ne peut plus apparaître « en retard ».
 *  2. La hauteur de page (`scrollHeight`) doit rester stable une fois le
 *     chargement réseau terminé : zéro CLS lié au lazy-loading.
 *
 * Note : le site applique `scroll-behavior: smooth` → on scroll en JS avec
 * `behavior: "instant"` pour simuler un défilement rapide déterministe.
 */

const HOME = "/";

async function scrollToInstant(page: Page, y: number) {
  await page.evaluate((top) => {
    document.documentElement.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  }, y);
}

async function countUnmounted(page: Page): Promise<number> {
  return page.locator("[data-lazy-mounted='false']").count();
}

test.describe("stabilité au scroll", () => {
  test("toutes les sections sont montées après un scroll rapide de bout en bout", async ({ page }) => {
    await page.goto(HOME, { waitUntil: "domcontentloaded" });

    const maxY = await page.evaluate(() => document.documentElement.scrollHeight);
    // Scroll rapide : on parcourt toute la page en ~8 bonds.
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await scrollToInstant(page, (maxY / steps) * i);
      await page.waitForTimeout(120);
    }

    // Attendre que les chunks dynamiques + intersections soient résolus.
    await page.waitForFunction(
      () => document.querySelectorAll("[data-lazy-mounted='false']").length === 0,
      undefined,
      { timeout: 15_000 }
    );

    expect(await countUnmounted(page)).toBe(0);
  });

  test("la hauteur de page reste stable après le chargement réseau", async ({ page }) => {
    await page.goto(HOME, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    // Monte tout d'abord les sections hors écran (scroll + retour) pour
    // déclencher les remplacements squelette → contenu.
    const maxY = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await scrollToInstant(page, (maxY / steps) * i);
      await page.waitForTimeout(100);
    }
    await page.waitForFunction(
      () => document.querySelectorAll("[data-lazy-mounted='false']").length === 0,
      undefined,
      { timeout: 15_000 }
    );
    await scrollToInstant(page, 0);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);

    const before = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => document.documentElement.scrollHeight);

    // Tolérance : ±1 px (arrondi de sous-pixel au scroll).
    expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
  });
});


test.describe("stabilité au scroll — mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("toutes les sections sont montées après un scroll rapide", async ({ page }) => {
    await page.goto(HOME, { waitUntil: "domcontentloaded" });

    const maxY = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      await scrollToInstant(page, (maxY / steps) * i);
      await page.waitForTimeout(120);
    }

    await page.waitForFunction(
      () => document.querySelectorAll("[data-lazy-mounted='false']").length === 0,
      undefined,
      { timeout: 15_000 }
    );

    expect(await countUnmounted(page)).toBe(0);
  });
});