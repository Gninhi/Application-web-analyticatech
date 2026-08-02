import { db } from "@/lib/db/client";

/**
 * Détection des User-Agents suspects (scanners, outils d'attaque, bots).
 * Interroge Supabase PostgreSQL (SuspiciousUAPattern) avec fallback local.
 */
const DEFAULT_PATTERNS = [
  "sqlmap", "nikto", "nmap", "masscan", "dirb", "gobuster", "wpscan",
  "hydra", "metasploit", "burp", "owasp", "acunetix", "nessus", "zgrab",
  "semrush", "bot", "crawler", "spider", "scraper",
];

/** Retourne `true` si l'UA est suspect (à bloquer). */
export async function isSuspiciousUserAgent(ua: string | null | undefined): Promise<boolean> {
  if (!ua) return true; // Pas d'UA = suspect
  const lower = ua.toLowerCase();
  // Les navigateurs légitimes contiennent "Mozilla/5.0"
  if (!lower.includes("mozilla/5.0")) return true;

  let patterns = DEFAULT_PATTERNS;
  try {
    const dbPatterns = await db.suspiciousUAPattern.findMany({
      select: { pattern: true },
    });
    if (dbPatterns.length > 0) {
      patterns = dbPatterns.map((p) => p.pattern.toLowerCase());
    }
  } catch {
    // Fallback aux patterns par défaut en cas de déconnexion temporaire
  }

  return patterns.some((p) => lower.includes(p));
}

/** Vérifie que la taille d'une requête ne dépasse pas un seuil (anti-DoS). */
export function isRequestSizeValid(req: Request, maxBytes = 16384): boolean {
  const contentLength = req.headers.get("content-length");
  if (!contentLength) return true;
  const size = parseInt(contentLength, 10);
  if (isNaN(size)) return false;
  return size <= maxBytes;
}
