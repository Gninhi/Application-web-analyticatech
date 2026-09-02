import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { AboutRoute } from "@/components/routes/AboutRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "a-propos");
}

/** Route "/a-propos" — vue À propos (statique / ISR 24h). */
export default function AProposPage() {
  return <AboutRoute />;
}