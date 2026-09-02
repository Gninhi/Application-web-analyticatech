import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/services/seo.service";
import { safe, FALLBACK_SEO_METADATA } from "@/lib/services/safe";
import { buildPageMetadata } from "@/lib/services/page-meta";
import { HomeRoute } from "@/components/routes/HomeRoute";

export const revalidate = 3600; // 1h

export async function generateMetadata(): Promise<Metadata> {
  const seo = await safe("seoMetadata", getSeoMetadata("en"), FALLBACK_SEO_METADATA);

  return buildPageMetadata({
    locale: "en",
    path: "/en",
    title: seo.title || "Analyticatech — AI Consulting, Autonomous Agents & Automation",
    description:
      seo.description ||
      "Enterprise AI engineering firm: production LLM architectures, high-precision RAG systems, multi-agent orchestration and automated workflows.",
  });
}

/** Route "/en" — English Homepage. */
export default async function HomePageEn() {
  return <HomeRoute />;
}
