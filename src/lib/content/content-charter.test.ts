import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Charte de contenu — garde-fou contre le retour de contenus qui érodent la
 * confiance (audit du 2 novembre 2026).
 *
 * Analyticatech est une SAS fondée en 2024 et dirigée par une seule personne :
 * le site ne doit afficher ni chiffre de résultat non mesuré, ni équipe
 * fictive, ni certification que la société ne détient pas, ni promesse de
 * délai intenable, ni établissement non immatriculé.
 *
 * Pour publier un vrai chiffre (mesuré, avec l'accord du client), ajoutez-le
 * à ALLOWED_PERCENTAGES avec sa source en commentaire.
 */

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

function listJson(dir: string): string[] {
  return readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith(".json"))
    .map((f) => `${dir}/${f}`);
}

/** Toutes les sources de textes publiés sur le site. */
const CONTENT_FILES = [
  ...listJson("src/locales/fr"),
  ...listJson("src/locales/en"),
  "src/lib/content/fallbacks.ts",
  "src/lib/content/solutions-detail-data.ts",
  "src/lib/content/services-detail-data.ts",
  "src/lib/content/insights-detail-data.ts",
  "src/lib/services/page-meta.ts",
  "src/data/commitments.ts",
  "src/data/stats.ts",
  "src/app/layout.tsx",
  "src/app/api/v1/contact/route.ts",
  "src/components/sections/MentionsLegalesView.tsx",
  "src/components/sections/contact/ContactForm.tsx",
  "src/components/sections/contact/ContactSidePanel.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/seo/JsonLd.tsx",
  "public/llms.txt",
];

/** Paramètres de conception (pas des résultats) présents dans les articles. */
const ALLOWED_PERCENTAGES = [
  "Échantillonnage asynchrone à 5% en production au lieu d'un scoring à 100% en direct.",
  "Exiger que 100% des agents injectent et propagent les contextes OpenTelemetry sur chaque événement.",
];

/** Retire les extraits de code des articles (template literals). */
function stripCode(source: string): string {
  return source.replace(/code:\s*`[\s\S]*?`/g, "code: ``");
}

const FORBIDDEN: Array<{ label: string; pattern: RegExp }> = [
  { label: "équipe fictive", pattern: /\b(nos architectes|our architects|senior architects?|architecte (senior|référent|solution)|un architecte|équipe dédiée|dedicated team)\b/i },
  { label: "établissement non immatriculé", pattern: /Strasbourg/ },
  { label: "certification non détenue", pattern: /(certifié SecNumCloud|qualifiés SecNumCloud|cloud souverain certifié|ISO ?27001|SOC ?2\b)/i },
  { label: "promesse absolue", pattern: /(garantie mathématique|chiffres inattaquables|zero hallucinations|absence d'hallucinations|niveau bancaire|bank-grade)/i },
  { label: "délai intenable", pattern: /(< ?2 ?h|sous 2 ?h|24 ?h ouvrées|24 business hours|sous 72 ?h|within 72 hours)/i },
  { label: "durée de conservation contradictoire", pattern: /(supprimées? sous 90 jours|deleted within 90 days|conservation sous 90 jours|90-day data retention)/i },
  { label: "témoignage client", pattern: /\b(quote|caseStudy|testimonials?)\s*:/ },
  { label: "fuseau horaire erroné (CET l'été)", pattern: /\(CET\)/ },
];

describe("Charte de contenu", () => {
  for (const file of CONTENT_FILES) {
    describe(file, () => {
      const text = stripCode(read(file));

      for (const { label, pattern } of FORBIDDEN) {
        it(`ne contient pas de « ${label} »`, () => {
          const match = text.match(pattern);
          expect(match?.[0], `${file} : « ${match?.[0]} »`).toBeUndefined();
        });
      }

      it("ne contient pas de pourcentage non sourcé", () => {
        let cleaned = text;
        for (const allowed of ALLOWED_PERCENTAGES) cleaned = cleaned.split(allowed).join("");
        const match = cleaned.match(/[^\w]\d+(?:[.,]\d+)?\s?%/);
        expect(match?.[0], `${file} : « ${match?.[0]} »`).toBeUndefined();
      });
    });
  }

  it("robots.txt et les mentions légales disent la même chose sur l'IA", () => {
    const robots = read("src/app/robots.ts");
    const legal = read("src/components/sections/MentionsLegalesView.tsx");
    // Entraînement refusé dans les deux, indexation autorisée dans les deux
    expect(robots).toMatch(/GPTBot/);
    expect(robots).toMatch(/disallow: "\/"/);
    expect(legal).toMatch(/peuvent indexer et citer ce site/);
    expect(legal).not.toMatch(/s&apos;oppose expressément à toute extraction/);
  });

  it("les dates légales ne sont jamais calculées à l'affichage", () => {
    for (const file of ["src/components/sections/MentionsLegalesView.tsx", "src/components/sections/LegalView.tsx"]) {
      expect(read(file)).not.toMatch(/new Date\(\)\.toLocaleDateString/);
    }
  });
});
