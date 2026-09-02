import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalRgpdRoute } from "@/components/routes/LegalRoutes";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("en", "confidentialite");
}

/** Route "/en/confidentialite" — Privacy Policy (GDPR). */
export default function ConfidentialitePageEn() {
  return <LegalRgpdRoute />;
}
