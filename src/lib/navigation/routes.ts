import type { ViewKey } from "@/types/content";

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

/** Convertis une clé de vue (et éventuellement un identifiant de détail) en chemin. */
export function viewToPath(view: ViewKey, id?: string): string {
  const base = STATIC_VIEW_PATHS[view];
  if (base) return base;
  const slug = id ? encodeURIComponent(id) : "";
  if (view === "service-detail") return `/services/${slug}`;
  if (view === "solution-detail") return `/solutions/${slug}`;
  if (view === "blog-detail") return `/insights/${slug}`;
  return "/";
}

/** Détermine la vue correspondant à un pathname (segment racine significatif). */
export function pathToView(pathname: string): ViewKey {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
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
      return "rgpd";
    case "mentions-legales":
      return "legal";
    case "a-propos":
      return "about";
    default:
      return "home";
  }
}