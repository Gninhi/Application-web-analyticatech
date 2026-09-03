import type { Metadata } from "next";
import type { Locale } from "@/types/content";
import { getSeoMetadata } from "./seo.service";
import { getSiteConfig } from "./site-config.service";
import { safe, FALLBACK_SEO_METADATA } from "./safe";
import { DEFAULT_SITE_CONFIG } from "@/lib/content/site";

/** Copy par route (fr/en) pour les pages statiques. Les pages de détail
 *  utilisent le titre/description du contenu DB (voir les pages `[slug]`). */
const PAGE_COPY: Record<Locale, Record<string, { title: string; description: string }>> = {
  fr: {
    services: {
      title: "Nos Expertises IA & Data | Analyticatech",
      description:
        "Quatre expertises clés empilées : Raisonnement & RAG, Automatisation & Workflows, Orchestration Multi-Agents, Data & Décision Augmentée. Chaque service livré avec méthode, sécurité et ROI mesuré.",
    },
    solutions: {
      title: "Solutions sectorielles — IA & Automatisation par métier",
      description:
        "Des solutions prêtes à adapter pour la banque, l'industrie, le retail, le secteur public et plus : agents IA, automatisation de workflows, BI et pilotage décisionnel.",
    },
    insights: {
      title: "Insights — Analyses & Ressources IA | Analyticatech",
      description:
        "Nos architectes partagent leurs analyses : patterns de production, choix d'outillage et retours d'expérience sur les missions IA, agents et automatisation.",
    },
    contact: {
      title: "Contact | Analyticatech",
      description:
        "Décrivez votre besoin. Un architecte Solution Analyticatech vous répond sous 24h ouvrées. Échanges chiffrés et confidentiels.",
    },
    confidentialite: {
      title: "Politique de confidentialité — RGPD",
      description:
        "Politique de confidentialité d'Analyticatech : données personnelles, RGPD, conservation sous 90 jours, aucune revente ni entraînement sur vos données.",
    },
    "mentions-legales": {
      title: "Mentions légales",
      description:
        "Mentions légales d'Analyticatech : éditeur du site, hébergement, propriété intellectuelle et coordonnées.",
    },
    "a-propos": {
      title: "À propos d'Analyticatech",
      description:
        "Cabinet de conseil en IA, Agents & Automatisation : mission, vision et valeurs. Du POC à la production, avec précision, sécurité et impact mesuré.",
    },
  },
  en: {
    services: {
      title: "Our AI & Data Capabilities | Analyticatech",
      description:
        "Four stacked layers of expertise: Reasoning & RAG, Automation & Workflows, Multi-Agent Orchestration, Data & Augmented Decision. Engineered for enterprise scale, security, and measurable ROI.",
    },
    solutions: {
      title: "Industry Solutions — Enterprise AI & Workflow Automation",
      description:
        "Production-ready architectures tailored for Banking & Insurance, Healthcare, Logistics, and Public Sector: autonomous agents, automated workflows, and executive BI.",
    },
    insights: {
      title: "Insights — AI Analysis & Resources | Analyticatech",
      description:
        "Senior architects share frontline analysis: production patterns, tooling trade-offs, and field-tested architecture lessons on AI and multi-agent systems.",
    },
    contact: {
      title: "Contact | Analyticatech",
      description:
        "Describe your enterprise requirements. A Senior Solutions Architect will respond within 24 business hours. End-to-end encrypted and confidential.",
    },

    confidentialite: {
      title: "Privacy Policy — GDPR Compliance",
      description:
        "Analyticatech's privacy policy: personal data protection, GDPR compliance, 90-day data retention, zero data resale or model training.",
    },
    "mentions-legales": {
      title: "Legal Notice & Corporate Information",
      description:
        "Analyticatech regulatory information: site publisher, web hosting, intellectual property, and registered company details.",
    },
    "a-propos": {
      title: "About Analyticatech — Autonomous Systems Engineering",
      description:
        "Independent AI, Multi-Agent, and Digital Transformation engineering consultancy: mission, vision, and core values. From POC to production with verifiable business impact.",
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

  return {
    title,
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
      title,
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
      title,
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