/**
 * Date de dernière révision des mentions légales et de la politique de
 * confidentialité. À mettre à jour à chaque modification réelle de ces textes
 * (et jamais calculée à l'affichage : une date qui change à chaque visite
 * ne renseigne pas le lecteur).
 */
export const LEGAL_LAST_UPDATED = "2026-11-02";

export function formatLegalDate(locale: string): string {
  return new Date(`${LEGAL_LAST_UPDATED}T12:00:00Z`).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Paris",
  });
}
