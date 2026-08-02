/**
 * Rate limiting en mémoire (par IP + endpoint).
 * Adapté à un déploiement mono-instance.
 *
 * NOTE : pour un déploiement multi-instances, brancher un store Redis.
 */

interface RateBucket {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  /** Nombre max de requêtes sur la fenêtre. */
  limit: number;
  /** Fenêtre en ms. */
  windowMs: number;
}

const buckets = new Map<string, RateBucket>();

// Nettoyage périodique des buckets expirés (toutes les 5 min)
let lastCleanup = Date.now();
function cleanupIfNeeded() {
  const now = Date.now();
  if (now - lastCleanup > 5 * 60 * 1000) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
    lastCleanup = now;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Vérifie et consomme un token de rate limit.
 * Retourne `allowed: false` si la limite est atteinte.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupIfNeeded();
  const now = Date.now();
  const key = identifier;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, resetAt: now + config.windowMs };
  }

  if (existing.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Récupère l'IP cliente de manière fiable (Headers standards + fallback). */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
