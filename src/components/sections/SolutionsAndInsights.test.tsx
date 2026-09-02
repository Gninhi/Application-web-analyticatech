import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SolutionCard } from "@/components/sections/solutions/SolutionCard";
import { ReportCard } from "@/components/sections/blog/ReportCard";
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
  excerpt: "Pourquoi 80% des POC agents ne passent pas l'échelle...",
  categoryKey: "IA",
  categoryLabel: "Intelligence Artificielle",
  date: "2025-09-14T00:00:00.000Z",
  readingTime: "11 min",
  author: "L. Marchand",
  tags: ["Agents", "LangGraph", "Production"],
};

describe("SolutionCard Component", () => {
  it("affiche les chiffres d'impact et la note de méthodologie pour les 6 cas d'usage FR", () => {
    expect(FALLBACK_SOLUTIONS_FR).toHaveLength(6);

    for (let i = 0; i < FALLBACK_SOLUTIONS_FR.length; i++) {
      const solution = FALLBACK_SOLUTIONS_FR[i];
      const html = renderWithI18n(
        <SolutionCard
          solution={solution}
          index={i}
          total={6}
          onNavigateDetail={() => {}}
        />,
        "fr"
      );

      expect(html).toContain(solution.title);
      expect(html).toContain(solution.impact);
      expect(solution.methodology).toBeDefined();
      expect(html).toContain(solution.methodology);
    }
  });

  it("affiche les chiffres d'impact et la note de méthodologie pour les 6 cas d'usage EN", () => {
    expect(FALLBACK_SOLUTIONS_EN).toHaveLength(6);

    for (let i = 0; i < FALLBACK_SOLUTIONS_EN.length; i++) {
      const solution = FALLBACK_SOLUTIONS_EN[i];
      const html = renderWithI18n(
        <SolutionCard
          solution={solution}
          index={i}
          total={6}
          onNavigateDetail={() => {}}
        />,
        "en"
      );

      expect(html).toContain(solution.title);
      expect(html).toContain(solution.impact);
      expect(solution.methodology).toBeDefined();
      expect(html).toContain(solution.methodology);
    }
  });
});

describe("Insights & Blog Cards", () => {
  it("ReportCard affiche le temps de lecture au format 'X min de lecture' et le tag catégorie sans doublon", () => {
    const html = renderWithI18n(
      <ReportCard
        post={mockPost}
        index={0}
        total={3}
        onNavigateDetail={() => {}}
      />,
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
      <HeroCard
        post={mockPost}
        index={0}
        total={3}
        onNavigateDetail={() => {}}
      />,
      "fr"
    );

    // Temps de lecture
    expect(html).toContain("11 min de lecture");

    // Tag catégorie : doit apparaître exactement une fois
    const categoryMatches = html.match(new RegExp(mockPost.categoryLabel, "g"));
    expect(categoryMatches).toHaveLength(1);
  });
});
