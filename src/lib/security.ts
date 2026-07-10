import { createHash, randomBytes } from "crypto";

/**
 * Sécurité niveau bancaire — utilitaires crypto.
 *
 * Implémente :
 *  - Génération de tokens CSRF (double-submit cookie pattern)
 *  - Fingerprinting de requêtes (IP + UA + accept-language hash)
 *  - Détection d'anomalies (UA suspects, payloads malformés)
 *  - Validation de tokens CSRF
 */

const CSRF_COOKIE_NAME = "at-csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Génère un token CSRF cryptographiquement sûr (32 bytes → base64url).
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Valide un token CSRF côté serveur (double-submit pattern).
 * Le token du cookie doit correspondre à celui du header.
 */
export function validateCsrfToken(cookieToken: string | null, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken) return false;
  // Comparaison temps-constant pour éviter les timing attacks
  if (cookieToken.length !== headerToken.length) return false;
  return timingSafeEqual(cookieToken, headerToken);
}

/**
 * Comparaison temps-constant (protection timing attack).
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Empreinte numérique d'une requête pour détecter les abus
 * (IP + User-Agent + Accept-Language hashés ensemble).
 * Non-réversible, ne stocke pas de PII.
 */
export function getRequestFingerprint(req: Request): string {
  const ip = req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  const lang = req.headers.get("accept-language") || "unknown";
  const salt = process.env.IP_SALT ?? "analyticatech-v2";
  const data = `${ip}|${ua}|${lang}|${salt}`;
  return createHash("sha256").update(data).digest("hex").slice(0, 16);
}

/**
 * Détecte les User-Agents suspects (bots connus, scanners, outils d'attaque).
 * Retourne true si l'UA est suspect.
 */
export function isSuspiciousUserAgent(ua: string | null): boolean {
  if (!ua) return true; // Pas d'UA = suspect
  const lower = ua.toLowerCase();
  const SUSPICIOUS_PATTERNS = [
    "sqlmap",
    "nikto",
    "nmap",
    "masscan",
    "dirb",
    "gobuster",
    "wpscan",
    "hydra",
    "metasploit",
    "burp",
    "owasp",
    "acunetix",
    "nessus",
    "zgrab",
    "semrush",
    "bot",
    "crawler",
    "spider",
    "scraper",
  ];
  // Les navigateurs légitimes contiennent "Mozilla/5.0"
  if (!lower.includes("mozilla/5.0")) return true;
  return SUSPICIOUS_PATTERNS.some((p) => lower.includes(p));
}

/**
 * Valide la taille d'une requête (anti-DoS, anti-oversized payload).
 */
export function isRequestSizeValid(req: Request, maxBytes = 16384): boolean {
  const contentLength = req.headers.get("content-length");
  if (!contentLength) return true; // Pas d'info = on laisse passer (le body sera lu plus tard)
  const size = parseInt(contentLength, 10);
  if (isNaN(size)) return false;
  return size <= maxBytes;
}

/**
 * Vérifie l'origine de la requête (anti-CSRF origin check).
 */
export function isOriginAllowed(req: Request, allowedOrigins: string[]): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  // Pour les requêtes same-origin, l'Origin peut être absente (navigateurs anciens)
  // mais le Referer doit être présent et correspondre
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

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
