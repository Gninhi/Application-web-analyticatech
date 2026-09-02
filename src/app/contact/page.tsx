import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { ContactRoute } from "@/components/routes/ContactRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("fr", "contact");
}

/** Route "/contact" — vue Contact (statique / ISR 24h). */
export default function ContactPage() {
  return <ContactRoute />;
}