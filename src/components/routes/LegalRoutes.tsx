"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { LegalView } from "@/components/sections/LegalView";
import { MentionsLegalesView } from "@/components/sections/MentionsLegalesView";

/** Route "/confidentialite" — Politique de confidentialité (RGPD). */
export function LegalRgpdRoute() {
  const { handleNavigate } = useViewNavigation();
  return <LegalView type="rgpd" onNavigate={handleNavigate} />;
}

/** Route "/mentions-legales" — Mentions légales conformes article 6-III LCEN. */
export function LegalMentionsRoute() {
  const { handleNavigate } = useViewNavigation();
  return <MentionsLegalesView onNavigate={handleNavigate} />;
}