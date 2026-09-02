import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalMentionsRoute } from "@/components/routes/LegalRoutes";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("en", "mentions-legales");
}

/** Route "/en/mentions-legales" — Legal Notices. */
export default function MentionsLegalesPageEn() {
  return <LegalMentionsRoute />;
}
