import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageToggle } from "@/components/branding/LanguageToggle";
import { I18nProvider } from "@/lib/i18n/provider";

// Mocks next/navigation
let currentMockPathname = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => currentMockPathname,
}));

function renderLanguageToggle(locale: "fr" | "en" = "fr") {
  return renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <LanguageToggle />
    </I18nProvider>
  );
}

describe("LanguageToggle — Bouton compact format ThemeToggle avec drapeau de la langue sélectionnée", () => {
  beforeEach(() => {
    currentMockPathname = "/";
  });

  it("utilise le format compact h-9 w-9 identique au ThemeToggle pour un affichage optimal sur mobile", () => {
    const html = renderLanguageToggle("fr");
    expect(html).toContain("h-9 w-9");
    // Ne doit plus contenir les anciens textes encombrants
    expect(html).not.toContain("⇄ EN");
    expect(html).not.toContain("⇄ FR");
  });

  it("affiche le drapeau français et les attributs d'accessibilité lorsque la langue active est FR", () => {
    currentMockPathname = "/services";
    const html = renderLanguageToggle("fr");

    // Présence des couleurs du drapeau français (#002654, #FFFFFF, #CE1126)
    expect(html).toContain("#002654");
    expect(html).toContain("#FFFFFF");
    expect(html).toContain("#CE1126");

    // Attributs d'accessibilité
    expect(html).toContain('aria-label="Langue actuelle : Français. Cliquer pour passer en anglais."');
    expect(html).toContain('title="Passer en anglais (Switch to English)"');
  });

  it("affiche le drapeau britannique et les attributs d'accessibilité lorsque la langue active est EN", () => {
    currentMockPathname = "/en/services";
    const html = renderLanguageToggle("en");

    // Présence des éléments du drapeau britannique (#012169, #C8102E)
    expect(html).toContain("#012169");
    expect(html).toContain("#C8102E");
    expect(html).toContain("at-uk-flag-clip");

    // Attributs d'accessibilité
    expect(html).toContain('aria-label="Current language: English. Click to switch to French."');
    expect(html).toContain('title="Switch to French (Passer en français)"');
  });
});
