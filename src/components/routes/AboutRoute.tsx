"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { AboutView } from "@/components/sections/AboutView";

/** Route "/a-propos" — vue À propos. Navigation router-backed. */
export function AboutRoute() {
  const { handleNavigate } = useViewNavigation();
  return <AboutView onNavigate={handleNavigate} />;
}