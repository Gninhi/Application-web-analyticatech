import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Tests e2e — serveur de test isolé du build de production :
 *  - `NEXT_DIST_DIR=.next-e2e` : build séparé, ne touche pas au build prod (:3001).
 *  - `reuseExistingServer` en local : on relance si l'instance n'est pas déjà up.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        locale: "fr-FR",
        extraHTTPHeaders: { "accept-language": "fr-FR,fr;q=0.9,en;q=0.8" },
      },
    },
  ],
  webServer: {
    command: `NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
