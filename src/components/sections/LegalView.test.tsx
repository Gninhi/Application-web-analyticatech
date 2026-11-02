import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalView } from "@/components/sections/LegalView";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import {
  FALLBACK_SITE_CONFIG,
  FALLBACK_SEO_METADATA,
  FALLBACK_LEGAL_SECTIONS_FR,
  FALLBACK_LEGAL_SECTIONS_EN,
} from "@/lib/content/fallbacks";
import type { AppContentDTO, Locale } from "@/types/content";

function render(type: "legal" | "rgpd", locale: Locale) {
  const sections = locale === "en" ? FALLBACK_LEGAL_SECTIONS_EN : FALLBACK_LEGAL_SECTIONS_FR;
  const content: AppContentDTO = {
    locale,
    siteConfig: FALLBACK_SITE_CONFIG,
    navItems: [],
    metrics: [],
    clientLogos: [],
    services: [],
    solutions: [],
    blogCategories: [],
    blogPosts: [],
    capabilities: [],
    testimonials: [],
    marqueeKeywords: [],
    activityLogs: [],
    companyValues: [],
    deliverySteps: [],
    rgpdSections: sections.filter((s) => s.type === "rgpd"),
    legalSections: sections.filter((s) => s.type === "legal"),
    seoMetadata: FALLBACK_SEO_METADATA,
    seoSchemas: [],
  };
  return renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <ContentProvider content={content}>
        <LegalView type={type} onNavigate={() => {}} />
      </ContentProvider>
    </I18nProvider>
  )
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}

describe("LegalView — mentions légales (LCEN 6-III)", () => {
  it("affiche l'identité vérifiée de l'éditeur en français", () => {
    const html = render("legal", "fr");
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    for (const fact of [
      "Analyticatech",
      "société par actions simplifiée (SAS)",
      "60 rue François 1er, 75008 Paris",
      "SIREN 984 609 198",
      "984 609 198 00010",
      "FR96984609198",
      "Martial GNINHI",
      "62.02A",
      "Vercel Inc.",
      "Supabase",
      "5. Droit applicable",
    ]) {
      expect(html).toContain(fact);
    }
    expect(html).not.toContain("SecNumCloud");
    expect(html).toContain("peuvent indexer et citer ce site");
  });

  it("est entièrement traduite sur le site anglais", () => {
    const html = render("legal", "en");
    expect(html).toContain("1. Publisher");
    expect(html).toContain("5. Governing law");
    expect(html).toContain("may index and cite this site");
    expect(html).not.toContain("Éditeur du site");
  });

  it("affiche une date de révision fixe", () => {
    expect(render("legal", "fr")).toContain("2 novembre 2026");
  });

  it("la politique de confidentialité liste sous-traitants, droits et CNIL", () => {
    const html = render("rgpd", "fr");
    for (const fact of ["Vercel", "Supabase", "Resend", "PostHog", "CNIL", "3 ans"]) {
      expect(html).toContain(fact);
    }
  });
});
