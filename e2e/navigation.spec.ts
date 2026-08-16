import { test, expect, type Page } from "@playwright/test";

/**
 * Navigation réelle (App Router) : liens `<a>`, transitions client-side,
 * état actif du menu, panel mobile, skip-link, 404 et CSP nonce.
 */

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("navigation desktop", () => {
  test("les liens du menu sont de vraies balises <a>", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hrefs = await page.locator("nav a").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    const clean = hrefs.filter((h): h is string => Boolean(h));
    expect(clean.length).toBeGreaterThanOrEqual(4);
    expect(clean).toContain("/solutions");
    expect(clean).toContain("/insights");
    expect(clean).toContain("/contact");
  });

  test("navigation client-side vers /solutions + aria-current + focus main", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    await page.locator("nav a", { hasText: "Solutions" }).first().click();
    await page.waitForURL("**/solutions", { timeout: 15_000 });
    await page.waitForFunction(() => document.activeElement?.id === "main-content", undefined, { timeout: 10_000 });

    const activeCount = await page.locator("nav a[aria-current='page']").count();
    expect(activeCount).toBeGreaterThanOrEqual(1);

    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe("main-content");
    expect(errors).toEqual([]);
  });

  test("le logo ramène à l'accueil", async ({ page }) => {
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    const logo = page.locator("header a[href='/']").first();
    await expect(logo).toBeVisible();
    await logo.click();
    await page.waitForURL("**/", { timeout: 15_000 });
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test.describe("panel mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("ouvre, navigue et referme le menu", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    await page.locator("button[aria-label*='Ouvrir']").click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    const linkCount = await page.locator("#mobile-menu a").count();
    expect(linkCount).toBeGreaterThanOrEqual(4);

    await page.locator("#mobile-menu a", { hasText: "Insights" }).first().click();
    await page.waitForURL("**/insights", { timeout: 15_000 });
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("Escape ferme le panel et rend le focus à l'ouvreur", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    await page.locator("button[aria-label*='Ouvrir']").click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    const inPanel = await page.evaluate(() => document.activeElement?.closest("#mobile-menu") !== null);
    expect(inPanel).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    const opener = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? (el.getAttribute("aria-label") || "").includes("Ouvrir") : false;
    });
    expect(opener).toBe(true);
  });
});

test.describe("accessibilité", () => {
  test("skip-link amène le focus sur le contenu", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    const skip = await page.evaluate(() => {
      const el = document.activeElement;
      return el && (el.textContent || "").trim().startsWith("Aller au contenu") ? el : null;
    });
    expect(skip).not.toBeNull();

    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.activeElement?.id === "main-content", undefined, { timeout: 10_000 });
    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe("main-content");
  });

  test("au moins un h1 sur chaque page secondaire", async ({ page }) => {
    for (const path of ["/services", "/solutions", "/insights", "/contact"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
});

test.describe("erreurs & sécurité", () => {
  test("404 sur une solution inconnue", async ({ page }) => {
    // Le navigateur log un erreur réseau « 404 » sur la ressource — comportement
    // attendu d'une page 404 ; on ne teste donc ici que le statut + rendu propre.
    const response = await page.goto("/solutions/slug-inexistant", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("404 sur un article inconnu", async ({ page }) => {
    const response = await page.goto("/insights/inexistant", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("CSP : script-src nonce-based sur /services", async ({ page }) => {
    const response = await page.goto("/services", { waitUntil: "domcontentloaded" });
    const header = response?.headers()["content-security-policy"] ?? "";
    expect(header).toContain("nonce-");

    // Le nonce ne concerne que script-src ; style-src conserve 'unsafe-inline'
    // (styles inline framer-motion / Next) — on vérifie la directive précise.
    const scriptSrc = header
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("script-src"));
    expect(scriptSrc).toBeTruthy();
    expect(scriptSrc).toContain("'nonce-");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'self'");

    // Les JSON-LD (type="application/ld+json") sont des données non exécutables,
    // non soumises à script-src : on vérifie uniquement les scripts JS inline.
    const unscaped = await page
      .locator("script:not([src])")
      .evaluateAll((els) =>
        els.filter((e) => {
          const type = (e.getAttribute("type") || "").toLowerCase();
          const isExecutable = !type || type === "module" || type === "text/javascript";
          return isExecutable && !e.hasAttribute("nonce");
        }).length
      );
    expect(unscaped).toBe(0);
  });

  test("clic sur une carte solution → URL de détail, retour navigateur OK", async ({ page }) => {
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    const firstCard = page.locator("article").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await page.waitForURL(/\/solutions\/[a-z0-9-]+$/, { timeout: 15_000 });
    await expect(page.locator("h1")).toHaveCount(1);

    await page.goBack();
    await page.waitForURL("**/solutions", { timeout: 15_000 });
    await expect(page.locator("h1")).toHaveCount(1);
  });
});