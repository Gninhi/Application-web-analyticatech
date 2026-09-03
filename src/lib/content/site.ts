/**
 * Constantes centralisées du projet Analyticatech.
 * Évite la duplication de URLs, durées, seuils et configurations.
 */

import type { SiteConfigDTO } from "@/types/content";

/**
 * Valide si une URL de réseau social correspond à un profil/compte réel
 * et non à un nom de domaine racine générique sans identifiant ou une valeur vide.
 */
export function isValidSocialUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return false;
  // Exclure les domaines racines génériques sans handle/profil
  const genericRoots = [
    "https://linkedin.com",
    "https://www.linkedin.com",
    "http://linkedin.com",
    "http://www.linkedin.com",
    "https://twitter.com",
    "https://www.twitter.com",
    "http://twitter.com",
    "http://www.twitter.com",
    "https://x.com",
    "https://www.x.com",
    "http://x.com",
    "http://www.x.com",
    "https://github.com",
    "https://www.github.com",
    "http://github.com",
    "http://www.github.com",
  ];
  const normalized = trimmed.replace(/\/+$/, "");
  return !genericRoots.includes(normalized);
}

export const SITE_CONFIG = {
  name: "Analyticatech",
  url: "https://analyticatech.fr",
  email: "contact@analyticatech.fr",
  phone: "+33 7 68 61 13 10",
  phoneHref: "tel:+33768611310",
  address: {
    street: "60 rue François 1er",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    countryCode: "FR",
  },
  social: {
    linkedin:
      process.env.SOCIAL_LINKEDIN_URL ||
      process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL ||
      "https://www.linkedin.com/company/102606877",
    twitter:
      process.env.SOCIAL_TWITTER_URL ||
      process.env.NEXT_PUBLIC_SOCIAL_TWITTER_URL ||
      "",
    github:
      process.env.SOCIAL_GITHUB_URL ||
      process.env.NEXT_PUBLIC_SOCIAL_GITHUB_URL ||
      "",
  },
} as const;

/**
 * Configuration éditoriale centralisée pour les articles et analyses sur /insights.
 * Permet de définir l'auteur réel (ou "Équipe Analyticatech") en un seul endroit.
 */
export const BLOG_CONFIG = {
  defaultAuthor:
    process.env.BLOG_DEFAULT_AUTHOR ||
    process.env.NEXT_PUBLIC_BLOG_DEFAULT_AUTHOR ||
    "Martial GNINHI",
  overrideAllAuthors: true,
} as const;

/** Config site de repli typée — source unique de vérité (miroir de SITE_CONFIG). */
export const DEFAULT_SITE_CONFIG: SiteConfigDTO = {
  siteName: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,
  phoneHref: SITE_CONFIG.phoneHref,
  streetAddress: SITE_CONFIG.address.street,
  city: SITE_CONFIG.address.city,
  postalCode: SITE_CONFIG.address.postalCode,
  country: SITE_CONFIG.address.country,
  countryCode: SITE_CONFIG.address.countryCode,
  socialLinkedin: isValidSocialUrl(SITE_CONFIG.social.linkedin) ? SITE_CONFIG.social.linkedin : null,
  socialTwitter: isValidSocialUrl(SITE_CONFIG.social.twitter) ? SITE_CONFIG.social.twitter : null,
  socialGithub: isValidSocialUrl(SITE_CONFIG.social.github) ? SITE_CONFIG.social.github : null,
  geoLat: 48.8688,
  geoLng: 2.3314,
};

// Seuils de scroll pour Navbar auto-hide et BackToTop
export const SCROLL_THRESHOLDS = {
  glassEffect: 16,    // px avant d'activer le glass sur la navbar
  autoHide: 120,      // px avant d'activer l'auto-hide
  scrollDelta: 6,     // delta min pour détecter la direction
  backToTop: 600,     // px avant d'afficher le bouton retour-haut
} as const;

// Body size max pour les POST
export const MAX_BODY_SIZE = 16384; // 16 KB
