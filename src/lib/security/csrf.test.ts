import { describe, it, expect } from "vitest";
import { validateCsrfToken } from "../security/csrf";

describe("CSRF Validation", () => {
  describe("validateCsrfToken", () => {
    it("retourne false si le cookie est manquant", () => {
      expect(validateCsrfToken(null, "token")).toBe(false);
      expect(validateCsrfToken(undefined, "token")).toBe(false);
    });

    it("retourne false si le header est manquant", () => {
      expect(validateCsrfToken("token", null)).toBe(false);
      expect(validateCsrfToken("token", undefined)).toBe(false);
    });

    it("retourne false si les longueurs diffèrent", () => {
      expect(validateCsrfToken("short", "longerenough")).toBe(false);
    });

    it("retourne true pour des tokens identiques", () => {
      const token = "this-is-a-test-token-12345";
      expect(validateCsrfToken(token, token)).toBe(true);
    });

    it("retourne false pour des tokens différents męme de męme longueur", () => {
      expect(validateCsrfToken("token-a", "token-b")).toBe(false);
    });
  });
});