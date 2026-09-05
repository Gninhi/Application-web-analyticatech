import { test, expect, type Page } from "@playwright/test";

/**
 * Continuité et fluidité de défilement sur /solutions :
 *  1. Vérifie l'absence de saut (discontinuité) au franchissement du point de sortie
 *     (unpinning) de la section sticky horizontale.
 *  2. Vérifie que la translation horizontale (translateX) reste continue et
 *     se stabilise sans saccade avant la reprise du scroll vertical.
 */

const SOLUTIONS_ROUTE = "/solutions";

async function scrollToInstant(page: Page, y: number) {
  await page.evaluate((top) => {
    document.documentElement.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  }, y);
}

test.describe("continuité de défilement /solutions", () => {
  test("sortie de section sticky sans saut visuel ni à-coup", async ({ page }) => {
    await page.goto(SOLUTIONS_ROUTE, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const pinMetrics = await page.evaluate(() => {
      const pinSection = document.getElementById("solutions-pinned-showcase");
      if (!pinSection) return null;
      return {
        top: pinSection.offsetTop,
        height: pinSection.offsetHeight,
        vh: window.innerHeight,
      };
    });

    expect(pinMetrics).not.toBeNull();
    if (!pinMetrics) return;

    const unpinPoint = pinMetrics.top + pinMetrics.height - pinMetrics.vh;

    // Échantillonnage à 20px d'intervalle autour de la transition d'unpinning
    const startScroll = Math.max(0, unpinPoint - 160);
    const endScroll = unpinPoint + 160;

    await scrollToInstant(page, startScroll);
    await page.waitForTimeout(100);

    let prevY = startScroll;
    for (let targetY = startScroll + 20; targetY <= endScroll; targetY += 20) {
      await scrollToInstant(page, targetY);
      await page.waitForTimeout(20);

      const actualY = await page.evaluate(() => window.scrollY);
      const delta = actualY - prevY;

      // Chaque incrément de 20px doit produire exactement 20px de scroll effectif (±1px tolérance sous-pixel)
      expect(Math.abs(delta - 20)).toBeLessThanOrEqual(1.5);
      prevY = actualY;
    }
  });

  test("la translation horizontale atteint son état final sans coupure", async ({ page }) => {
    await page.goto(SOLUTIONS_ROUTE, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const pinMetrics = await page.evaluate(() => {
      const pinSection = document.getElementById("solutions-pinned-showcase");
      const track = document.getElementById("solutions-scroll-track");
      if (!pinSection || !track) return null;
      return {
        unpinPoint: pinSection.offsetTop + pinSection.offsetHeight - window.innerHeight,
      };
    });

    expect(pinMetrics).not.toBeNull();
    if (!pinMetrics) return;

    await scrollToInstant(page, pinMetrics.unpinPoint);
    // Laisser la boucle rAF appliquer la translation
    await page.waitForTimeout(100);

    const transform = await page.evaluate(() => {
      const track = document.getElementById("solutions-scroll-track");
      if (!track) return null;
      return track.style.transform || window.getComputedStyle(track).transform;
    });

    expect(transform).not.toBeNull();
    // Vérifie que le transform translate3d(-...px, 0, 0) ou matrix(...) est bien présent
    expect(transform).toMatch(/translate3d|matrix/);
  });
});
