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
    description: "Projets et solutions",
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
  const PROJECTS = ["ciblioo", "contentops", "avie"];
  const IDEAS = ["retail-bi", "logistics-ai", "veille-registres"];

  it("résout le projet Ciblioo par son slug, en FR et en EN", () => {
    const fr = getSolutionDetailData("ciblioo", "fr");
    expect(fr?.slug).toBe("ciblioo");
    expect(fr?.statusBadge).toBe("En développement");
    const en = getSolutionDetailData("ciblioo", "en");
    expect(en?.statusBadge).toBe("In development");
    expect(en?.summary).not.toBe(fr?.summary);
  });

  it("redirige l'ancien sourcing M&A (Dealscoop et alias) vers Ciblioo", () => {
    for (const alias of ["dealscoop", "dealscoop-ma", "sourcing-ma", "dealscope"]) {
      expect(getSolutionDetailData(alias, "fr")?.slug).toBe("ciblioo");
    }
  });

  it("ne connaît plus les anciennes fiches de démonstration", () => {
    for (const slug of ["finance-agent", "healthcare-nlp", "industry-maintenance", "energy-smartgrid"]) {
      expect(getSolutionDetailData(slug, "fr")).toBeNull();
    }
  });

  it("rend le template d'un projet avec ses sections, sans libellé de mesure fictive", () => {
    const data = SOLUTIONS_DETAIL_REGISTRY.ciblioo;
    const html = renderWithProviders(
      <SolutionDetailTemplate data={data} onNavigate={() => {}} />
    );
    expect(html).toContain("01 · LE PROBLÈME");
    expect(html).toContain("02 · COMMENT ÇA MARCHE");
    expect(html).toContain("03 · OÙ EN EST LE PROJET");
    expect(html).toContain("Ce qu'il reste à prouver");
    expect(html).toContain("04 · LIMITES ET PRÉREQUIS");
    expect(html).toContain("05 · SERVICES LIÉS");
    expect(html).toContain("En développement");
    expect(html).not.toContain("Cas d'usage type");
    expect(html).not.toContain("Indicateurs mesurés");
  });

  it("SolutionDetailView rend la fiche d'une piste avec son statut", () => {
    const html = renderWithProviders(
      <SolutionDetailView solutionSlug="logistics-ai" onNavigate={() => {}} />
    );
    expect(html).toContain("Prévision de la demande :");
    expect(html).toContain("Piste à construire");
    expect(html).toContain("Rien n'est encore construit.");
  });

  it("chaque fiche respecte la grille : problème, approche, statut, limites, liens", () => {
    const allSlugs = Object.keys(SOLUTIONS_DETAIL_REGISTRY);
    expect(allSlugs).toEqual([...PROJECTS, ...IDEAS]);

    for (const locale of ["fr", "en"]) {
      for (const slug of allSlugs) {
        const solution = getSolutionDetailData(slug, locale);
        expect(solution, `${slug} (${locale})`).not.toBeNull();
        if (!solution) continue;
        expect(solution.problem.coreFrictions.length).toBeGreaterThanOrEqual(2);
        expect(solution.approach.stages.length).toBeGreaterThanOrEqual(3);
        expect(solution.metrics.items.length).toBeGreaterThanOrEqual(2);
        expect(solution.limitsAndPrerequisites.applicabilityLimits.length).toBeGreaterThanOrEqual(2);
        expect(solution.relatedResources.length).toBeGreaterThanOrEqual(2);
        // Aucun chiffre de résultat : ni pourcentage ni gain annoncé
        expect(JSON.stringify(solution)).not.toMatch(/\d+\s?%/);
      }
    }
  });

  it("présente les pistes comme non construites", () => {
    for (const slug of IDEAS) {
      const data = SOLUTIONS_DETAIL_REGISTRY[slug];
      expect(data.statusBadge).toBe("Piste à construire");
      expect(data.metrics.methodology.rigorDisclaimer).toContain("n'existe pas encore");
    }
  });
});
