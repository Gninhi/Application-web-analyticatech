import "server-only";

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
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (isNaN(size)) return false;
    return size <= maxBytes;
  }
  // Absence de content-length = corps chunked → on ne peut pas valider la
  // taille à l'avance. L'appelant DOIT alors lire le corps avec un plafond
  // (voir readBodyWithLimit) ; considérer le check statique comme non concluant.
  return true;
}

/**
 * Lit le corps d'une requête en stream avec un plafond de taille (anti-DoS).
 * Retourne la chaîne JSON si la taille reste sous `maxBytes`, sinon `null`
 * (appelant → 413). Bloque les corps chunked sans content-length qui
 * contourneraient `isRequestSizeValid`.
 */
export async function readBodyWithLimit(
  req: Request,
  maxBytes = 16384
): Promise<string | null> {
  const reader = req.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    }
  } catch {
    return null;
  }

  const encoder = new TextDecoder();
  const body = chunks.reduce(
    (acc, chunk) => acc + encoder.decode(chunk, { stream: true }),
    ""
  );
  return body + encoder.decode();
}
