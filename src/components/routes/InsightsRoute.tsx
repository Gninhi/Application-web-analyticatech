"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import { BlogView } from "@/components/sections/BlogView";

/** Route "/insights" — vue Insights (articles). Navigation router-backed. */
export function InsightsRoute() {
  const { handleNavigateDetail } = useViewNavigation();
  return <BlogView onNavigateDetail={handleNavigateDetail} />;
}