import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SolutionDetailTemplate } from "@/components/sections/detail/SolutionDetailTemplate";
import { SolutionDetailView } from "@/components/sections/detail/SolutionDetailView";
import {
  SOLUTIONS_DETAIL_REGISTRY,
  getSolutionDetailData,
} from "@/lib/content/solutions-detail-data";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import type { AppContentDTO } from "@/types/content";
import { FALLBACK_SOLUTIONS_FR } from "@/lib/content/fallbacks";

const mockAppContent: AppContentDTO = {
  locale: "fr",
  solutions: FALLBACK_SOLUTIONS_FR,
  siteConfig: {
    siteName: "Analyticatech",
    url: "https://analyticatech.fr",
    email: "contact@analyticatech.fr",
    phone: "+33 1 00 00 00 00",
    phoneHref: "tel:+33100000000",
    streetAddress: "123 Rue Tech",
    city: "Paris",
    postalCode: "75000",
    country: "France",
    countryCode: "FR",
    socialLinkedin: null,
    socialTwitter: null,
    socialGithub: null,
    geoLat: null,
    geoLng: null,
  },
  navItems: [],
  metrics: [],
  clientLogos: [],
  services: [],
  blogPosts: [],
  blogCategories: [],
  capabilities: [],
  testimonials: [],
  marqueeKeywords: [],
  activityLogs: [],
  companyValues: [],
  deliverySteps: [],
  rgpdSections: [],
  legalSections: [],
  seoMetadata: {
    title: "Analyticatech",
    description: "Solutions sectorielles",
    keywords: [],
    ogTitle: null,
    ogDescription: null,
    ogImageUrl: null,
    canonicalUrl: "https://analyticatech.fr",
    twitterCard: "summary_large_image",
  },
  seoSchemas: [],
};

function renderWithProviders(ui: React.ReactElement) {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale="fr">
      <ContentProvider content={mockAppContent}>{ui}</ContentProvider>
    </I18nProvider>
  );
  return rawHtml
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}

