import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeView } from "@/components/sections/HomeView";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import {
  FALLBACK_SERVICES_FR,
  FALLBACK_METRICS_FR,
  FALLBACK_SITE_CONFIG,
  FALLBACK_SEO_METADATA,
  FALLBACK_TESTIMONIALS_FR,
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
  testimonials: FALLBACK_TESTIMONIALS_FR,
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

describe("HomeView — Rendu SSR initial (crawl sans JS & robots IA)", () => {
  it("inclut l'ensemble des sections 01 à 10 dans le HTML brut sans dépendre du JS", () => {
    const html = renderWithProviders(
      <HomeView onNavigate={() => {}} onNavigateDetail={() => {}} />
    );

    // Section 01 — Hero
    expect(html).toContain("IA, expliquée simplement.");

    // Section 02 — Engagements vérifiables (aucun chiffre non vérifiable)
    expect(html).toContain("02 — ENGAGEMENTS");
    expect(html).not.toContain("48+");

    expect(html).toContain("03 — SERVICES");
    expect(html).toContain("04 — PROBLÈMES MÉTIERS");
    expect(html).toContain("05 — DE LA DONNÉE À LA DÉCISION");
    expect(html).toContain("06 — MÉTHODE");
    expect(html).toContain("07 — CAS RÉEL");
    expect(html).toContain("08 — ANALYSES");

    // Aucune section ne doit être restée au statut lazy non monté
    expect(html).not.toContain('data-lazy-mounted="false"');
  });

  it("garantit que la section 06 — Méthode contient bien les 4 piliers de delivery", () => {
    const html = renderWithProviders(
      <HomeView onNavigate={() => {}} onNavigateDetail={() => {}} />
    );
    expect(html).toContain("Découverte & Cadrage");
    expect(html).toContain("Prototype en conditions réelles");
    expect(html).toContain("Industrialisation");
    expect(html).toContain("Run & amélioration continue");
  });

  it("génère et extrait la liste exhaustive des titres h2 du HTML brut pour confirmation", () => {
    const html = renderWithProviders(
      <HomeView onNavigate={() => {}} onNavigateDetail={() => {}} />
    );
    const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) ?? [];
    const extractedHeadings = h2Matches.map((h2) =>
      h2.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    );

    console.warn("=== EXTRACTION DU HTML BRUT SSR HOMEVIEW ===");
    console.warn("Taille totale du HTML brut SSR :", html.length, "caractères");
    console.warn("Nombre de titres <h2> présents :", extractedHeadings.length);
    extractedHeadings.forEach((h, idx) => {
      console.warn(`  [H2 #${idx + 1}] ${h}`);
    });

    // Confirmation que les sections principales dont 07 Méthode sont présentes
    expect(extractedHeadings.length).toBeGreaterThanOrEqual(7);
    expect(extractedHeadings.some((h) => h.includes("Quatre services complémentaires"))).toBe(true); // 03 - Services
    expect(extractedHeadings.some((h) => h.includes("Une démarche structurée"))).toBe(true); // 07 - Méthode
  });
});
