import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { InsightsRoute } from "@/components/routes/InsightsRoute";

export const revalidate = 3600; // 1h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "insights");
}

/** Route "/insights" — vue Insights (articles) (ISR 1h). */
export default function InsightsPage() {
  return <InsightsRoute />;
}