import { z } from "zod";

/**
 * Validation centralisée des variables d'environnement (côté serveur).
 *
 * Stratégie tolérante par champ :
 *  - chaque variable est validée indépendamment ; les variables valides sont
 *    conservées, les invalides sont signalées en warning (jamais de
 *    tout-ou-rien qui casserait l'app pour une seule variable mal formatée) ;
 *  - seules les variables CRITIQUES (`DATABASE_URL`, et `IP_SALT` en
 *    production) déclenchent un échec rapide si absentes/invalides ;
 *  - les autres consommateurs ont leurs propres fallbacks (mailer, origins,
 *    fingerprint...) — ils tolèrent l'absence.
 * Les variables publiques (NEXT_PUBLIC_*) sont gérées séparément (env-public).
 */

const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  DATABASE_SSL: z.enum(["true", "false"]).optional(),
  IP_SALT: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_TO: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

/** Clés dont l'absence/invalidité est fatale (l'app ne peut pas tourner sans). */
const CRITICAL_KEYS: ReadonlyArray<keyof ServerEnv> = ["DATABASE_URL"];

let cached: Partial<ServerEnv> | null = null;

/**
 * Valide chaque clé indépendamment. Retourne les valeurs valides et logue les
 * invalides. En production, throw si une clé critique est manquante/invalide.
 */
function parse(): Partial<ServerEnv> {
  const result: Partial<ServerEnv> = {};
  const problems: string[] = [];
  const isProd = process.env.NODE_ENV === "production";

  for (const key of Object.keys(ServerEnvSchema.shape) as Array<keyof ServerEnv>) {
    const field = ServerEnvSchema.shape[key];
    const raw = process.env[key];
    const checked = field.safeParse(raw);

    if (checked.success) {
      (result as Record<string, unknown>)[key] = checked.data;
      continue;
    }

    const label = `[env] ${String(key)} invalide`;
    if (isProd && (CRITICAL_KEYS.includes(key) || (key === "IP_SALT" && !raw))) {
      problems.push(`${label}: ${checked.error.issues[0]?.message ?? "manquante"}`);
    } else {
      console.warn(`${label} — ignorée (fallback côté consommateur)`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Variables critiques manquantes en production: ${problems.join("; ")}`);
  }

  return result;
}

/** Accès validé (et mis en cache) aux variables serveur. */
export function getServerEnv(): Partial<ServerEnv> {
  cached ??= parse();
  return cached;
}

/** Exige une variable en production, renvoie "" hors production. */
export function requireServerEnv(key: keyof ServerEnv): string {
  const value = getServerEnv()[key];
  if (value !== undefined && value !== "") return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`[env] Variable requise manquante en production: ${String(key)}`);
  }
  return "";
}