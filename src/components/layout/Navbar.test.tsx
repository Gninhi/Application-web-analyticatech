import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Navbar } from "@/components/layout/Navbar";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { FALLBACK_SITE_CONFIG, FALLBACK_SEO_METADATA } from "@/lib/content/fallbacks";
import type { AppContentDTO } from "@/types/content";

// Mocks next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
}));

function createMockContent(): AppContentDTO {
  return {
    locale: "fr",
    siteConfig: FALLBACK_SITE_CONFIG,
    navItems: [
      { id: "1", label: "Accueil", viewKey: "home", hint: "00", order: 0 },
      { id: "2", label: "Services", viewKey: "services", hint: "01", order: 1 },
      { id: "3", label: "Solutions", viewKey: "solutions", hint: "02", order: 2 },
      { id: "4", label: "Insights", viewKey: "blog", hint: "03", order: 3 },
      { id: "5", label: "Contact", viewKey: "contact", hint: "04", order: 4 },
    ],
    metrics: [],
    clientLogos: [],
    services: [],
    solutions: [],
    blogCategories: [],
    blogPosts: [],
    capabilities: [],
    testimonials: [],
    marqueeKeywords: [],
    activityLogs: [],
    companyValues: [],
    deliverySteps: [],
    rgpdSections: [],
    legalSections: [],
    seoMetadata: FALLBACK_SEO_METADATA,
    seoSchemas: [],
  };
}

function renderNavbar(content = createMockContent()) {
  return renderToStaticMarkup(
    <I18nProvider initialLocale="fr">
      <ContentProvider content={content}>
        <Navbar />
      </ContentProvider>
    </I18nProvider>
  );
}

describe("Navbar — Header Capsule Premium", () => {
  it("rend le logo avec distinction d'accentuation", () => {
    const html = renderNavbar();
    expect(html).toContain("Analytica");
    expect(html).toContain("tech");
  });

  it("rend les liens de navigation avec le composant libellés numérotés et balisage accessible", () => {
    const html = renderNavbar();

    expect(html).toContain('aria-label="Navigation principale"');
    // Liens numérotés 01–05, libellés lisibles
    expect(html).toContain("Accueil");
    expect(html).toContain("Services");
    expect(html).toContain("Solutions");
    expect(html).toContain("Contact");
    expect(html).toContain("01");
    expect(html).toContain("05");
  });

  it("affiche le bouton CTA avec tracking data-cta", () => {
    const html = renderNavbar();
    expect(html).toContain('data-cta="navbar_demander_audit"');
  });

  it("affiche la capsule avec liseré spéculaire et styles de thème", () => {
    const html = renderNavbar();
    // Barre de navigation pleine largeur, sans liseré lumineux
    expect(html).not.toContain("pointer-events-none absolute inset-x-6 top-0 h-px");
    expect(html).toContain("/brand/");
  });

  it("rend le bouton burger mobile avec les attributs d'accessibilité requis", () => {
    const html = renderNavbar();
    expect(html).toContain('id="burger-menu-button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-nav-drawer"');
    expect(html).toContain('aria-label="Ouvrir le menu"');
  });
});

