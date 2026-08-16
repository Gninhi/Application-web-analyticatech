import { describe, expect, it, vi, beforeEach } from "vitest";
import type { SeoMetadataDTO, SiteConfigDTO } from "@/types/content";

type OgUrl = string | URL;
type OgImage = string | URL | { url: OgUrl };
type OgImages = OgImage | OgImage[] | undefined;

/** Normalise l'image OG de Next (string | URL | OGImage | tableau) en string. */
function firstOgImage(images: OgImages): string | undefined {
  const first = Array.isArray(images) ? images[0] : images;
  if (!first) return undefined;
  if (typeof first === "string") return first;
  if (first instanceof URL) return first.toString();
  return first.url.toString();
}

const MOCK_SITE: SiteConfigDTO = {
  siteName: "Analyticatech",
  url: "https://analyticatech.fr",
  email: "contact@analyticatech.fr",
  phone: "+33 1 00 00 00 00",
  phoneHref: "tel:+33100000000",
  streetAddress: "1 rue de Test",
  city: "Paris",
  postalCode: "75001",
  country: "France",
  countryCode: "FR",
  socialLinkedin: null,
  socialTwitter: null,
  socialGithub: null,
  geoLat: null,
  geoLng: null,
};

const MOCK_SEO: SeoMetadataDTO = {
  title: "Analyticatech — Conseil IA",
  description: "Description de test",
  keywords: ["ia", "conseil"],
  ogTitle: null,
  ogDescription: null,
  ogImageUrl: null,
  canonicalUrl: "https://analyticatech.fr",
  twitterCard: "summary_large_image",
};

vi.mock("./seo.service", () => ({ getSeoMetadata: vi.fn() }));
vi.mock("./site-config.service", () => ({ getSiteConfig: vi.fn() }));

import { getSeoMetadata } from "./seo.service";
import { getSiteConfig } from "./site-config.service";
import { buildPageMetadata, getStaticPageMetadata } from "./page-meta";

const mockedSeo = vi.mocked(getSeoMetadata);
const mockedSite = vi.mocked(getSiteConfig);

describe("page-meta", () => {
  beforeEach(() => {
    mockedSeo.mockReset();
    mockedSite.mockReset();
    mockedSeo.mockResolvedValue(MOCK_SEO);
    mockedSite.mockResolvedValue(MOCK_SITE);
  });

  describe("buildPageMetadata", () => {
    it("pose le canonical et l'og:url", async () => {
      const meta = await buildPageMetadata({
        locale: "fr",
        path: "/services",
        title: "Services",
        description: "Desc",
      });
      expect(meta.alternates?.canonical).toBe("https://analyticatech.fr/services");
      expect(meta.openGraph?.url).toBe("https://analyticatech.fr/services");
      expect(meta.openGraph?.siteName).toBe("Analyticatech");
    });

    it("replie l'image OG sur /og-image.jpg quand la DB n'en fournit pas", async () => {
      const meta = await buildPageMetadata({
        locale: "fr",
        path: "/",
        title: "Accueil",
        description: "Desc",
      });
      const first = firstOgImage(meta.openGraph?.images);
      expect(first).toBe("https://analyticatech.fr/og-image.jpg");
    });

    it("utilise l'image OG de la DB quand disponible", async () => {
      mockedSeo.mockResolvedValue({
        ...MOCK_SEO,
        ogImageUrl: "https://cdn.example/og.png",
      });
      const meta = await buildPageMetadata({
        locale: "fr",
        path: "/contact",
        title: "Contact",
        description: "Desc",
      });
      expect(firstOgImage(meta.openGraph?.images)).toBe("https://cdn.example/og.png");
    });

    it("retombe sur les métadonnées de repli si la DB échoue", async () => {
      mockedSeo.mockRejectedValue(new Error("DB down"));
      mockedSite.mockRejectedValue(new Error("DB down"));
      const meta = await buildPageMetadata({
        locale: "fr",
        path: "/a-propos",
        title: "À propos",
        description: "Desc",
      });
      expect(meta.alternates?.canonical).toContain("/a-propos");
      expect(meta.openGraph?.images).toBeTruthy();
    });
  });

  describe("getStaticPageMetadata", () => {
    it("fournit la copy FR", async () => {
      const meta = await getStaticPageMetadata("fr", "services");
      expect(meta.title).toContain("Services");
      expect(meta.description?.length).toBeGreaterThan(50);
    });

    it("fournit la copy EN", async () => {
      const meta = await getStaticPageMetadata("en", "contact");
      expect(meta.title).toContain("Contact");
    });

    it("canonical propre à chaque route", async () => {
      const meta = await getStaticPageMetadata("fr", "mentions-legales");
      expect(meta.alternates?.canonical).toBe("https://analyticatech.fr/mentions-legales");
    });
  });
});
