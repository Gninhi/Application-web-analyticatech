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
      title: "Services — Conseil en IA, Agents & Automatisation",
      description:
        "Cinq couches d'expertise empilées : IA & LLM, Transformation Digitale, Automatisation, Business Intelligence et Agents. Chaque service livré avec méthode, sécurité et ROI mesuré.",
    },
    solutions: {
      title: "Solutions sectorielles — IA & Automatisation par métier",
      description:
        "Des solutions prêtes à adapter pour la banque, l'industrie, le retail, le secteur public et plus : agents IA, automatisation de workflows, BI et transformation digitale.",
    },
    insights: {
      title: "Insights — Rapports techniques & retours de terrain",
      description:
        "Nos architectes partagent leurs analyses : patterns de production, choix d'outillage et leçons apprises sur les missions IA et automatisation.",
    },
    contact: {
      title: "Contact — Établissons une connexion sécurisée",
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
        "Cabinet de conseil en IA, Transformation Digitale et Automatisation : mission, vision et valeurs. Du POC à la production, avec précision, sécurité et impact mesurable.",
    },
  },
  en: {
    services: {
      title: "Services — AI, Agents & Automation Consulting",
      description:
        "Five stacked layers of expertise: AI & LLM, Digital Transformation, Automation, Business Intelligence and Agents. Every service delivered with method, security and measurable ROI.",
    },
    solutions: {
      title: "Industry Solutions — AI & Automation by sector",
      description:
        "Ready-to-adapt solutions for banking, industry, retail, public sector and more: AI agents, workflow automation, BI and digital transformation.",
    },
    insights: {
      title: "Insights — Technical reports & field feedback",
      description:
        "Our architects share their analysis: production patterns, tooling choices and lessons learned on AI and automation missions.",
    },
    contact: {
      title: "Contact — Let's establish a secure connection",
      description:
        "Describe your needs. An Analyticatech Solution Architect will respond within 24 business hours. Encrypted, confidential exchanges.",
    },
    confidentialite: {
      title: "Privacy Policy — GDPR",
      description:
        "Analyticatech's privacy policy: personal data, GDPR, 90-day retention, no resale and no training on your data.",
    },
    "mentions-legales": {
      title: "Legal notice",
      description:
        "Analyticatech legal notice: site publisher, hosting, intellectual property and contact details.",
    },
    "a-propos": {
      title: "About Analyticatech",
      description:
        "Consulting firm in AI, Digital Transformation and Automation: mission, vision and values. From POC to production, with precision, security and measurable impact.",
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
 * Construit les métadonnées d'une page secondaire : canonical propre à l'URL,
 * Open Graph / Twitter cohérents, image OG issue de la DB (ou repli og-image.jpg).
 * Les mots-clés et le template de titre proviennent du layout racine.
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

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: site.siteName,
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
  const path = STATIC_ROUTE_PATHS[routeKey];
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