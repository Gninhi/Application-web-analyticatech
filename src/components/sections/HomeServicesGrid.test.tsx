import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeServicesGrid } from "@/components/sections/HomeServicesGrid";
import { DataConsoleBento } from "@/components/sections/DataConsoleBento";
import { LivingSystemGraph } from "@/components/interactive/LivingSystemGraph";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import {
  FALLBACK_SERVICES_FR,
  FALLBACK_METRICS_FR,
  FALLBACK_SITE_CONFIG,
  FALLBACK_SEO_METADATA,
} from "@/lib/content/fallbacks";
import type { AppContentDTO } from "@/types/content";

const mockContent: AppContentDTO = {
  locale: "fr",
  siteConfig: FALLBACK_SITE_CONFIG,
  navItems: [],
  metrics: FALLBACK_METRICS_FR,
  clientLogos: [],
  services: FALLBACK_SERVICES_FR,
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
  return rawHtml
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

describe("Dynamic Home Components", () => {
  it("HomeServicesGrid rend dynamiquement les 4 services et leurs métriques réelles", () => {
    const html = renderWithProviders(
      <HomeServicesGrid onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // Titre de section
    expect(html).toContain("Quatre piliers d'expertise");

    // Les 4 services
    expect(html).toContain("Raisonnement & RAG");
    expect(html).toContain("Automatisation & Workflows");
    expect(html).toContain("Orchestration Multi-Agents");
    expect(html).toContain("Data & Décision Augmentée");

    // Métriques dynamiques
    expect(html).toContain("94.2%");
    expect(html).toContain("65%");
    expect(html).toContain("72%");
    expect(html).toContain("+18.4%");
  });

  it("DataConsoleBento rend les cartes de signaux dynamiquement basées sur les métriques", () => {
    const html = renderWithProviders(<DataConsoleBento />);

    // Cartes de signaux dynamiques
    expect(html).toContain("99.9%");
    expect(html).toContain("48 flux");
    expect(html).toContain("38");
    expect(html).toContain("< 280 ms");
  });

  it("LivingSystemGraph rend les nœuds avec les valeurs harmonisées", () => {
    const html = renderWithProviders(<LivingSystemGraph />);

    expect(html).toContain("28+ sources data");
    expect(html).toContain("280 ms latence");
    expect(html).toContain("38 agents actifs");
    expect(html).toContain("42 KPIs actifs");
  });
});
