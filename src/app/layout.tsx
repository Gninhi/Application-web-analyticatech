import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { PageLoader } from "@/components/PageLoader";

/* === Typographie du Design System "Corporate Cyberpunk" === */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Analyticatech — Le futur de l'intelligence",
  description:
    "Cabinet de conseil de haut niveau en IA, Transformation Digitale et Automatisation. Architecture d'agents, data engineering et industrialisation à l'échelle.",
  keywords: [
    "Analyticatech",
    "Intelligence Artificielle",
    "Transformation Digitale",
    "Automatisation",
    "Agents IA",
    "Business Intelligence",
    "LLM",
    "n8n",
  ],
  authors: [{ name: "Analyticatech" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Analyticatech — Le futur de l'intelligence",
    description:
      "Cabinet de conseil en IA, Transformation Digitale et Automatisation.",
    siteName: "Analyticatech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyticatech",
    description:
      "Cabinet de conseil en IA, Transformation Digitale et Automatisation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PageLoader />
        <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
