import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/branding/ThemeProvider";
import "./globals.css";
import { GlobalErrorBoundary } from "@/components/system/GlobalErrorBoundary";
import { SiteShell } from "@/components/layout/SiteShell";
import { getAppContent } from "@/lib/services/content.service";
import { KEY_STATS_CONFIG } from "@/data/stats";
import type { Locale } from "@/types/content";

/* === Typographie du Design System "Corporate Cyberpunk" ===
 * Optimisé Lighthouse : preload + display swap + adjustFontFallback
 * pour éviter FOUT et garantir un bon CLS (Cumulative Layout Shift). */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false, // Mono moins critique — pas de preload pour économiser la bande passante
});

export const metadata: Metadata = {
  metadataBase: new URL("https://analyticatech.fr"),
  title: {
    default: "Analyticatech — Architectures IA, Automatisation & Data d'Entreprise",
    template: "%s | Analyticatech",
  },
  description:
    `Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale. ${KEY_STATS_CONFIG.missions.value} missions livrées, ${KEY_STATS_CONFIG.costReduction.value} de coûts réduits. Experts LangChain, n8n, Power BI, Clouds Souverains (SecNumCloud).`,
  keywords: [
    // Mots-clés principaux (haute intention)
    "cabinet conseil IA",
    "cabinet conseil intelligence artificielle",
    "consultant IA entreprise",
    "transformation digitale IA",
    "automatisation IA entreprise",
    // Mots-clés techniques (longue traîne)
    "agents IA production",
    "architecture LLM entreprise",
    "système RAG",
    "LangChain consulting",
    "LangGraph agents",
    "n8n automatisation",
    "Power BI dashboard",
    "agents cognitifs",
    "IA souveraine compatible SecNumCloud",
    // Mots-clés sectoriels
    "IA finance",
    "IA logistique",
    "IA santé",
    "IA secteur public",
    // Mots-clés GEO (Generative Engine Optimization)
    "cabinet IA France",
    "experts IA générative Paris",
    "industrialisation IA",
    "data engineering IA",
    "MLOps production",
  ],
  authors: [{ name: "Analyticatech", url: "https://analyticatech.fr" }],
  creator: "Analyticatech",
  publisher: "Analyticatech",
  icons: { icon: "/logo.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Analyticatech — Cabinet de conseil en IA, Agents & Automatisation",
    description:
      `Architecture d'agents LLM, RAG, automatisation et transformation digitale. ${KEY_STATS_CONFIG.missions.value} missions livrées. Experts LangChain, n8n, Clouds Souverains (SecNumCloud).`,
    siteName: "Analyticatech",
    type: "website",
    locale: "fr_FR",
    url: "https://analyticatech.fr",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Analyticatech — Cabinet de conseil en IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyticatech — Cabinet conseil IA & Automatisation",
    description:
      "Agents LLM, RAG, automatisation, transformation digitale. 48+ missions livrées.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://analyticatech.fr",
    languages: {
      // Version anglaise non publiée (pas de route /en) : ne PAS annoncer de
      // hreflang vers une URL inexistante (signal SEO négatif).
      "fr-FR": "https://analyticatech.fr",
      "x-default": "https://analyticatech.fr",
    },
  },
  category: "technology",
  other: {
    "application-name": "Analyticatech",
    "theme-color": "#06070B",
    // SEO pour LLMs / GEO — signale le contenu au crawling IA
    "ai-content-optimized": "true",
    "llm-friendly": "true",
    "geo.region": "FR",
    "geo.placename": "Paris",
    "geo.position": "48.8566;2.3522",
    "ICBM": "48.8566, 2.3522",
  },
};

// Script d'init du thème (noncé) : pose la classe sur <html> avant le premier
// paint pour éviter le FOUC. Compatible CSP nonce (script-src sans
// 'unsafe-inline'). Doit rester synchrone avec ThemeProvider.
// `suppressHydrationWarning` : le nonce est régénéré par le proxy à chaque
// requête → la passe SSR et l'hydratation peuvent voir des valeurs différentes.
// Le contenu du script est identique des deux côtés ; seul l'attribut nonce
// varie, c'est ce que React doit ignorer lors de l'hydratation.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;var c=document.documentElement.classList;c.remove("light","dark");c.add(dark?"dark":"light")}catch(e){}})();`;

import { VercelMonitoring } from "@/components/system/VercelMonitoring";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce CSP injecté par le proxy de sécurité (header x-nonce). Next.js
  // l'applique automatiquement à ses propres scripts inline ; on l'applique
  // aussi à notre script d'init du thème.
  const nonce = (await headers()).get("x-nonce") ?? "";

  const headerLocale = (await headers()).get("x-locale");
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale: Locale =
    headerLocale === "en" || headerLocale === "fr"
      ? headerLocale
      : (cookieLocale as Locale) || "fr";
  const content = await getAppContent(locale);

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        {/* Script d'init du thème synchrone : garantit 0 FOUC / flash blanc au rechargement */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>

      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <GlobalErrorBoundary>
            <SiteShell content={content}>{children}</SiteShell>
          </GlobalErrorBoundary>
        </ThemeProvider>
        <VercelMonitoring />
      </body>
    </html>
  );
}


