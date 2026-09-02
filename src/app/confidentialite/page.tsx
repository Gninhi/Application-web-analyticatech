import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { LegalRgpdRoute } from "@/components/routes/LegalRoutes";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "confidentialite");
}

/** Route "/confidentialite" — Politique de confidentialité (RGPD) (statique / ISR 24h). */
export default function ConfidentialitePage() {
  return <LegalRgpdRoute />;
}