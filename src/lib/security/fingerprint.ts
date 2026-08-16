import { createHash } from "crypto";

/**
 * Empreinte numérique d'une requête (IP + UA + Accept-Language hashés).
 * Non-réversible, ne stocke pas de PII.
 *
 * En production, `IP_SALT` DOIT être défini (16+ caractères aléatoires).
 */

/** Récupère le sel IP depuis l'env. Rejette (prod) ou fallback (dev) si absent. */
function getIpSalt(): string {
  const salt = process.env.IP_SALT;
  if (salt && salt.length >= 16) return salt;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "IP_SALT manquant ou trop court en production. Définir une valeur aléatoire de 32+ caractères."
    );
  }
  return "dev-only-insecure-salt";
}

/**
 * Récupère l'IP cliente en priorisant les en-têtes non-spoofables par le client
 * (`x-forwarded-for` posé par le proxy/CDN). Les en-têtes `x-real-ip` ou
 * `cf-connecting-ip` sont acceptés uniquement comme fallback : un client ne
 * peut pas les forger côté navigateur, mais ils peuvent être absents.
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Construit un fingerprint hashé pour identifier une requête de manière
 * stable sans stocker de PII. Utilisé pour le rate-limiting par bucket.
 */
export function getRequestFingerprint(req: Request): string {
  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent") || "unknown";
  const lang = req.headers.get("accept-language") || "unknown";
  const salt = getIpSalt();
  return createHash("sha256")
    .update(`${ip}|${ua}|${lang}|${salt}`)
    .digest("hex")
    .slice(0, 16);
}
