import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { InsightsRoute } from "@/components/routes/InsightsRoute";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "insights");
}

/** Route "/insights" — vue Insights (articles). */
export default function InsightsPage() {
  return <InsightsRoute />;
}