import type { Metadata } from "next";
import type { Locale } from "@/types/content";
import { getSeoMetadata } from "./seo.service";
import { getSiteConfig } from "./site-config.service";
import { safe, FALLBACK_SEO_METADATA } from "./safe";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";

/** Copy par route (fr/en) pour les pages statiques. Les pages de détail
 *  utilisent le titre/description de leur fiche (voir les pages `[slug]`). */
const PAGE_COPY: Record<Locale, Record<string, { title: string; description: string }>> = {
  fr: {
    services: {
      title: "Services — IA, automatisation et données",
      description:
        "Quatre services expliqués sans jargon : assistants qui répondent à partir de vos documents, automatisation des processus, agents IA sous contrôle humain, données et tableaux de bord.",
    },
    solutions: {
      title: "Solutions — Projets en cours et pistes à construire",
      description:
        "Les produits que construit Analyticatech (Ciblioo, ContentOps Harness, AVIE), avec leur état d'avancement réel, et les pistes de solutions présentées comme telles.",
    },
    insights: {
      title: "Insights — Articles et guides pratiques",
      description:
        "Des articles de méthode écrits par le fondateur d'Analyticatech pour comprendre l'IA, les agents et l'automatisation, et décider en connaissance de cause.",
    },
    contact: {
      title: "Contact",
      description:
        "Décrivez votre besoin : le fondateur vous répond personnellement sous 2 jours ouvrés et vous propose un premier échange gratuit de 20 minutes.",
    },
    confidentialite: {
      title: "Politique de confidentialité — RGPD",
      description:
        "Données collectées, finalités, sous-traitants, durées de conservation et droits : comment Analyticatech traite vos données personnelles.",
    },
    "mentions-legales": {
      title: "Mentions légales",
      description:
        "Mentions légales d'Analyticatech : éditeur du site, hébergement, propriété intellectuelle et coordonnées.",
    },
    "a-propos": {
      title: "À propos d'Analyticatech",
      description:
        "Analyticatech, cabinet de conseil en IA fondé par Martial Gninhi : parcours, mission et engagements pour des projets d'IA mesurés et conformes.",
    },
  },
  en: {
    services: {
      title: "Services — AI, automation and data",
      description:
        "Four services explained without jargon: assistants that answer from your documents, process automation, AI agents under human control, data and dashboards.",
    },
    solutions: {
      title: "Solutions — Ongoing projects and ideas to build",
      description:
        "The products Analyticatech is building (Ciblioo, ContentOps Harness, AVIE), with their real status, and solution ideas presented as such.",
    },
    insights: {
      title: "Insights — Articles and practical guides",
      description:
        "Method articles written by Analyticatech's founder to understand AI, agents and automation, and make informed decisions.",
    },
    contact: {
      title: "Contact",
      description:
        "Describe your need: the founder replies personally within 2 business days and offers a free 20-minute first call.",
    },
    confidentialite: {
      title: "Privacy policy — GDPR",
      description:
        "Data collected, purposes, processors, retention periods and rights: how Analyticatech handles your personal data.",
    },
    "mentions-legales": {
      title: "Legal notice",
      description:
        "Analyticatech legal notice: site publisher, hosting, intellectual property and contact details.",
    },
    "a-propos": {
      title: "About Analyticatech",
      description:
        "Analyticatech, an AI consulting firm founded by Martial Gninhi: background, mission and commitments for measured, compliant AI projects.",
    },
  },
};

interface PageMetaInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}

/**
 * Construit les métadonnées d'une page :
 * - Canonical auto-référent vers l'URL exacte dans sa propre langue.
 * - Balises hreflang réciproques complètes (fr, en, fr-FR, en-US, x-default).
 * - Open Graph et Twitter Cards localisés avec locale/alternateLocale.
 */
export async function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetaInput): Promise<Metadata> {
  const seo = await safe("seoMetadata", getSeoMetadata(locale), FALLBACK_SEO_METADATA);
  const site = await safe("siteConfig", getSiteConfig(), DEFAULT_SITE_CONFIG);
  const canonicalUrl = `${site.url}${path}`;
  const imageUrl = seo.ogImageUrl ?? `${site.url}/og-image.jpg`;

  const frPath = path.startsWith("/en") ? path.replace(/^\/en/, "") || "/" : path;
  const enPath = path.startsWith("/en") ? path : path === "/" ? "/en" : `/en${path}`;

  // Si la route est la racine ou contient déjà le nom de marque, utiliser absolute pour éviter le double template
  const isRootOrFull = path === "/" || path === "/en" || title.includes("Analyticatech");
  const metaTitle = isRootOrFull ? { absolute: title } : title;
  const socialTitle = title.includes("Analyticatech") ? title : `${title} | ${site.siteName}`;

  return {
    title: metaTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${site.url}${frPath}`,
        en: `${site.url}${enPath}`,
        "fr-FR": `${site.url}${frPath}`,
        "en-US": `${site.url}${enPath}`,
        "x-default": `${site.url}${frPath}`,
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      siteName: site.siteName,
      locale: locale === "en" ? "en_US" : "fr_FR",
      alternateLocale: locale === "en" ? ["fr_FR"] : ["en_US"],
      images: [{ url: imageUrl }],
      type: "website",
    },
    twitter: {
      card: (seo.twitterCard as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}

/** Raccourci pour les pages statiques : copy fr/en + metadata. */
export async function getStaticPageMetadata(
  locale: Locale,
  routeKey: "services" | "solutions" | "insights" | "contact" | "confidentialite" | "mentions-legales" | "a-propos"
): Promise<Metadata> {
  const copy = PAGE_COPY[locale][routeKey] ?? PAGE_COPY.fr[routeKey];
  const basePath = STATIC_ROUTE_PATHS[routeKey];
  const path = locale === "en" ? `/en${basePath}` : basePath;
  return buildPageMetadata({ locale, path, title: copy.title, description: copy.description });
}

const STATIC_ROUTE_PATHS: Record<string, string> = {
  services: "/services",
  solutions: "/solutions",
  insights: "/insights",
  contact: "/contact",
  confidentialite: "/confidentialite",
  "mentions-legales": "/mentions-legales",
  "a-propos": "/a-propos",
};