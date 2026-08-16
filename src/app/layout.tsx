import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GlobalErrorBoundary } from "@/components/system/GlobalErrorBoundary";

/* === Typographie du Design System "Corporate Cyberpunk" ===
 * Optimisé Lighthouse : preload + display swap + adjustFontFallback
 * pour éviter FOUT et garantir un bon CLS (Cumulative Layout Shift). */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false, // Mono moins critique — pas de preload pour économiser la bande passante
});

export const metadata: Metadata = {
  metadataBase: new URL("https://analyticatech.fr"),
  title: {
    default: "Analyticatech — Cabinet de conseil en IA, Agents & Automatisation",
    template: "%s | Analyticatech",
  },
  description:
    "Cabinet de conseil IA en France : architecture d'agents LLM, RAG, automatisation workflows et transformation digitale. 127+ missions livrées, 38% de coûts réduits. Experts LangChain, n8n, Power BI, SecNumCloud.",
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
    "IA souveraine SecNumCloud",
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
      "Architecture d'agents LLM, RAG, automatisation et transformation digitale. 127+ missions livrées. Experts LangChain, n8n, SecNumCloud.",
    siteName: "Analyticatech",
    type: "website",
    locale: "fr_FR",
    url: "https://analyticatech.fr",
    images: [
      {
        url: "/og-image.png",
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
      "Agents LLM, RAG, automatisation, transformation digitale. 127+ missions livrées.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://analyticatech.fr",
    languages: {
      "fr-FR": "https://analyticatech.fr",
      "en-US": "https://analyticatech.fr/en",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Preload manuel des fichiers de police principaux (Inter latin +
              Space Grotesk latin). Turbopack n'émet pas les <link rel=preload>
              de next/font : sans ce preload, les polices ne sont découvertes
              qu'après parsing des CSS render-blocking, ce qui retarde le swap
              des polices et donc le LCP. Les noms de fichiers sont stables
              (dérivés du contenu des polices). */}
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href="/_next/static/media/0c89a48fa5027cee-s.p.2cyn07wtgehh0.woff2"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href="/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2"
          />
          <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
