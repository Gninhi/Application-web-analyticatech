import { test, expect } from "@playwright/test";
import { collectErrors } from "./helpers";

/**
 * Section Méthode : un choix manuel amène la phase à l'avant de la sphère
 * (z le plus proche du lecteur) et le défilement automatique continue ensuite.
 */
test("la sphère amène la phase choisie à l'avant et le défilement continue", async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const dock = page.getByRole("tablist", { name: /accès direct aux phases/i });
  await dock.scrollIntoViewIfNeeded();
  // La souris quitte la section pour ne pas mettre le défilement en pause
  await page.mouse.move(5, 5);

  const third = dock.getByRole("tab").nth(2);
  await third.click();
  await page.mouse.move(5, 5);
  await expect(third).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: /^03\./ })).toBeVisible();

  // Après la rotation (~1,6 s), la capsule 03 est la plus proche du lecteur
  await page.waitForTimeout(2200);
  const depths = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-orbit-node]")].map((el) => {
      const m = /translate3d\([^,]+,[^,]+,\s*(-?[\d.]+)px\)/.exec(el.style.transform);
      return { n: el.dataset.orbitNode, z: m ? Number(m[1]) : NaN };
    })
  );
  const front = depths.reduce((a, b) => (b.z > a.z ? b : a));
  expect(front.n).toBe("03");

  // Le choix manuel ne fige pas le cycle : la jauge tourne
  await expect(page.locator(".method-progress-bar").first()).toHaveCSS("animation-play-state", "running");

  // Clavier : flèche droite sur le dock → phase 04
  await dock.getByRole("tab").nth(2).focus();
  await page.keyboard.press("ArrowRight");
  await expect(dock.getByRole("tab").nth(3)).toHaveAttribute("aria-selected", "true");
  await expect(dock.getByRole("tab").nth(3)).toBeFocused();

  expect(errors).toEqual([]);
});
