/**
 * Sanitization HTML stricte — prévention XSS.
 * Supprime balises, entités HTML dangereuses et caractères de contrôle.
 * Aucune balise n'est autorisée en entrée (stratégie "deny all").
 */

/**
 * Nettoie une chaîne en supprimant tout markup HTML potentiel.
 * - échappe <, >, &, ", '
 * - supprime les caractères de contrôle (sauf tabulation, saut de ligne)
 * - normalise les espaces
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Caractères de contrôle sauf \t \n \r
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    // Échappement HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Suppression de patterns d'injection connus (even après échappement)
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

/**
 * Sanitize un objet récursivement : strings échappées, arrays d'objets
 * traités récursivement, autres valeurs préservées.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      out[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      // Traitement récursif des arrays : strings sanitizées ET objets
      out[key] = value.map((v) => {
        if (typeof v === "string") return sanitizeText(v);
        if (v && typeof v === "object" && !Array.isArray(v)) {
          return sanitizeObject(v as Record<string, unknown>);
        }
        return v;
      });
    } else if (value && typeof value === "object") {
      out[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
