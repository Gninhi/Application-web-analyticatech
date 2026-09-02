import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { SolutionsRoute } from "@/components/routes/SolutionsRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("en", "solutions");
}

/** Route "/en/solutions" — English Solutions view. */
export default function SolutionsPageEn() {
  return <SolutionsRoute />;
}
