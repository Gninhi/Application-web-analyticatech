"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { ServicesView } from "@/components/sections/ServicesView";

/** Route "/services" — vue Services. Navigation router-backed. */
export function ServicesRoute() {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return <ServicesView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />;
}