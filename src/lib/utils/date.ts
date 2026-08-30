/**
 * Utilitaire de formatage de date centralisé et résilient pour l'ensemble du site.
 * Supporte le français (fr) et l'anglais (en).
 */

export function formatPostDate(isoString: string, locale: string = "fr"): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}
