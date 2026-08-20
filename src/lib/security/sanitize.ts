import "server-only";

/**
 * Sanitization HTML stricte — prévention XSS.
 * Supprime balises, entités HTML dangereuses et caractères de contrôle.
 * Aucune balise n'est autorisée en entrée (stratégie "deny all").
 *
 * NOTE : cette fonction est un correctif de premier ordre pour les champs texte
 * arbitraires. Elle ne remplace pas une lib dédiée (DOMPurify / sanitize-html)
 * pour les contenus riches où certaines balises sont autorisées.
 */

const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const JAVASCRIPT_SCHEME_RE = /javascript:/gi;
const DATA_HTML_RE = /data:text\/html/gi;
const EVENT_HANDLER_RE = /\son\w+\s*=/gi;
const SCRIPT_TAG_RE = /<\/?\s*script[^>]*>/gi;

// Entités HTML d'échappement — via codes pour éviter que les entités écrites
// dans le source soient elles-mêmes décodées par l'outil d'écriture.
const AMP = String.fromCharCode(38) + "amp;";       // &
const LT = String.fromCharCode(38) + "lt;";         // <
const GT = String.fromCharCode(38) + "gt;";         // >
const QUOT = String.fromCharCode(38) + "quot;";     // "
const APOS = String.fromCharCode(38) + "#x27;";     // &#x27;

/** Échappement HTML : convertir les 5 caractères sensibles en entités. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, AMP)
    .replace(/</g, LT)
    .replace(/>/g, GT)
    .replace(/"/g, QUOT)
    .replace(/'/g, APOS);
}

/**
 * Nettoie une chaîne en supprimant tout markup HTML potentiel.
 * - supprime les caractères de contrôle (sauf \t \n \r)
 * - supprime les schémas dangereux + balises script
 * - supprime les gestionnaires d'événements inline (on*=)
 * - échappe ensuite les caractères HTML
 * - normalise les espaces (trim)
 */
function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  const cleaned = input
    .replace(CONTROL_CHARS_RE, "")
    .replace(SCRIPT_TAG_RE, "")
    .replace(JAVASCRIPT_SCHEME_RE, "")
    .replace(DATA_HTML_RE, "")
    .replace(EVENT_HANDLER_RE, "");

  return escapeHtml(cleaned).trim();
}

/** Sanitize un objet récursivement en ne traitant que les chaînes. */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      out[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map((v) => (typeof v === "string" ? sanitizeText(v) : v));
    } else if (value && typeof value === "object") {
      out[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
