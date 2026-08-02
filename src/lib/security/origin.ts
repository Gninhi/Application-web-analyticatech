/**
 * Vérification d'origine (anti-CSRF origin check layer supplémentaire).
 * Accepte soit l'en-tête `Origin`, soit le `Referer` comme fallback.
 */
export function isOriginAllowed(req: Request, allowedOrigins: string[]): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const source = origin || referer;
  if (!source) return false;
  try {
    const url = new URL(source);
    return allowedOrigins.some(
      (allowed) => url.origin === allowed || url.hostname === new URL(allowed).hostname
    );
  } catch {
    return false;
  }
}
