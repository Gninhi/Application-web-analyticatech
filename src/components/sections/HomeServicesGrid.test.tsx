import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeServicesGrid } from "@/components/sections/HomeServicesGrid";
import { AiRunTrace } from "@/components/interactive/AiRunTrace";
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

  it("HomeServicesGrid : commutateur segmenté à libellés courts et pastilles IconBadge", () => {
    const html = renderWithProviders(
      <HomeServicesGrid onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // Une seule liste d'onglets, cinq segments courts (« Tous » actif)
    expect(html.match(/role="tablist"/g)).toHaveLength(1);
    expect(html.match(/role="tab"/g)).toHaveLength(5);
    for (const label of ["Tous", "Assistant IA", "Automatisation", "Multi-agents", "Data & BI"]) {
      expect(html).toContain(`>${label}</button>`);
    }
    expect(html).toMatch(/aria-selected="true"[^>]*>Tous</);

    // Icônes alignées sur le reste du site : une IconBadge par carte, plus de puce animée
    expect(html.match(/class="icon-badge"/g)).toHaveLength(4);
    expect(html).not.toContain("svc-icon");
    // Un seul repère par carte, outils sur une ligne
    expect(html).toContain("01 / 04");
    expect(html).not.toContain("Fiche #");
    expect(html).toContain("Outils · ");
  });

  it("AiRunTrace montre une demande traitée de bout en bout, texte complet dès le premier rendu", () => {
    const html = renderWithProviders(<AiRunTrace />);

    // Titre conservé (SEO) et exemple signalé comme illustratif (charte)
    expect(html).toContain("Comment fonctionne un système d'IA en production");
    expect(html).toContain("Exemple illustratif");
    // Question, sources numérotées, réponse sourcée, action soumise à validation, décision
    expect(html).toContain("Quels clients risquent de ne pas renouveler ce trimestre ?");
    expect(html).toContain("CRM · historique des échanges");
    expect(html).toContain('aria-label="Source 2"');
    expect(html).toContain("Validation humaine");
    expect(html).toMatch(/tableau de bord/i);
    // Quatre étapes, toutes présentes, garanties affichées
    expect(html.match(/data-status="/g)).toHaveLength(4);
    expect(html).toContain("Aucune action sans votre accord");
    expect(html.replace(/<[^>]+>/g, " ")).not.toMatch(/\d+\s?%/);
  });
});
