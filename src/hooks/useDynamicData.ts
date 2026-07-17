"use client";

import { useState, useEffect } from "react";

/**
 * useDynamicData — hook pour récupérer les données dynamiques (métriques, clients).
 * Fetch côté client avec cache mémoire pour éviter les re-renders inutiles.
 */

interface Metric {
  key: string;
  label: string;
  value: string;
  suffix: string;
}

interface Client {
  name: string;
  sector: string;
}

interface DynamicData {
  metrics: Metric[];
  clients: Client[];
  loading: boolean;
  error: string | null;
}

// Cache mémoire global (évite les re-fetchs sur navigation)
let metricsCache: Metric[] | null = null;
let clientsCache: Client[] | null = null;

export function useDynamicData(): DynamicData {
  const [metrics, setMetrics] = useState<Metric[]>(metricsCache ?? []);
  const [clients, setClients] = useState<Client[]>(clientsCache ?? []);
  const [loading, setLoading] = useState(!metricsCache || !clientsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const promises: Promise<unknown>[] = [];

        if (!metricsCache) {
          promises.push(
            fetch("/api/metrics")
              .then((r) => r.json())
              .then((data) => {
                if (data.success && !cancelled) {
                  metricsCache = data.metrics;
                  setMetrics(data.metrics);
                }
              })
          );
        }

        if (!clientsCache) {
          promises.push(
            fetch("/api/clients")
              .then((r) => r.json())
              .then((data) => {
                if (data.success && !cancelled) {
                  clientsCache = data.clients;
                  setClients(data.clients);
                }
              })
          );
        }

        if (promises.length > 0) {
          await Promise.all(promises);
          if (!cancelled) setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement");
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { metrics, clients, loading, error };
}
