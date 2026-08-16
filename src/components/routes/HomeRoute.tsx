"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { HomeView } from "@/components/sections/HomeView";

/** Route "/" — vue accueil. Navigation router-backed (App Router). */
export function HomeRoute() {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return <HomeView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />;
}