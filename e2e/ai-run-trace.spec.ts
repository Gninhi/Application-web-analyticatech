import { test, expect } from "@playwright/test";
import { collectErrors } from "./helpers";

/**
 * Section 05 : la demande est traitée étape par étape, s'arrête à la
 * validation humaine, puis se termine après le clic du visiteur.
 */
test("la trace s'arrête à la validation et reprend après l'accord", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });
  const trace = page.locator("#ai-run-trace");
  await trace.scrollIntoViewIfNeeded();

  const steps = trace.locator("li[data-status]");
  await expect(steps.nth(2)).toHaveAttribute("data-status", "waiting", { timeout: 10_000 });
  await expect(steps.nth(3)).toHaveAttribute("data-status", "next");

  await page.getByRole("button", { name: /valider l'action/i }).click();
  await expect(steps.nth(3)).toHaveAttribute("data-status", "done", { timeout: 6_000 });
  await expect(trace).toContainText("Validée par vous");

  // Autre exemple : la question et la trace changent
  await page.getByRole("tab", { name: "Documents" }).click();
  await expect(page.getByText("Que prévoit le contrat fournisseur en cas de retard de livraison ?")).toBeVisible();
  await expect(steps.nth(0)).toHaveAttribute("data-status", /running|done/);

  expect(errors).toEqual([]);
});
