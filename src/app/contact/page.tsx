import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { ContactRoute } from "@/components/routes/ContactRoute";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "contact");
}

/** Route "/contact" — vue Contact. */
export default function ContactPage() {
  return <ContactRoute />;
}