import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { InsightsRoute } from "@/components/routes/InsightsRoute";

export const revalidate = 3600; // 1h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("en", "insights");
}

/** Route "/en/insights" — English Insights view. */
export default function InsightsPageEn() {
  return <InsightsRoute />;
}
