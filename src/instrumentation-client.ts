import type { PostHog } from "posthog-js";
import {
  isAnalyticsAllowed,
  type ConsentProof,
} from "@/components/branding/CookieConsent";

/**
 * Instrumentation Client PostHog (Next.js App Router).
 *
 * Principes CNIL 2026 & Sécurité :
 * - Aucun script ni appel réseau PostHog avant le consentement explicite de l'utilisateur.
 * - `opt_out_capturing_by_default: true` : aucun événement ni cookie avant accord.
 * - Reverse proxy discret : les requêtes passent par `/_edge-relay` (notre propre domaine).
 * - Autocapture désactivée : télémétrie 100% maîtrisée, typée et intentionnelle.
 * - Masquage complet du Session Replay : champs de saisie, emails et textes sensibles masqués.
 * - Élimination systématique des PII (données personnelles) dans les propriétés d'événements.
 * - Chargement différé : le SDK (`posthog-js`) n'est importé qu'après consentement
 *   et si une clé est configurée. Ce fichier étant embarqué dans le chunk `main`
 *   de Next, un import statique alourdirait chaque page de tout le SDK.
 */

/**
 * Vrai seulement si une mesure d'audience est réellement configurée. Sans clé,
 * le site ne dépose que des cookies nécessaires : aucun bandeau de
 * consentement n'est affiché pour un outil qui n'existe pas.
 */
export const isAnalyticsConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
// Événements émis pendant le chargement du SDK, rejoués une fois initialisé.
const pending: Array<(ph: PostHog) => void> = [];

/**
 * Initialise le client PostHog si et seulement si l'utilisateur a accordé son consentement
 * pour la mesure d'audience ou si l'initialisation est expressément demandée (forceInit).
 */
export function initTelemetryClient(forceInit = false): Promise<PostHog | null> | null {
  if (typeof window === "undefined") return null;

  // Règle CNIL bloquante : aucun chargement avant clic explicite
  if (!forceInit && !isAnalyticsAllowed()) {
    return null;
  }

  if (loading) return loading;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY non définie. Télémétrie en sommeil.");
    }
    return null;
  }

  // Utilisation par défaut du reverse proxy local pour contourner les bloqueurs de trackers
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/_edge-relay";

  loading = import("posthog-js")
    .then(({ default: posthog }) => {
      initPosthog(posthog, apiKey, apiHost);
      // Consentement donné à l'instant via le bandeau (pas encore persisté).
      if (forceInit) posthog.opt_in_capturing();
      client = posthog;
      for (const run of pending.splice(0)) run(posthog);
      return posthog;
    })
    .catch(() => {
      // SDK bloqué (bloqueur, réseau) : la télémétrie reste en sommeil.
      loading = null;
      pending.length = 0;
      return null;
    });
  return loading;
}

function initPosthog(posthog: PostHog, apiKey: string, apiHost: string): void {
  posthog.init(apiKey, {
    api_host: apiHost,
    ui_host: "https://eu.i.posthog.com",
    // RGPD : Bloqué par défaut tant que l'utilisateur n'a pas accepté
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
    persistence: "localStorage+cookie",
    // Contrôle fin du cycle de vie
    autocapture: false,
    capture_pageview: false, // Géré programmatiquement pour l'App Router Next.js
    capture_pageleave: true,
    // Protection de la vie privée Session Replay
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*", // Masque l'ensemble du texte saisi
      blockSelector: "[data-private], input, textarea, select",
    },
    // Filtre de sécurité anti-PII sur tous les événements
    before_send: (payload) => {
      if (payload && payload.properties) {
        delete payload.properties.email;
        delete payload.properties.user_email;
        delete payload.properties.name;
        delete payload.properties.phone;
        delete payload.properties.message;
        delete payload.properties.content;
      }
      return payload;
    },
    loaded: (ph) => {
      if (isAnalyticsAllowed()) {
        ph.opt_in_capturing();
      } else {
        ph.opt_out_capturing();
      }
    },
  });
}

/**
 * Exécute `fn` sur le client si la capture est autorisée. Pendant le chargement
 * du SDK, l'appel est mis en file et rejoué après initialisation.
 */
