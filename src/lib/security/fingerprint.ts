import "server-only";

import { createHash } from "crypto";
import { getServerEnv } from "@/lib/env";
import { getClientIp } from "@/lib/security/rate-limit";

/**
 * Empreinte numérique d'une requête (IP + sel, hashés).
 * Non-réversible, ne stocke pas de PII.
 *
 * IMPORTANT : le fingerprint est volontairement limité à l'IP (+ sel).
 * User-Agent et Accept-Language sont entièrement contrôlés par le client :
 * les inclure permettrait à un attaquant de changer de bucket à chaque
 * requête et de contourner le rate-limiting. L'IP (posée par le proxy/CDN
 * via `x-forwarded-for`) est le seul signal non-spoofable côté navigateur.
 *
 * En production, `IP_SALT` DOIT être défini (16+ caractères aléatoires).
 */

/** Récupère le sel IP depuis l'env. Rejette (prod) ou fallback (dev) si absent. */
function getIpSalt(): string {
  const salt = getServerEnv().IP_SALT;
  if (salt && salt.length >= 16) return salt;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "IP_SALT manquant ou trop court en production. Définir une valeur aléatoire de 32+ caractères."
    );
  }
  return "dev-only-insecure-salt";
}

/**
 * Construit un fingerprint hashé pour identifier une requête de manière
 * stable sans stocker de PII. Utilisé pour le rate-limiting par bucket.
 */
export function getRequestFingerprint(req: Request): string {
  const ip = getClientIp(req);
  const salt = getIpSalt();
  return createHash("sha256")
    .update(`${ip}|${salt}`)
    .digest("hex")
    .slice(0, 16);
}
