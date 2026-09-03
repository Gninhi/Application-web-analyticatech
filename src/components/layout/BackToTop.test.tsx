import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BackToTop } from "@/components/layout/BackToTop";
import { I18nProvider } from "@/lib/i18n/provider";

function renderBackToTop(locale: "fr" | "en" = "fr") {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <BackToTop />
    </I18nProvider>
  );
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("BackToTop Component", () => {
  it("rend le bouton avec son anneau SVG circulaire de progression", () => {
    const html = renderBackToTop("fr");

    // Présence du SVG de progression circulaire
    expect(html).toContain('<svg class="absolute inset-0 h-full w-full -rotate-90 pointer-events-none" viewBox="0 0 48 48"');
    // Vérification des cercles de progression
    expect(html).toContain('stroke-width="2.5"');
    expect(html).toContain('class="stroke-[#F26D3D]');
  });

  it("intègre le bouton accessible et son aria-label traduit en français", () => {
    const html = renderBackToTop("fr");

    expect(html).toContain('aria-label="Retour en haut de page');
    expect(html).toContain('title="Retour en haut de page');
    expect(html).toContain('type="button"');
  });

  it("supporte l'internationalisation en anglais", () => {
    const html = renderBackToTop("en");

    expect(html).toContain('aria-label="Back to top of page');
    expect(html).toContain('title="Back to top of page');
    expect(html).toContain("Back to top of page");
  });

  it("comporte le tooltip de pourcentage au hover", () => {
    const html = renderBackToTop("fr");

    expect(html).toContain('role="tooltip"');
    expect(html).toContain("0%");
  });

  it("utilise les tokens de design (accent #F26D3D, backdrop-blur)", () => {
    const html = renderBackToTop("fr");

    expect(html).toContain("#F26D3D");
    expect(html).toContain("backdrop-blur-md");
    expect(html).toContain("rounded-full");
  });
});