function withClient(fn: (ph: PostHog) => void): void {
  if (typeof window === "undefined") return;
  if (client) {
    if (client.has_opted_in_capturing()) fn(client);
    return;
  }
  if (loading) {
    pending.push((ph) => {
      if (ph.has_opted_in_capturing()) fn(ph);
    });
  }
}

// Écoute dynamique globale des décisions utilisateur sur le bandeau de consentement
if (typeof window !== "undefined") {
  window.addEventListener("at:consent-change", ((e: CustomEvent<ConsentProof | "accepted" | "refused">) => {
    const isAllowed =
      typeof e.detail === "string"
        ? e.detail === "accepted"
        : e.detail?.choices?.analytics === true;

    if (isAllowed) {
      void initTelemetryClient(true)?.then((ph) => ph?.opt_in_capturing());
    } else {
      pending.length = 0;
      client?.opt_out_capturing();
      client?.reset();
    }
  }) as EventListener);
}

/**
 * Vérifie si la capture d'événements est autorisée par l'utilisateur.
 */
export function isTelemetryActive(): boolean {
  if (typeof window === "undefined" || !client) return false;
  return client.has_opted_in_capturing();
}

/**
 * Récupère le distinct_id PostHog actuel (généré aléatoirement côté client).
 */
export function getTelemetryDistinctId(): string | null {
  if (typeof window === "undefined" || !client) return null;
  return client.get_distinct_id() || null;
}

/**
 * 1. Vue de page ($pageview)
 */
export function trackPageView(pathname: string, title?: string): void {
  withClient((ph) =>
    ph.capture("$pageview", {
      $current_url: window.location.href,
      pathname,
      title: title || document.title,
    })
  );
}

/**
 * 2. Clic sur un bouton d'action principal (CTA)
 */
export function trackCtaClick(ctaName: string, location: string, destination?: string): void {
  withClient((ph) =>
    ph.capture("cta_clicked", {
      cta_name: ctaName,
      location,
      destination: destination || null,
    })
  );
}

/**
 * 3. Soumission du formulaire de contact (ZÉRO contenu du message)
 */
export interface ContactSubmissionMeta {
  subject_length: number;
  has_company: boolean;
  locale?: string;
  reference?: string;
}

export function trackContactFormSubmitted(meta: ContactSubmissionMeta): void {
  withClient((ph) =>
    ph.capture("contact_form_submitted", {
      subject_length: meta.subject_length,
      has_company: meta.has_company,
      locale: meta.locale || "fr",
      reference: meta.reference || null,
      status: "success",
    })
  );
}

/**
 * 4. Profondeur de défilement (Scroll depth)
 */
export function trackScrollDepth(depthPercent: number, pathname: string): void {
  withClient((ph) =>
    ph.capture("scroll_depth_reached", {
      depth_percent: depthPercent,
      pathname,
    })
  );
}

/**
 * 5. Exceptions & erreurs JavaScript côté client
 */
export function trackClientException(
  error: Error | string,
  context?: { componentStack?: string; route?: string }
): void {
  const message = typeof error === "string" ? error : error.message;
  const stack = error instanceof Error ? error.stack : undefined;

  withClient((ph) =>
    ph.capture("$exception", {
      $exception_message: message,
      $exception_type: error instanceof Error ? error.name : "ClientError",
      $exception_stack_trace_raw: stack,
      route: context?.route || window.location.pathname,
      component_stack: context?.componentStack,
    })
  );
}

/**
 * 6. Identification utilisateur sécurisée
 * Exigence : jamais d'email brut comme distinct_id.
 */
export function identifyTelemetryUser(
  userHashOrId: string,
  safeProperties?: Record<string, unknown>
): void {
  if (!userHashOrId || userHashOrId.includes("@")) {
    console.warn("[PostHog] Rejet d'identification : distinct_id ne doit pas contenir d'adresse email.");
    return;
  }
  withClient((ph) => ph.identify(userHashOrId, safeProperties));
}

/**
 * 7. Réinitialisation à la déconnexion
 */
export function resetTelemetryUser(): void {
  if (typeof window === "undefined") return;
  client?.reset();
}

/**
 * Helper réservé aux tests unitaires pour réinitialiser le singleton client
 */
export function _resetClientForTesting(): void {
  client = null;
  loading = null;
  pending.length = 0;
}
