import { defineConfig } from "vitest/config";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "src");
const SERVER_ONLY_STUB = path.resolve(import.meta.dirname, "tests/mocks/server-only.ts");

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: false,
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      "@": SRC,
      // Vitest importe les modules serveur (server-only lève une erreur hors Next).
      "server-only": SERVER_ONLY_STUB,
    },
  },
});
