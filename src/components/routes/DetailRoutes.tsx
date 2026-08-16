"use client";

import { useViewNavigation } from "@/lib/navigation/useViewNavigation";
import {
  ServiceDetailView,
  SolutionDetailView,
  BlogDetailView,
} from "@/components/sections/DetailView";

/** Route "/services/[index]" — détail d'un service. */
export function ServiceDetailRoute({ index }: { index: string }) {
  const { handleNavigate } = useViewNavigation();
  return <ServiceDetailView serviceIndex={index} onNavigate={handleNavigate} />;
}

/** Route "/solutions/[slug]" — détail d'une solution. */
export function SolutionDetailRoute({ slug }: { slug: string }) {
  const { handleNavigate } = useViewNavigation();
  return <SolutionDetailView solutionSlug={slug} onNavigate={handleNavigate} />;
}

/** Route "/insights/[slug]" — détail d'un article. */
export function PostDetailRoute({ slug }: { slug: string }) {
  const { handleNavigate } = useViewNavigation();
  return <BlogDetailView postSlug={slug} onNavigate={handleNavigate} />;
}