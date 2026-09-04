import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { InsightDetailTemplate } from "@/components/sections/detail/InsightDetailTemplate";
import { BlogDetailView } from "@/components/sections/detail/BlogDetailView";
import { INSIGHTS_DETAIL_REGISTRY, getInsightDetailData } from "@/lib/content/insights-detail-data";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import type { AppContentDTO } from "@/types/content";
import { FALLBACK_BLOG_POSTS_FR, FALLBACK_BLOG_POSTS_EN } from "@/lib/content/fallbacks";

const mockAppContent: AppContentDTO = {
  locale: "fr",
  blogPosts: FALLBACK_BLOG_POSTS_FR,
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
  solutions: [],
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
    description: "Cabinet d'ingénierie IA",
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
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("InsightDetailTemplate & Registry", () => {
  it("résout l'article par son slug principal et par son alias", () => {
    const postBySlug = getInsightDetailData("evaluer-systeme-rag-production", "fr");
    expect(postBySlug).toBeDefined();
    expect(postBySlug?.slug).toBe("evaluer-systeme-rag-production");

    const postByAlias = getInsightDetailData("rag-evaluation", "fr");
    expect(postByAlias).toBeDefined();
    expect(postByAlias?.slug).toBe("evaluer-systeme-rag-production");
  });

  it("rend le template enrichi avec toutes les sections d'expertise technique", () => {
    const data = INSIGHTS_DETAIL_REGISTRY["evaluer-systeme-rag-production"];
    const html = renderWithProviders(
      <InsightDetailTemplate data={data} onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // 01. Contexte
    expect(html).toContain("01 // CONTEXTE & CAS D'USAGE RÉEL");
    expect(html).toContain("Assurance & Mutuelle de santé");
    expect(html).toContain("150 000 polices contractuelles");

    // 02. Problème
    expect(html).toContain("02 // LE PROBLÈME EN PRODUCTION");
    expect(html).toContain("ERR_01 // CHUNKING_NAÏF");
    expect(html).toContain("Perte de 38% de recall");

    // 03. Architecture & Stack
    expect(html).toContain("03 // APPROCHE & ARCHITECTURE");
    expect(html).toContain("Ragas");
    expect(html).toContain("v0.2.14");
    expect(html).toContain("Qdrant");
    expect(html).toContain("Hierarchical Chunking + Document Tree");

    // 04. Arbitrages & Limites
    expect(html).toContain("04 // ARBITRAGES TECHNIQUES & LIMITES ASSUMÉES");
    expect(html).toContain("NOTE DE TRANSPARENCE");
    expect(html).toContain("Latence P95 vs Fidélité documentaire");
    expect(html).toContain("Arbitrage retenu :");

    // 05. Résultats & Métriques
    expect(html).toContain("05 // RÉSULTATS & MESURES CONTEXTUALISÉES");
    expect(html).toContain("0.94");
    expect(html).toContain("À titre indicatif");
    expect(html).toContain("Protocole de mesure //");

    // 06. Pour aller plus loin
    expect(html).toContain("06 // POUR ALLER PLUS LOIN · SOLUTIONS & SERVICES");
    expect(html).toContain("Service 01 — Raisonnement & RAG");
    expect(html).toContain("Synthèse clinique & extraction NLP");
  });

  it("BlogDetailView intègre automatiquement le template enrichi pour les articles enregistrés", () => {
    const html = renderWithProviders(
      <BlogDetailView postSlug="evaluer-systeme-rag-production" onNavigate={() => {}} />
    );

    expect(html).toContain("Évaluer un système RAG en production :");
    expect(html).toContain("04 // ARBITRAGES TECHNIQUES & LIMITES ASSUMÉES");
    expect(html).toContain("05 // RÉSULTATS & MESURES CONTEXTUALISÉES");
  });

  it("garantit que l'intégralité des 6 articles du registre respectent la grille d'expertise technique", () => {
    const allSlugs = Object.keys(INSIGHTS_DETAIL_REGISTRY);
    expect(allSlugs.length).toBe(6);

    for (const slug of allSlugs) {
      const article = INSIGHTS_DETAIL_REGISTRY[slug];

      // Contexte réel & Métier
      expect(article.context.sector.length).toBeGreaterThan(5);
      expect(article.context.constraints.length).toBeGreaterThan(10);
      expect(article.context.stakes.length).toBeGreaterThan(10);

      // Modes d'échec
      expect(article.problem.failureModes.length).toBeGreaterThanOrEqual(3);
      for (const fm of article.problem.failureModes) {
        expect(fm.code).toMatch(/^(ERR|FAIL)_\d{2} \/\//);
        expect(fm.impact.length).toBeGreaterThan(5);
      }

      // Stack technique précise avec versions
      expect(article.approach.techStack.length).toBeGreaterThanOrEqual(3);
      for (const tech of article.approach.techStack) {
        expect(tech.name.length).toBeGreaterThan(1);
        expect(tech.role.length).toBeGreaterThan(5);
      }

      // Arbitrages & Limites assumées
      expect(article.tradeoffs.tradeoffs.length).toBeGreaterThanOrEqual(2);
      for (const to of article.tradeoffs.tradeoffs) {
        expect(to.tension.length).toBeGreaterThan(5);
        expect(to.arbitrage.length).toBeGreaterThan(10);
        expect(to.costOrDrawback.length).toBeGreaterThan(10);
        expect(to.mitigation.length).toBeGreaterThan(10);
      }

      // Résultats chiffrés avec mentions de contextualisation
      expect(article.results.metrics.length).toBeGreaterThanOrEqual(3);
      expect(article.results.methodologyNote.length).toBeGreaterThan(20);

      // Maillage interne (2-3 liens vers services ou solutions)
      expect(article.relatedResources.length).toBeGreaterThanOrEqual(2);
      expect(article.relatedResources.length).toBeLessThanOrEqual(3);
      for (const res of article.relatedResources) {
        expect(["service", "solution"]).toContain(res.type);
        expect(res.href).toMatch(/^\/(services|solutions)\//);
      }

      // Rendu HTML sans erreur
      const html = renderWithProviders(
        <InsightDetailTemplate data={article} onNavigate={() => {}} onNavigateDetail={() => {}} />
      );
      expect(html).toContain(article.hero.title);
      expect(html).toContain("01 // CONTEXTE & CAS D'USAGE RÉEL");
      expect(html).toContain("02 // LE PROBLÈME EN PRODUCTION");
      expect(html).toContain("03 // APPROCHE & ARCHITECTURE");
      expect(html).toContain("04 // ARBITRAGES TECHNIQUES & LIMITES ASSUMÉES");
      expect(html).toContain("05 // RÉSULTATS & MESURES CONTEXTUALISÉES");
      expect(html).toContain("06 // POUR ALLER PLUS LOIN · SOLUTIONS & SERVICES");
    }
  });

  it("garantit que FALLBACK_BLOG_POSTS_FR et _EN contiennent les 6 articles complets", () => {
    expect(FALLBACK_BLOG_POSTS_FR).toHaveLength(6);
    expect(FALLBACK_BLOG_POSTS_EN).toHaveLength(6);

    const fallbackSlugsFr = FALLBACK_BLOG_POSTS_FR.map((p) => p.slug);
    const registrySlugs = Object.keys(INSIGHTS_DETAIL_REGISTRY);

    for (const regSlug of registrySlugs) {
      expect(fallbackSlugsFr).toContain(regSlug);
    }
  });
});
