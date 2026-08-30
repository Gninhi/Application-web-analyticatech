import "server-only";

/**
 * Vérification d'origine stricte (anti-CSRF origin check layer supplémentaire).
 * Vérifie l'origine exacte (protocole + nom d'hôte + port) par rapport à l'allowlist.
 * Accepte soit l'en-tête `Origin`, soit le `Referer` comme fallback si `Origin` est absent.
 */
export function isOriginAllowed(req: Request, allowedOrigins: string[]): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const source = origin || referer;
  if (!source) return false;

  try {
    const url = new URL(source);
    const normalizedSourceOrigin = url.origin.toLowerCase();

    return allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed);
        return normalizedSourceOrigin === allowedUrl.origin.toLowerCase();
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}
