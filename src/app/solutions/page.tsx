import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { SolutionsRoute } from "@/components/routes/SolutionsRoute";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "solutions");
}

/** Route "/solutions" — vue Solutions. */
export default function SolutionsPage() {
  return <SolutionsRoute />;
}