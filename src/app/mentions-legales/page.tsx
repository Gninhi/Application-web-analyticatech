import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalMentionsRoute } from "@/components/routes/LegalRoutes";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "mentions-legales");
}

/** Route "/mentions-legales" — Mentions légales. */
export default function MentionsLegalesPage() {
  return <LegalMentionsRoute />;
}