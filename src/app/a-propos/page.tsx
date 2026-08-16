import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { AboutRoute } from "@/components/routes/AboutRoute";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "a-propos");
}

/** Route "/a-propos" — vue À propos. */
export default function AProposPage() {
  return <AboutRoute />;
}