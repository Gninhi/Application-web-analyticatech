import { timingSafeEqual as tsEqual } from "crypto";

/**
 * Utilitaires CSRF — double-submit cookie pattern.
 *
 * Le token du cookie doit correspondre à celui du header.
 * Comparaison temps-constant pour éviter les attaques par timing.
 *
 * La génération du token est assurée par `proxy.ts` (Edge Runtime).
 */

/** Comparaison temps-constant (cryptographique) — protection timing attack. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return tsEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Valide un token CSRF côté serveur (double-submit pattern).
 * Le token du cookie doit correspondre à celui du header.
 */
export function validateCsrfToken(
  cookieToken: string | null | undefined,
  headerToken: string | null | undefined
): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;
  return constantTimeEqual(cookieToken, headerToken);
}
