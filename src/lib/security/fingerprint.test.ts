import { beforeEach, describe, it, expect } from "vitest";
import { getRequestFingerprint } from "../security/fingerprint";

// On définit le sel IP directement en environnement pour le test
// (on modifie process.env plutôt que de mocker le module)
beforeEach(() => {
  process.env.IP_SALT = "test-salt-16chars";
  (process.env as Record<string, string>).NODE_ENV = "development";
});

describe("Request Fingerprint", () => {
  describe("getRequestFingerprint", () => {
    it("devrait hacher IP + sel de façon déterministe", () => {
      const req = new Request("http://example.com", {
        headers: { "x-forwarded-for": "203.0.113.42" },
      });
      const fp1 = getRequestFingerprint(req);
      const fp2 = getRequestFingerprint(req);
      expect(fp1).toBe(fp2);
      expect(fp1).toMatch(/^[0-9a-f]{16}$/);
    });

    it("devrait changer si l'IP change", () => {
      const req1 = new Request("http://example.com", {
        headers: { "x-forwarded-for": "1.2.3.4" },
      });
      const req2 = new Request("http://example.com", {
        headers: { "x-forwarded-for": "5.6.7.8" },
      });
      const fp1 = getRequestFingerprint(req1);
      const fp2 = getRequestFingerprint(req2);
      expect(fp1).not.toBe(fp2);
    });
  });
});