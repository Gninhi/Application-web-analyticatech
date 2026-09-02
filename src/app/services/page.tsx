import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { ServicesRoute } from "@/components/routes/ServicesRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "services");
}

/** Route "/services" — vue Services (statique / ISR 24h). */
export default function ServicesPage() {
  return <ServicesRoute />;
}