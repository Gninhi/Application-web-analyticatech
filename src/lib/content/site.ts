/**
 * Constantes centralisées du projet Analyticatech.
 * Évite la duplication de URLs, durées, seuils et configurations.
 */

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

export const CONTACT_INFO = {
  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,
  phoneHref: SITE_CONFIG.phoneHref,
  address: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.postalCode} ${SITE_CONFIG.address.city}`,
} as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", url: SITE_CONFIG.social.linkedin, icon: "Linkedin" },
  { label: "Twitter / X", url: SITE_CONFIG.social.twitter, icon: "Twitter" },
  { label: "GitHub", url: SITE_CONFIG.social.github, icon: "Github" },
] as const;

// Seuils de scroll pour Navbar auto-hide et BackToTop
export const SCROLL_THRESHOLDS = {
  glassEffect: 16,    // px avant d'activer le glass sur la navbar
  autoHide: 120,      // px avant d'activer l'auto-hide
  scrollDelta: 6,     // delta min pour détecter la direction
  backToTop: 600,     // px avant d'afficher le bouton retour-haut
} as const;

// Durées d'animation (ms) pour cohérence globale
export const ANIMATION_DURATIONS = {
  pageTransition: 350,
  themeTransition: 300,
  marqueeSlow: 50,
  marqueeMedium: 35,
  marqueeFast: 25,
  loaderProgress: 1800,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  contact: { limit: 5, windowMs: 60 * 60 * 1000 }, // 5 req/h
} as const;

// Body size max pour les POST
export const MAX_BODY_SIZE = 16384; // 16 KB
