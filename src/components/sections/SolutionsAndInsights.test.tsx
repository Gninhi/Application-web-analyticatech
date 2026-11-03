import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SolutionCard, solutionSteps } from "@/components/sections/solutions/SolutionCard";
import { InsightRow } from "@/components/sections/blog/InsightRow";
import { motifForCategory } from "@/components/sections/blog/InsightCover";
import { HeroCard } from "@/components/sections/blog/HeroCard";
import { FALLBACK_SOLUTIONS_FR, FALLBACK_SOLUTIONS_EN } from "@/lib/content/fallbacks";
import { I18nProvider } from "@/lib/i18n/provider";
import type { BlogPostDTO } from "@/types/content";

function renderWithI18n(ui: React.ReactElement, locale: "fr" | "en" = "fr") {
  const rawHtml = renderToStaticMarkup(<I18nProvider initialLocale={locale}>{ui}</I18nProvider>);
  return rawHtml
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const mockPost: BlogPostDTO = {
  id: "post-1",
  slug: "agents-production-2025",
  title: "Industrialiser les agents IA",
  excerpt: "Pourquoi beaucoup de prototypes d'agents ne passent pas en production...",
  categoryKey: "IA",
  categoryLabel: "Intelligence Artificielle",
  date: "2025-09-14T00:00:00.000Z",
  readingTime: "11 min",
  author: "Martial GNINHI",
  tags: ["Agents", "LangGraph", "Production"],
};

describe("SolutionCard Component", () => {
  for (const [locale, solutions] of [
    ["fr", FALLBACK_SOLUTIONS_FR],
    ["en", FALLBACK_SOLUTIONS_EN],
  ] as const) {
    it(`affiche les 3 projets réels puis les 3 pistes (${locale}), avec leur statut exact`, () => {
      expect(solutions.map((s) => s.slug)).toEqual([
        "ciblioo",
        "contentops",
        "avie",
        "retail-bi",
        "logistics-ai",
        "veille-registres",
      ]);

      solutions.forEach((solution, i) => {
        const html = renderWithI18n(
          <SolutionCard solution={solution} index={i} total={solutions.length} onNavigateDetail={() => {}} />,
          locale
        );
        expect(html).toContain(solution.title);
        // Le parcours de l'outil reprend chaque étape du texte publié, dans l'ordre
        const steps = solutionSteps(solution.impact);
        expect(steps).toHaveLength(3);
        steps.forEach((step) => expect(html).toContain(step));
        // Projet réel en trait plein, piste à construire en pointillés
        expect(html).toContain(
          `data-solution-card="${solution.statusType === "methodology" ? "idea" : "project"}"`
        );
        expect(html).toContain(solution.statusBadge ?? "");
        expect(html).toContain(solution.impactLabel ?? "");
        expect(html).toContain(solution.methodology ?? "");
        // Aucun libellé de mesure fictive sur une carte
        expect(html).not.toContain("Impact mesuré");
        expect(html).not.toContain("Measured impact");
        // Aucune zone défilante interne qui capterait la molette
        expect(html).not.toContain("overflow-y-auto");
        expect(html).not.toContain("overscroll-contain");
      });
    });
  }
});

describe("Insights & Blog Cards", () => {
  it("InsightRow affiche le temps de lecture au format 'X min de lecture' et le tag catégorie sans doublon", () => {
    const html = renderWithI18n(
      <InsightRow post={mockPost} />,
      "fr"
    );

    // Temps de lecture
    expect(html).toContain("11 min de lecture");

    // Tag catégorie : doit apparaître exactement une fois dans le HTML du composant
    const categoryMatches = html.match(new RegExp(mockPost.categoryLabel, "g"));
    expect(categoryMatches).toHaveLength(1);
  });

  it("HeroCard affiche le temps de lecture au format 'X min de lecture' et le tag catégorie sans doublon", () => {
    const html = renderWithI18n(
      <HeroCard post={mockPost} />,
      "fr"
    );

    // Temps de lecture
    expect(html).toContain("11 min de lecture");

    // Tag catégorie : doit apparaître exactement une fois
    const categoryMatches = html.match(new RegExp(mockPost.categoryLabel, "g"));
    expect(categoryMatches).toHaveLength(1);
  });

  it("les cartes sont de vrais liens vers l'article, localisés", () => {
    expect(renderWithI18n(<InsightRow post={mockPost} />, "fr")).toContain(`href="/insights/${mockPost.slug}"`);
    expect(renderWithI18n(<HeroCard post={mockPost} />, "en")).toContain(`href="/en/insights/${mockPost.slug}"`);
  });

  it("chaque catégorie a son propre motif de couverture", () => {
    expect(motifForCategory("ia", "Intelligence artificielle")).toBe("network");
    expect(motifForCategory("automation", "Automatisation")).toBe("flow");
    expect(motifForCategory("data", "Data & Décision")).toBe("curves");
    expect(motifForCategory("architecture", "Architecture")).toBe("blocks");
    expect(renderWithI18n(<InsightRow post={{ ...mockPost, categoryKey: "data", categoryLabel: "Data" }} />)).toContain(
      'data-motif="curves"'
    );
  });
});
