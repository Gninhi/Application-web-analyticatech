import { describe, it, expect } from "vitest";
import { tint, getServiceAccent, getSolutionAccent, getCategoryAccent } from "./colors";
import { BRAND_ACCENT, SERVICE_ACCENTS, SOLUTION_ACCENTS } from "@/lib/constants/theme-accents";

describe("colors utils", () => {
  it("tint éclaircit correctement une couleur hexadécimale", () => {
    const original = "#000000";
    const lighter = tint(original, 20);
    expect(lighter).toBe("#141414");
  });

  it("tint retourne BRAND_ACCENT si le format hex est invalide", () => {
    expect(tint("invalide", 20)).toBe(BRAND_ACCENT);
  });

  it("getServiceAccent renvoie l'accent unique de la charte pour 01, 02, 03, 04", () => {
    for (const idx of ["01", "02", "03", "04"]) {
      expect(getServiceAccent(idx)).toBe(BRAND_ACCENT);
    }
  });

  it("getServiceAccent renvoie l'accent par défaut pour un service inconnu", () => {
    expect(getServiceAccent("01")).toBe(SERVICE_ACCENTS["01"]);
    expect(getServiceAccent("99")).toBe(SERVICE_ACCENTS["01"]);
  });


  it("getSolutionAccent renvoie l'accent associé à l'ordre", () => {
    expect(getSolutionAccent(1)).toBe(SOLUTION_ACCENTS["1"]);
    expect(getSolutionAccent("2")).toBe(SOLUTION_ACCENTS["2"]);
    expect(getSolutionAccent(99)).toBe(SOLUTION_ACCENTS["1"]);
  });

  it("getCategoryAccent renvoie l'accent par clé ou label", () => {
    expect(getCategoryAccent("ia")).toBe(BRAND_ACCENT);
    expect(getCategoryAccent("unknown", "Automatisation")).toBe(BRAND_ACCENT);
    expect(getCategoryAccent("unknown", "unknown")).toBe(BRAND_ACCENT);
  });

});
