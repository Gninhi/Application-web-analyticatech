import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalMentionsRoute } from "@/components/routes/LegalRoutes";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "mentions-legales");
}

/** Route "/mentions-legales" — Mentions légales (statique / ISR 24h). */
export default function MentionsLegalesPage() {
  return <LegalMentionsRoute />;
}