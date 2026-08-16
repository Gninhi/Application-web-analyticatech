import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalRgpdRoute } from "@/components/routes/LegalRoutes";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "confidentialite");
}

/** Route "/confidentialite" — Politique de confidentialité (RGPD). */
export default function ConfidentialitePage() {
  return <LegalRgpdRoute />;
}