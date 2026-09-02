import type { ViewKey, Locale } from "@/types/content";

/**
 * Mapping centralisé des vues SPA historiques vers de vraies routes App Router.
 *
 * La conversion en routes réelles (/services, /solutions, /insights, …) rend
 * chaque page deep-linkable, partageable et indexable avec un meta par page.
 * Les composants continuent d'utiliser la clé ViewKey : `viewToPath` fait le
 * pont vers l'URL, `pathToView` restitue la vue active depuis le pathname
 * (état actif du menu).
 */
export const STATIC_VIEW_PATHS: Partial<Record<ViewKey, string>> = {
  home: "/",
  services: "/services",
  solutions: "/solutions",
  blog: "/insights",
  contact: "/contact",
  rgpd: "/confidentialite",
  legal: "/mentions-legales",
  about: "/a-propos",
};

/** Extrait la locale depuis un pathname. */
export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** Convertis une clé de vue (et éventuellement un identifiant de détail) en chemin selon la locale. */
export function viewToPath(view: ViewKey, id?: string, locale: Locale = "fr"): string {
  const base = STATIC_VIEW_PATHS[view];
  const prefix = locale === "en" ? "/en" : "";

  if (base) {
    if (base === "/") return prefix || "/";
    return `${prefix}${base}`;
  }

  const slug = id ? encodeURIComponent(id) : "";
  if (view === "service-detail") return `${prefix}/services/${slug}`;
  if (view === "solution-detail") return `${prefix}/solutions/${slug}`;
  if (view === "blog-detail") return `${prefix}/insights/${slug}`;
  return prefix || "/";
}

/** Détermine la vue correspondant à un pathname (segment racine significatif, ignorant /en). */
export function pathToView(pathname: string): ViewKey {
  const cleanPath = pathname.replace(/^\/en(\/|$)/, "/");
  const segment = cleanPath.split("/").filter(Boolean)[0] ?? "";
  switch (segment) {
    case "services":
      return "services";
    case "solutions":
      return "solutions";
    case "insights":
      return "blog";
    case "contact":
      return "contact";
    case "confidentialite":
    case "privacy":
      return "rgpd";
    case "mentions-legales":
    case "legal-notice":
      return "legal";
    case "a-propos":
    case "about":
      return "about";
    default:
      return "home";
  }
}

/**
 * getAlternatePath — calcule de manière déterministe l'URL exacte dans l'autre langue.
 *
 * Exemples :
 *  - `/services/01` (cible: "en") ➔ `/en/services/01`
 *  - `/en/services/01` (cible: "fr") ➔ `/services/01`
 *  - `/solutions/finance-agent` (cible: "en") ➔ `/en/solutions/finance-agent`
 *  - `/en/solutions/finance-agent` (cible: "fr") ➔ `/solutions/finance-agent`
 *  - `/contact` (cible: "en") ➔ `/en/contact`
 *  - `/` (cible: "en") ➔ `/en`
 *  - `/en` (cible: "fr") ➔ `/`
 */
export function getAlternatePath(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(pathname);
  if (currentLocale === targetLocale) return pathname;

  if (targetLocale === "en") {
    if (pathname === "/" || pathname === "") return "/en";
    // Mappe les éventuels alias
    if (pathname === "/about") return "/en/a-propos";
    if (pathname === "/privacy") return "/en/confidentialite";
    if (pathname === "/legal-notice") return "/en/mentions-legales";
    return `/en${pathname}`;
  }

  // targetLocale === "fr"
  if (pathname === "/en" || pathname === "/en/") return "/";
  const withoutEn = pathname.replace(/^\/en/, "");
  return withoutEn || "/";
}