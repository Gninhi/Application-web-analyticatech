import type { Page } from "@playwright/test";

/**
 * Collecte les erreurs console et les erreurs de page (pageerror)
 * pendant la durée d'un test Playwright. À appeler au début du test,
 * puis à asserte comme `expect(errors).toEqual([])` à la fin.
 */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}
