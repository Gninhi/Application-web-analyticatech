import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ServicesView } from "@/components/sections/ServicesView";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { FALLBACK_SERVICES_FR, FALLBACK_SITE_CONFIG, FALLBACK_SEO_METADATA } from "@/lib/content/fallbacks";
import type { AppContentDTO } from "@/types/content";

const mockContent: AppContentDTO = {
  locale: "fr",
  siteConfig: FALLBACK_SITE_CONFIG,
  navItems: [],
  metrics: [],
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
  deliverySteps: [
    { id: "step-1", label: "01 · Cadrage & Architecture", description: "Audit et architecture", iconKey: "Layers", order: 1 },
    { id: "step-2", label: "02 · Prototype & Benchmark", description: "POC en 4 semaines", iconKey: "Cpu", order: 2 },
    { id: "step-3", label: "03 · Industrialisation & Sécurité", description: "Mise en production", iconKey: "ShieldCheck", order: 3 },
    { id: "step-4", label: "04 · Run & Amélioration Continue", description: "Supervision continue", iconKey: "Workflow", order: 4 },
  ],
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

describe("ServicesView Component", () => {
  it("rend les boutons de filtre de persona (CEO, ARCHITECT, OPS) sans mention brute debug", () => {
    const html = renderWithProviders(
      <ServicesView onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // Titres & Intro
    expect(html).toContain("Quatre expertises,");
    expect(html).toContain("sans zone grise entre elles");

    // Filtres ciblés
    expect(html).toContain("Vue ciblée :");
    expect(html).toContain("CEO");
    expect(html).toContain("Architect");
    expect(html).toContain("Ops");

    // Ne doit PAS contenir de mention brute "(Perspective :" ou "(Perspective: "
    expect(html).not.toContain("(Perspective :");
    expect(html).not.toContain("(Perspective:");

    // Deck des 4 services
    expect(html).toContain("Raisonnement & RAG");
    expect(html).toContain("Automatisation & Workflows");
    expect(html).toContain("Orchestration Multi-Agents");
    expect(html).toContain("Data & Décision Augmentée");
  });
});
