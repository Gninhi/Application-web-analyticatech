"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ViewKey } from "@/types/content";
import { viewToPath } from "./routes";

/**
 * Hook de navigation pour les vues : convertit les callbacks `onNavigate` /
 * `onNavigateDetail` historiques en vraies transitions de route App Router.
 * `router.push` déclenche le chargement du chunk de la page cible (code
 * splitting par route) et le scroll en haut par défaut.
 */
export function useViewNavigation() {
  const router = useRouter();

  const handleNavigate = useCallback(
    (next: ViewKey) => {
      router.push(viewToPath(next));
    },
    [router]
  );

  const handleNavigateDetail = useCallback(
    (next: ViewKey, id: string) => {
      router.push(viewToPath(next, id));
    },
    [router]
  );

  return { handleNavigate, handleNavigateDetail };
}