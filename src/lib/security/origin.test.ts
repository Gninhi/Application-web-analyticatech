import { describe, expect, it } from "vitest";
import { isOriginAllowed } from "@/lib/security/origin";

describe("origin validation - isOriginAllowed", () => {
  const allowed = ["https://analyticatech.fr", "http://localhost:3000"];

  it("autorise les requêtes avec Origin valide dans l'allowlist", () => {
    const req = new Request("https://analyticatech.fr/api/v1/contact", {
      headers: { Origin: "https://analyticatech.fr" },
    });
    expect(isOriginAllowed(req, allowed)).toBe(true);
  });

  it("autorise les requêtes avec Referer valide si Origin est absent", () => {
    const req = new Request("https://analyticatech.fr/api/v1/contact", {
      headers: { Referer: "https://analyticatech.fr/contact" },
    });
    expect(isOriginAllowed(req, allowed)).toBe(true);
  });

  it("rejette les origines malveillantes ou non autorisées", () => {
    const req = new Request("https://analyticatech.fr/api/v1/contact", {
      headers: { Origin: "https://malicious-site.com" },
    });
    expect(isOriginAllowed(req, allowed)).toBe(false);
  });

  it("rejette les requêtes avec ports différents non déclarés", () => {
    const req = new Request("https://analyticatech.fr/api/v1/contact", {
      headers: { Origin: "http://localhost:8080" },
    });
    expect(isOriginAllowed(req, allowed)).toBe(false);
  });

  it("rejette les requêtes sans Origin ni Referer", () => {
    const req = new Request("https://analyticatech.fr/api/v1/contact");
    expect(isOriginAllowed(req, allowed)).toBe(false);
  });
});
