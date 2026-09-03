import { PostHog } from "posthog-node";

/**
 * Singleton serveur PostHog pour environnements serverless (Next.js / Vercel).
 *
 * Règles strictes :
 * 1. Clé API et Host lus depuis les variables d'environnement (jamais en dur).
 * 2. Flush immédiat (`flushAt: 1`, `flushInterval: 0`) et `shutdown()` systématique
 *    pour garantir l'envoi avant que le thread serverless ne soit mis en sommeil.
 * 3. Rejet catégorique de `distinct_id === "anonymous"` (exigence RGPD & traçabilité).
 */

interface ServerCaptureParams {
  /** Identifiant stable du visiteur (ID session, fingerprint hashé ou ID PostHog client). Jamais "anonymous" ni un email brut. */
  distinctId: string;
  /** Nom explicite de l'événement produit */
  event: string;
  /** Propriétés additionnelles (sanitisées, sans PII) */
  properties?: Record<string, unknown>;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties = {},
}: ServerCaptureParams): Promise<void> {
  const apiKey = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PostHog Server] Clé API absente. Événement ignoré : "${event}"`);
    }
    return;
  }

  // RGPD & Qualité : interdiction formelle du distinct_id générique "anonymous"
  if (!distinctId || distinctId.trim() === "" || distinctId.toLowerCase() === "anonymous") {
    console.warn(
      `[PostHog Server] Événement "${event}" rejeté : le distinct_id doit être un identifiant de session ou un hash non-vide (pas "anonymous").`
    );
    return;
  }

  // Assurer la non-transmission de données personnelles en clair
  const safeProperties = { ...properties };
  delete safeProperties.email;
  delete safeProperties.user_email;
  delete safeProperties.name;
  delete safeProperties.phone;
  delete safeProperties.message;
  delete safeProperties.content;

  const host =
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://eu.i.posthog.com";

  // Instance éphémère configurée pour un flush immédiat serverless
  const posthog = new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    posthog.capture({
      distinctId,
      event,
      properties: {
        ...safeProperties,
        $lib: "posthog-node-serverless",
        environment: process.env.NODE_ENV,
      },
    });

    // Attente du flush complet et arrêt du client pour éviter les pertes d'événements
    await posthog.shutdown();
  } catch (error) {
    console.error(`[PostHog Server] Erreur lors de la capture de l'événement "${event}":`, error);
  }
}
