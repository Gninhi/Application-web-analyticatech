import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MentionsLegalesView } from "@/components/sections/MentionsLegalesView";
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

function renderWithProviders(ui: React.ReactElement) {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale="fr">
      <ContentProvider content={mockContent}>
        {ui}
      </ContentProvider>
    </I18nProvider>
  );
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("MentionsLegalesView — Conformité LCEN Article 6-III", () => {
  it("contient exactement un titre h1 avec le titre Mentions Légales", () => {
    const html = renderWithProviders(<MentionsLegalesView onNavigate={() => {}} />);
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) ?? [];
    expect(h1Matches).toHaveLength(1);
    expect(h1Matches[0]).toContain("Mentions Légales");
  });

  it("structure les 4 sections obligatoires de la LCEN", () => {
    const html = renderWithProviders(<MentionsLegalesView onNavigate={() => {}} />);
    expect(html).toContain("1. Éditeur du site");
    expect(html).toContain("2. Hébergeur du site web");
    expect(html).toContain("3. Propriété intellectuelle");
    expect(html).toContain("4. Contact");
  });

  it("affiche les mentions obligatoires de l'éditeur pour l'activité de conseil", () => {
    const html = renderWithProviders(<MentionsLegalesView onNavigate={() => {}} />);
    expect(html).toContain("Analyticatech");
    expect(html).toContain("Société par actions simplifiée (SAS)");
    expect(html).toContain("1 000,00 €");
    expect(html).toContain("60 rue François 1er, 75008 Paris");
    expect(html).toContain("984 609 198");
    expect(html).toContain("984 609 198 00010");
    expect(html).toContain("FR96984609198");
    expect(html).toContain("Martial GNINHI");
    expect(html).toContain("62.02A");
  });

  it("mentionne l'hébergeur du site web et la distinction expresse avec les données clients", () => {
    const html = renderWithProviders(<MentionsLegalesView onNavigate={() => {}} />);
    // Hébergeur web public
    expect(html).toContain("Hostinger");
    expect(html).toContain("61 Lordou Vironos Street, 6023 Larnaca");
    // Distinction des données clients
    expect(html).toContain("Distinction essentielle : hébergement web vs données clients");
    expect(html).toContain("SecNumCloud");
    expect(html).toContain("Data Processing Agreement");
  });

  it("stipule la clause d'opposition au scraping IA (TDM opt-out) en propriété intellectuelle", () => {
    const html = renderWithProviders(<MentionsLegalesView onNavigate={() => {}} />);
    expect(html).toContain("L. 122-5-3");
    expect(html).toContain("Text and Data Mining");
  });
});
