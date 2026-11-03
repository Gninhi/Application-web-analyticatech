import { test, expect } from "@playwright/test";
import { collectErrors } from "./helpers";

/**
 * Section Services de l'accueil : une pilule n'affiche que son service (pleine
 * largeur), « Tous les piliers » rétablit les quatre cartes.
 */
test("les pilules filtrent les cartes de services", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });

  const panel = page.locator("#home-services-panel");
  const tabs = page.getByRole("tablist", { name: /services/i }).getByRole("tab");
  await panel.scrollIntoViewIfNeeded();
  await expect(panel.locator(":scope > div")).toHaveCount(4);
  await expect(tabs).toHaveCount(5);

  // Deuxième pilule = premier service : une seule carte, en pleine largeur
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(panel.locator(":scope > div")).toHaveCount(1);
  await expect(panel.locator(":scope > div").first()).toHaveClass(/col-span-12/);
  await expect(panel.locator(":scope > div").first()).not.toHaveClass(/lg:col-span-/);

  // Autre service : la carte affichée change
  const firstTitle = await panel.locator("h3").first().textContent();
  await tabs.nth(2).click();
  await expect(panel.locator(":scope > div")).toHaveCount(1);
  await expect(panel.locator("h3").first()).not.toHaveText(firstTitle ?? "");

  // Re-cliquer la pilule active ou « Tous » rétablit la grille
  await tabs.nth(2).click();
  await expect(panel.locator(":scope > div")).toHaveCount(4);
  await tabs.nth(3).click();
  await tabs.first().click();
  await expect(panel.locator(":scope > div")).toHaveCount(4);
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

  expect(errors).toEqual([]);
});
