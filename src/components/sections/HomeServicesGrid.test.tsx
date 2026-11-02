import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeServicesGrid } from "@/components/sections/HomeServicesGrid";
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
  it("HomeServicesGrid rend dynamiquement les 4 services et sans métriques", () => {
    const html = renderWithProviders(
      <HomeServicesGrid onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // Titre de section
    expect(html).toContain("Quatre services complémentaires");

    // Les 4 services
    expect(html).toContain("Raisonnement & RAG");
    expect(html).toContain("Automatisation & Workflows");
    expect(html).toContain("Orchestration Multi-Agents");
    expect(html).toContain("Data & Décision Augmentée");

    // Aucune métrique non vérifiable
    expect(html).not.toContain("94.2%");
    expect(html).not.toContain("65%");
  });

  it("LivingSystemGraph rend les nœuds avec les libellés sans chiffres non vérifiables", () => {
    const html = renderWithProviders(<LivingSystemGraph />);

    expect(html).toContain("Vos outils existants");
    expect(html).toContain("Validation humaine");
    expect(html).not.toContain("38 agents actifs");
  });
});
