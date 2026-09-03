import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n/provider";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { isValidSocialUrl } from "@/lib/content/site";
import { FALLBACK_SITE_CONFIG, FALLBACK_SEO_METADATA } from "@/lib/content/fallbacks";
import type { AppContentDTO } from "@/types/content";

function createMockContent(socialOverrides?: {
  socialLinkedin?: string | null;
  socialTwitter?: string | null;
  socialGithub?: string | null;
}): AppContentDTO {
  return {
    locale: "fr",
    siteConfig: {
      ...FALLBACK_SITE_CONFIG,
      socialLinkedin: "https://www.linkedin.com/company/102606877",
      socialTwitter: null,
      socialGithub: null,
      ...socialOverrides,
    },
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
    rgpdSections: [],
    legalSections: [],
    seoMetadata: FALLBACK_SEO_METADATA,
    seoSchemas: [],
  };
}

function renderFooter(content: AppContentDTO) {
  const rawHtml = renderToStaticMarkup(
    <I18nProvider initialLocale="fr">
      <ContentProvider content={content}>
        <Footer />
      </ContentProvider>
    </I18nProvider>
  );
  return rawHtml.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
}

describe("isValidSocialUrl helper", () => {
  it("retourne true pour les profils réels", () => {
    expect(isValidSocialUrl("https://www.linkedin.com/company/102606877")).toBe(true);
    expect(isValidSocialUrl("https://github.com/analyticatech")).toBe(true);
    expect(isValidSocialUrl("https://x.com/analyticatech")).toBe(true);
  });

  it("retourne false pour les domaines racines génériques sans handle", () => {
    expect(isValidSocialUrl("https://linkedin.com")).toBe(false);
    expect(isValidSocialUrl("https://www.linkedin.com/")).toBe(false);
    expect(isValidSocialUrl("https://twitter.com")).toBe(false);
    expect(isValidSocialUrl("https://x.com")).toBe(false);
    expect(isValidSocialUrl("https://github.com")).toBe(false);
    expect(isValidSocialUrl("https://github.com/")).toBe(false);
  });

  it("retourne false pour les valeurs vides, nulles ou dièses", () => {
    expect(isValidSocialUrl("")).toBe(false);
    expect(isValidSocialUrl(null)).toBe(false);
    expect(isValidSocialUrl(undefined)).toBe(false);
    expect(isValidSocialUrl("   ")).toBe(false);
    expect(isValidSocialUrl("#")).toBe(false);
  });
});

describe("Footer Social Links", () => {
  it("affiche le lien LinkedIn réel quand il est configuré", () => {
    const content = createMockContent({
      socialLinkedin: "https://www.linkedin.com/company/102606877",
      socialTwitter: null,
      socialGithub: null,
    });
    const html = renderFooter(content);

    expect(html).toContain("https://www.linkedin.com/company/102606877");
    expect(html).toContain('aria-label="LinkedIn"');
  });

  it("masque les icônes Twitter et GitHub quand elles sont nulles ou vides", () => {
    const content = createMockContent({
      socialLinkedin: "https://www.linkedin.com/company/102606877",
      socialTwitter: null,
      socialGithub: null,
    });
    const html = renderFooter(content);

    expect(html).not.toContain('aria-label="Twitter / X"');
    expect(html).not.toContain('aria-label="GitHub"');
  });

  it("masque les icônes quand les URLs pointent vers des domaines génériques morts", () => {
    const content = createMockContent({
      socialLinkedin: "https://www.linkedin.com/company/102606877",
      socialTwitter: "https://twitter.com",
      socialGithub: "https://github.com",
    });
    const html = renderFooter(content);

    // LinkedIn réel est affiché
    expect(html).toContain('aria-label="LinkedIn"');
    // Twitter et GitHub génériques sont filtrés et masqués
    expect(html).not.toContain('aria-label="Twitter / X"');
    expect(html).not.toContain('aria-label="GitHub"');
  });

  it("affiche GitHub dès qu'une URL de profil réelle est renseignée", () => {
    const content = createMockContent({
      socialLinkedin: "https://www.linkedin.com/company/102606877",
      socialTwitter: null,
      socialGithub: "https://github.com/analyticatech-org",
    });
    const html = renderFooter(content);

    expect(html).toContain('aria-label="LinkedIn"');
    expect(html).toContain('aria-label="GitHub"');
    expect(html).toContain("https://github.com/analyticatech-org");
    expect(html).not.toContain('aria-label="Twitter / X"');
  });
});
