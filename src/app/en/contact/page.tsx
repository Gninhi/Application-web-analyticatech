import type { Metadata } from "next";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { ContactRoute } from "@/components/routes/ContactRoute";

export const revalidate = 86400; // 24h

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMetadata("en", "contact");
}

/** Route "/en/contact" — English Contact view. */
export default function ContactPageEn() {
  return <ContactRoute />;
}
