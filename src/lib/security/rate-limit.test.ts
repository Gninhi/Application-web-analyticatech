import { beforeEach, describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp, _resetRateLimitBucketsForTest } from "../security/rate-limit";

describe("RateLimiter", () => {
  beforeEach(() => {
    // Remise à zéro propre de la mémoire tampon avant chaque test
    _resetRateLimitBucketsForTest();
  });

  describe("checkRateLimit", () => {
    it("devrait permettre la première requête", () => {
      const config = { limit: 10, windowMs: 60_000 };
      const result = checkRateLimit("test-identifier", config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      expect(result.resetAt).toBeGreaterThan(Date.now());
    });

    it("devrait bloquer quand la limite est atteinte", () => {
      const config = { limit: 3, windowMs: 60_000 };
      checkRateLimit("identifiant-bloque", config);
      checkRateLimit("identifiant-bloque", config);
      checkRateLimit("identifiant-bloque", config);
      const result = checkRateLimit("identifiant-bloque", config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("devrait réinitialiser le compteur après la fenêtre", () => {
      const config = { limit: 2, windowMs: 1 };
      checkRateLimit("reset-test", config);
      checkRateLimit("reset-test", config);
    });
  });

  describe("getClientIp", () => {
    it("devrait extraire l'IP du header x-forwarded-for", () => {
      const req = new Request("http://example.com", {
        headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
      });
      expect(getClientIp(req)).toBe("203.0.113.5");
    });

    it("devrait tomber back sur x-real-ip", () => {
      const req = new Request("http://example.com", {
        headers: { "x-real-ip": "198.51.100.22" },
      });
      expect(getClientIp(req)).toBe("198.51.100.22");
    });

    it("devrait utiliser cf-connecting-ip comme dernier recours", () => {
      const req = new Request("http://example.com", {
        headers: { "cf-connecting-ip": "192.0.2.1" },
      });
      expect(getClientIp(req)).toBe("192.0.2.1");
    });

    it("devrait retourner 'unknown' si aucun header n'est présent", () => {
      const req = new Request("http://example.com", { headers: {} });
      expect(getClientIp(req)).toBe("unknown");
    });
  });
});