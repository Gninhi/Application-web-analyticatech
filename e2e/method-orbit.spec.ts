import { test, expect, type Page } from "@playwright/test";
import { collectErrors } from "./helpers";

/**
 * Section Méthode : les capsules gravitent en continu, chacune sur son orbite ;
 * les phases passent à l'avant dans l'ordre 01 → 04 et la phase à l'avant est
 * la phase affichée. Un choix manuel fait tourner la sphère, puis le cycle reprend.
 */

async function capsuleState(page: Page) {
  return page.evaluate(() => {
    const els = [...document.querySelectorAll("[data-orbit-node] button")];
    const boxes = els.map((e) => e.getBoundingClientRect());
    let overlaps = 0;
    boxes.forEach((a, i) =>
      boxes.slice(i + 1).forEach((b) => {
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) overlaps++;
      })
    );
    return { overlaps, positions: boxes.map((b) => `${Math.round(b.left)},${Math.round(b.top)}`).join("|") };
  });
}

test("rotation continue, ordre 01 → 04, choix manuel puis reprise du cycle", async ({ page }) => {
  test.setTimeout(90_000);
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const dock = page.getByRole("tablist", { name: /accès direct aux phases/i });
  await dock.scrollIntoViewIfNeeded();
  await page.mouse.move(5, 5); // la souris hors de la section : pas de pause au survol
  const tabs = dock.getByRole("tab");

  // Les capsules gravitent en continu, sans superposition
  const first = await capsuleState(page);
  await page.waitForTimeout(1500);
  const second = await capsuleState(page);
  expect(second.positions).not.toBe(first.positions);
  expect(first.overlaps + second.overlaps).toBe(0);

  // Choix manuel de la phase 03 : elle est affichée, le titre apparaît dans le dock
  await tabs.nth(2).click();
  await page.mouse.move(5, 5);
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(2)).toContainText("Industrialisation");
  await expect(page.getByRole("heading", { name: /^03\./ })).toBeVisible();

  // Le cycle reprend tout seul, dans l'ordre : 03 → 04
  // Marge large : la rotation ralentit si la machine de test est saturée (pas de saut de frame)
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true", { timeout: 45_000 });
  expect((await capsuleState(page)).overlaps).toBe(0);

  // Clavier : flèche gauche sur le dock → phase 03, le focus suit
  await tabs.nth(3).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(2)).toBeFocused();

  expect(errors).toEqual([]);
});
