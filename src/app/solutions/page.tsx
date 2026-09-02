import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { SolutionsRoute } from "@/components/routes/SolutionsRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "solutions");
}

/** Route "/solutions" — vue Solutions (statique / ISR 24h). */
export default function SolutionsPage() {
  return <SolutionsRoute />;
}