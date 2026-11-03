import { test, expect, type Page } from "@playwright/test";

/**
 * La molette fait toujours défiler la page, même quand la souris est sur une carte
 * (régression : la zone de texte des cartes Solutions captait la molette en bureau).
 */

async function wheelOver(page: Page, selector: string) {
  const box = await page.locator(selector).first().boundingBox();
  expect(box).not.toBeNull();
  if (!box) return 0;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.6);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(500);
  return (await page.evaluate(() => window.scrollY)) - before;
}

test.describe("défilement à la molette au-dessus des cartes", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("/solutions : la page défile avec la souris sur une carte", async ({ page }) => {
    await page.goto("/solutions", { waitUntil: "load" });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const pin = document.getElementById("solutions-pinned-showcase");
      document.documentElement.scrollTo({ top: (pin?.offsetTop ?? 0) + 100, behavior: "instant" as ScrollBehavior });
    });
    await page.waitForTimeout(300);
    expect(await wheelOver(page, "[data-solution-card]")).toBeGreaterThan(200);
  });

  test("/insights : la page défile avec la souris sur un article", async ({ page }) => {
    await page.goto("/insights", { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.documentElement.scrollTo({ top: 600, behavior: "instant" as ScrollBehavior }));
    await page.waitForTimeout(300);
    expect(await wheelOver(page, "#blog-results li a")).toBeGreaterThan(200);
  });
});
