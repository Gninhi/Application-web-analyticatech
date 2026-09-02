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

  it("getServiceAccent renvoie 4 couleurs d'accents distinctes et valides pour 01, 02, 03, 04", () => {
    const c1 = getServiceAccent("01");
    const c2 = getServiceAccent("02");
    const c3 = getServiceAccent("03");
    const c4 = getServiceAccent("04");

    expect(c1).toBe("#F26D3D"); // Orange
    expect(c2).toBe("#38BDF8"); // Bleu
    expect(c3).toBe("#10B981"); // Vert
    expect(c4).toBe("#A855F7"); // Violet

    // 4 couleurs toutes différentes
    const uniqueColors = new Set([c1, c2, c3, c4]);
    expect(uniqueColors.size).toBe(4);
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
    expect(getCategoryAccent("ia")).toBe("#F26D3D");
    expect(getCategoryAccent("unknown", "Automatisation")).toBe("#4CAF50");
    expect(getCategoryAccent("unknown", "unknown")).toBe(BRAND_ACCENT);
  });

});
