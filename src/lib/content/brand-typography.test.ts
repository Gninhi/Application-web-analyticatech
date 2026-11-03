import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Charte typographique (design system Analyticatech) : Manrope pour les titres,
 * Inter pour le texte. Aucune autre police web ne doit être chargée.
 */
const ROOT = process.cwd();
const read = (rel: string) => readFileSync(path.join(ROOT, rel), "utf8");

describe("Charte typographique", () => {
  it("le layout ne charge que les fichiers Manrope et Inter du design system", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).not.toContain("next/font/google");
    expect(layout).toMatch(/Manrope-(SemiBold|Bold|ExtraBold)\.woff2/);
    expect(layout).toMatch(/Inter-(Regular|Medium|SemiBold)\.woff2/);
    expect(readdirSync(path.join(ROOT, "src/app/fonts")).sort()).toEqual([
      "Inter-Medium.woff2",
      "Inter-Regular.woff2",
      "Inter-SemiBold.woff2",
      "Manrope-Bold.woff2",
      "Manrope-ExtraBold.woff2",
      "Manrope-SemiBold.woff2",
    ]);
  });

  it("les familles CSS pointent vers Manrope et Inter, étiquettes comprises", () => {
    const css = read("src/app/globals.css");
    expect(css).toContain("--font-display: var(--font-manrope)");
    expect(css).toContain("--font-sans: var(--font-inter)");
    expect(css).toContain("--font-mono: var(--font-inter)");
    expect(css).toContain("font-family: var(--font-inter), system-ui, sans-serif;");
    expect(css).not.toMatch(/space.?grotesk|jetbrains|satoshi/i);
  });
});
