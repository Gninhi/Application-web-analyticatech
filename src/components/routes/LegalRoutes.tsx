"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { LegalView } from "@/components/sections/LegalView";

/** Route "/confidentialite" — Politique de confidentialité (RGPD). */
export function LegalRgpdRoute() {
  const { handleNavigate } = useViewNavigation();
  return <LegalView type="rgpd" onNavigate={handleNavigate} />;
}

/** Route "/mentions-legales" — Mentions légales. */
export function LegalMentionsRoute() {
  const { handleNavigate } = useViewNavigation();
  return <LegalView type="legal" onNavigate={handleNavigate} />;
}