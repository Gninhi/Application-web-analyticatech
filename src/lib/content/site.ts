/**
 * Constantes centralisées du projet Analyticatech.
 * Évite la duplication de URLs, durées, seuils et configurations.
 */

import type { SiteConfigDTO } from "@/types/content";

export const SITE_CONFIG = {
  name: "Analyticatech",
  url: "https://analyticatech.fr",
  email: "contact@analyticatech.fr",
  phone: "+33 1 84 80 00 00",
  phoneHref: "tel:+33184800000",
  address: {
    street: "12 rue de la Paix",
    city: "Paris",
    postalCode: "75002",
    country: "France",
    countryCode: "FR",
  },
  social: {
    linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
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
  socialLinkedin: SITE_CONFIG.social.linkedin,
  socialTwitter: SITE_CONFIG.social.twitter,
  socialGithub: SITE_CONFIG.social.github,
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
