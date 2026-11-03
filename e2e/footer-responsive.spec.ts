import { test, expect } from "@playwright/test";

/**
 * Pied de page : aucun débordement horizontal et cibles tactiles ≥ 44 px
 * (mobile), du petit téléphone à l'écran large.
 */
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`footer adapté à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact", { waitUntil: "networkidle" });
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    const report = await footer.evaluate((f) => {
      const vw = window.innerWidth;
      const overflow = [...f.querySelectorAll("*")]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width > 0 && (r.right > vw + 1 || r.left < -1)).length;
      const smallTargets =
        vw < 640
          ? [...f.querySelectorAll("a, button")]
              .map((e) => e.getBoundingClientRect())
              .filter((r) => r.width > 0 && r.height < 44).length
          : 0;
      return { overflow, smallTargets, pageOverflow: document.documentElement.scrollWidth > vw };
    });

    expect(report).toEqual({ overflow: 0, smallTargets: 0, pageOverflow: false });
    await expect(footer.getByRole("link", { name: /prendre rendez-vous/i }).first()).toBeVisible();
    await expect(footer.getByRole("img", { name: "Analyticatech" }).first()).toBeAttached();
  });
}

test("le changement de langue recharge la page dans l'autre langue", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /passer en anglais/i }).first().click();
  await page.waitForURL("**/en/contact");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: /book a call/i }).first()).toBeVisible();
});
