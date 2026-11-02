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

describe("LanguageToggle — bouton texte FR / EN", () => {
  beforeEach(() => {
    currentMockPathname = "/";
  });

  it("utilise le format rond h-10 w-10 aligné sur le ThemeToggle", () => {
    const html = renderLanguageToggle("fr");
    expect(html).toContain("h-10 w-10");
    expect(html).not.toContain("⇄ EN");
  });

  it("affiche FR et les attributs d'accessibilité lorsque la langue active est FR", () => {
    currentMockPathname = "/services";
    const html = renderLanguageToggle("fr");
    expect(html).toContain(">FR<");
    expect(html).toContain('aria-label="Langue actuelle : Français. Cliquer pour passer en anglais."');
    expect(html).toContain('title="Passer en anglais (Switch to English)"');
  });

  it("affiche EN et les attributs d'accessibilité lorsque la langue active est EN", () => {
    currentMockPathname = "/en/services";
    const html = renderLanguageToggle("en");
    expect(html).toContain(">EN<");
    expect(html).toContain('aria-label="Current language: English. Click to switch to French."');
    expect(html).toContain('title="Switch to French (Passer en français)"');
  });

  it("respecte la charte : pas de faisceau animé, pas de drapeau", () => {
    const html = renderLanguageToggle("fr");
    expect(html).not.toContain("aspect-square");
    expect(html).not.toContain("#002654");
  });
});
