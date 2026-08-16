"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { SolutionsView } from "@/components/sections/SolutionsView";

/** Route "/solutions" — vue Solutions. Navigation router-backed. */
export function SolutionsRoute() {
  const { handleNavigate, handleNavigateDetail } = useViewNavigation();
  return <SolutionsView onNavigate={handleNavigate} onNavigateDetail={handleNavigateDetail} />;
}