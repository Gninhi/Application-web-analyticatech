import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/branding/ThemeProvider";
import "./globals.css";
import { GlobalErrorBoundary } from "@/components/system/GlobalErrorBoundary";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAppContent } from "@/lib/services/content.service";
import type { Locale } from "@/types/content";

/* === Typographie (design system Analyticatech) ===
 * Manrope pour les titres, Inter pour le texte, étiquettes comprises : ce sont
 * les deux seules polices de la charte. Fichiers fournis par le design system,
 * auto-hébergés (src/app/fonts). display swap + adjustFontFallback : pas de CLS. */
const manrope = localFont({
  variable: "--font-manrope",
  src: [
    { path: "./fonts/Manrope-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Manrope-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.analyticatech.fr"),
  title: {
    default: "Analyticatech — L'IA, expliquée simplement, pour les PME et ETI",
    template: "%s | Analyticatech",
  },
  description:
    "Analyticatech aide les dirigeants de PME et d'ETI, et leurs DSI, à passer du pilote IA à des systèmes fiables en production : assistants sur vos documents, automatisation, agents IA sous contrôle humain et tableaux de bord. Conseil indépendant basé à Paris.",
  keywords: [
    "conseil IA PME",
    "consultant intelligence artificielle",
    "agents IA",
    "automatisation des processus",
    "assistant IA documents",
    "RAG",
    "LangGraph",
    "n8n",
    "Power BI",
    "business intelligence PME",
  ],
  authors: [{ name: "Analyticatech", url: "https://www.analyticatech.fr" }],
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
      "L'IA, expliquée simplement. Agents IA, automatisation et données en production pour PME et ETI, conformes RGPD et AI Act.",
    siteName: "Analyticatech",
    type: "website",
    locale: "fr_FR",
    url: "https://www.analyticatech.fr",
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
      "L'IA, expliquée simplement. Agents IA, automatisation et données en production pour PME et ETI.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.analyticatech.fr",
    languages: {
      "fr-FR": "https://www.analyticatech.fr",
      "en-US": "https://www.analyticatech.fr/en",
      fr: "https://www.analyticatech.fr",
      en: "https://www.analyticatech.fr/en",
      "x-default": "https://www.analyticatech.fr",
    },
  },
  category: "technology",
  other: {
    "application-name": "Analyticatech",
    "theme-color": "#06070B",
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
        className={`${manrope.variable} ${inter.variable} antialiased`}
      >
        <JsonLd content={content} />
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


