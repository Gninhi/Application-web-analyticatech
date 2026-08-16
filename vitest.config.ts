import { defineConfig } from "vitest/config";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "src");

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": SRC,
    },
  },
});
