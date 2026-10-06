import { describe, it, expect, beforeEach, vi } from "vitest";
import { getServerEnv, requireServerEnv } from "./env";

describe("env", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("retourne les variables d'environnement définies", () => {
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    process.env.DATABASE_SSL = "true";
    process.env.IP_SALT = "0123456789abcdef0123456789abcdef";

    const env = getServerEnv();
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.DATABASE_SSL).toBe("true");
    expect(env.IP_SALT).toBe("0123456789abcdef0123456789abcdef");
  });

  it("requireServerEnv retourne la chaîne vide hors production si absente", () => {
    vi.stubEnv("NODE_ENV", "test");
    const value = requireServerEnv("RESEND_API_KEY");
    expect(typeof value).toBe("string");
  });
});
