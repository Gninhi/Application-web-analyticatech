import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactView } from "@/components/sections/ContactView";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { FALLBACK_SITE_CONFIG, FALLBACK_SEO_METADATA } from "@/lib/content/fallbacks";
import type { AppContentDTO } from "@/types/content";

const mockContent: AppContentDTO = {
  locale: "fr",
  siteConfig: FALLBACK_SITE_CONFIG,
  navItems: [],
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

function renderWithProviders(ui: React.ReactElement, locale: "fr" | "en" = "fr") {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <ContentProvider content={{ ...mockContent, locale }}>
        {ui}
      </ContentProvider>
    </I18nProvider>
  );
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("ContactView — Rendu SSR & Intégration FAQ", () => {
  it("rend le formulaire de contact, le bandeau de réassurance et la FAQ en français", () => {
    const html = renderWithProviders(<ContactView />, "fr");

    // En-tête et formulaire
    expect(html).toContain("Prénom");
    expect(html).toContain("Nom");
    expect(html).toContain("E-mail professionnel");
    expect(html).toContain("Entreprise");
    expect(html).toContain("Sujet");
    expect(html).toContain("Message");

    // Vérifie que les mentions obsolètes ont bien été retirées
    expect(html).not.toContain("engineer@analyticatech");
    expect(html).not.toContain("initier_session --chiffré");
    expect(html).not.toContain("SEC-LEVEL: HIGH");
    expect(html).not.toContain("Connexion chiffrée TLS 1.3");
    expect(html).not.toContain("Pot-de-miel anti-spam");

    // Vérifie que les badges de sécurité pertinents sont conservés
    expect(html).toContain("Conforme RGPD");
    expect(html).toContain("Données hébergées dans l'Union européenne");

    // Vérifie la présence de la section FAQ intégrée
    expect(html).toContain("FAQ");
    expect(html).toContain("Questions fréquentes avant de démarrer.");
    expect(html).toContain("Combien de temps faut-il pour livrer un projet");
  });

  it("rend la page Contact en anglais avec les traductions adaptées", () => {
    const html = renderWithProviders(<ContactView />, "en");

    expect(html).toContain("First name");
    expect(html).toContain("Last name");
    expect(html).not.toContain("CONSULTATION PROTOCOL");
    expect(html).toContain("Frequently Asked Questions.");
  });
});
