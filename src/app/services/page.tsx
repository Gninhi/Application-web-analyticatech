import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStaticPageMetadata } from "@/lib/services/page-meta";
import { ServicesRoute } from "@/components/routes/ServicesRoute";
import type { Locale } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (((await cookies()).get("NEXT_LOCALE")?.value) as Locale) || "fr";
  return getStaticPageMetadata(locale, "services");
}

/** Route "/services" — vue Services. */
export default function ServicesPage() {
  return <ServicesRoute />;
}