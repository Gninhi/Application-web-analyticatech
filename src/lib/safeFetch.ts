/**
 * safeFetch — utilitaire de récupération réseau robuste.
 * Gère les timeouts, les retries exponentiels et la normalisation des erreurs.
 * Inspiré des standards "niveau bancaire" requis par Analyticatech.
 */

export class FetchError extends Error {
  readonly status: number;
  readonly url: string;
  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.url = url;
  }
}

interface SafeFetchOptions extends RequestInit {
  /** Délai d'attente maximal en ms (défaut : 8000). */
  timeoutMs?: number;
  /** Nombre de tentatives en cas d'échec réseau (défaut : 2). */
  retries?: number;
}

/**
 * Effectue une requête fetch avec timeout et retries.
 * @throws {FetchError} si la requête échoue définitivement.
 */
export async function safeFetch<T = unknown>(
  input: string,
  options: SafeFetchOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, retries = 2, ...init } = options;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // AbortController pour le timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(input, {
        ...init,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
      });

      clearTimeout(timer);

      // Lecture du corps (potentiellement vide)
      const text = await res.text();
      const data: unknown = text ? JSON.parse(text) : null;

      if (!res.ok) {
        const message =
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? `HTTP ${res.status}`;
        throw new FetchError(message, res.status, input);
      }

      return data as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;

      // Ne pas retry sur les erreurs client 4xx (sauf 429 trop de requêtes)
      if (err instanceof FetchError && err.status >= 400 && err.status < 500 && err.status !== 429) {
        throw err;
      }

      // Backoff exponentiel avant la prochaine tentative
      if (attempt < retries) {
        const delay = Math.min(1000 * 2 ** attempt, 4000);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new FetchError("safeFetch: échec définitif de la requête", 0, input);
}