describe("SolutionDetailTemplate & Registry", () => {
  it("résout la solution logistique par son slug", () => {
    const solution = getSolutionDetailData("logistics-ai", "fr");
    expect(solution).toBeDefined();
    expect(solution?.slug).toBe("logistics-ai");
    expect(solution?.sector).toBe("Logistique");
  });

  it("rend le template enrichi de la solution logistique avec toutes ses sections d'expertise", () => {
    const data = SOLUTIONS_DETAIL_REGISTRY["logistics-ai"];
    const html = renderWithProviders(
      <SolutionDetailTemplate
        data={data}
        onNavigate={() => {}}
        onNavigateDetail={() => {}}
      />
    );

    // 01. Problème
    expect(html).toContain("01 // LE PROBLÈME MÉTIER CONCRET");
    expect(html).toContain("Incapacité à recalculer les tournées");
    expect(html).toContain("Effet coup de fouet");

    // 02. Approche
    expect(html).toContain("02 // L'APPROCHE TECHNIQUE & ARCHITECTURALE");
    expect(html).toContain("Vehicle Routing Problem with Time Windows");
    expect(html).toContain("Intégration non disruptive");

    // 03. Mesures & Méthodologie
    expect(html).toContain("03 // CE QUI A ÉTÉ MESURÉ · PREUVES & MÉTHODOLOGIE");
    expect(html).toContain("Jusqu'à -22%");
    expect(html).toContain("-41%");
    expect(html).toContain("Cadre & Conditions de mesure vérifiées");

    // 04. Limites & Prérequis
    expect(html).toContain("04 // LIMITES D'APPLICABILITÉ & PRÉREQUIS STRICTS");
    expect(html).toContain("Prérequis indispensables");
    expect(html).toContain("Où la solution ne s'applique PAS");
    expect(html).toContain("Réglementation Sociale Européenne");

    // 05. Ressources liées
    expect(html).toContain("05 // MAILLAGE & RESSOURCES ASSOCIÉES");
    expect(html).toContain("Service 02 — Automatisation & Workflows");
    expect(html).toContain("Architecture event-driven pour systèmes temps réel");
  });

  it("SolutionDetailView intègre automatiquement le template enrichi pour une solution enregistrée", () => {
    const html = renderWithProviders(
      <SolutionDetailView solutionSlug="logistics-ai" onNavigate={() => {}} />
    );

    expect(html).toContain("Optimisation logistique par l'IA :");
    expect(html).toContain("04 // LIMITES D'APPLICABILITÉ & PRÉREQUIS STRICTS");
  });

  it("résout la solution Dealscoop par son slug principal et ses alias", () => {
    const solution = getSolutionDetailData("dealscoop", "fr");
    expect(solution).toBeDefined();
    expect(solution?.slug).toBe("dealscoop");
    expect(solution?.sector).toBe("M&A & Private Equity");
    expect(solution?.statusBadge).toBe("Nouvelle offre");
    expect(solution?.statusType).toBe("new");

    const aliasSolution = getSolutionDetailData("dealscoop-ma", "fr");
    expect(aliasSolution).toBeDefined();
    expect(aliasSolution?.slug).toBe("dealscoop");
  });

  it("garantit que l'intégralité des 7 solutions sectorielles respectent la grille d'exigence technique", () => {
    const allSlugs = Object.keys(SOLUTIONS_DETAIL_REGISTRY);
    expect(allSlugs.length).toBe(7);

    const expectedSlugs = [
      "logistics-ai",
      "finance-agent",
      "retail-bi",
      "healthcare-nlp",
      "industry-maintenance",
      "energy-smartgrid",
      "dealscoop",
    ];

    for (const expected of expectedSlugs) {
      expect(allSlugs).toContain(expected);
    }

    for (const slug of allSlugs) {
      const solution = SOLUTIONS_DETAIL_REGISTRY[slug];

      // Problème métier
      expect(solution.problem.heading.length).toBeGreaterThan(10);
      expect(solution.problem.contextNarrative.length).toBeGreaterThan(40);
      expect(solution.problem.coreFrictions.length).toBeGreaterThanOrEqual(2);
      for (const friction of solution.problem.coreFrictions) {
        expect(friction.title.length).toBeGreaterThan(5);
        expect(friction.description.length).toBeGreaterThan(15);
        expect(friction.impact.length).toBeGreaterThan(5);
      }

      // Approche & Architecture
      expect(solution.approach.stages.length).toBeGreaterThanOrEqual(3);
      expect(solution.approach.integrationDetails.length).toBeGreaterThan(20);

      // Métriques / Capacités
      expect(solution.metrics.items.length).toBeGreaterThanOrEqual(2);
      expect(solution.metrics.methodology.sampleAndScope.length).toBeGreaterThan(10);
      expect(solution.metrics.methodology.period.length).toBeGreaterThan(4);
      expect(solution.metrics.methodology.measurementConditions.length).toBeGreaterThan(20);
      expect(solution.metrics.methodology.rigorDisclaimer.length).toBeGreaterThan(20);

      // Limites et prérequis
      expect(solution.limitsAndPrerequisites.prerequisites.length).toBeGreaterThanOrEqual(2);
      expect(solution.limitsAndPrerequisites.applicabilityLimits.length).toBeGreaterThanOrEqual(2);
      expect(solution.limitsAndPrerequisites.operationalConstraints.length).toBeGreaterThanOrEqual(2);

      // Maillage interne (2-3 liens vers services ou insights)
      expect(solution.relatedResources.length).toBeGreaterThanOrEqual(2);
      expect(solution.relatedResources.length).toBeLessThanOrEqual(3);
      for (const res of solution.relatedResources) {
        expect(["service", "insight", "solution"]).toContain(res.type);
        expect(res.href).toMatch(/^\/(services|solutions|insights)\//);
      }

      // CTA
      expect(solution.cta.question.length).toBeGreaterThan(10);
      expect(solution.cta.buttonLabel.length).toBeGreaterThan(5);

      // Rendu HTML complet sans exception
      const html = renderWithProviders(
        <SolutionDetailTemplate
          data={solution}
          onNavigate={() => {}}
          onNavigateDetail={() => {}}
        />
      );
      expect(html).toContain(solution.title);
      expect(html).toContain("01 // LE PROBLÈME MÉTIER CONCRET");
      expect(html).toContain("02 // L'APPROCHE TECHNIQUE & ARCHITECTURALE");
      if (solution.statusType === "new") {
        expect(html).toContain("03 // CAPACITÉS OPÉRATIONNELLES & CADRE MÉTHODOLOGIQUE");
        expect(html).toContain("Nouvelle offre");
      } else {
        expect(html).toContain("03 // CE QUI A ÉTÉ MESURÉ · PREUVES & MÉTHODOLOGIE");
        expect(html).toContain("Déployé en production");
      }
      expect(html).toContain("04 // LIMITES D'APPLICABILITÉ & PRÉREQUIS STRICTS");
      expect(html).toContain("05 // MAILLAGE & RESSOURCES ASSOCIÉES");
    }
  });
});
