"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const { t, locale } = useI18n();

  useEffect(() => {
    // Log de l'incident côté client pour analyse
    console.error("[Analyticatech] Segment runtime error:", error);
  }, [error]);

  const isEn = locale === "en";
  const homeHref = isEn ? "/en" : "/";
  const contactHref = isEn ? "/en/contact" : "/contact";

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-[80vh] flex items-center">
      <SectionContainer maxWidth="4xl" className="w-full">
        <div className="glass-card rounded-3xl p-8 md:p-14 border border-black/10 dark:border-white/10 text-center relative overflow-hidden">
          {/* Liseré supérieur accent */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(242, 109, 61, 0.7), transparent)",
            }}
            aria-hidden
          />

          {/* Badge alerte */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-3.5 py-1.5 mb-6">
            <AlertTriangle className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D]">
              {t("error.badge")}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            {t("error.title")}
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {t("error.desc")}
          </p>

          {/* Diagnostic technique en environnement non-production */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mb-8 text-left bg-black/40 border border-black/10 dark:border-white/10 rounded-xl p-4 overflow-hidden">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                Diagnostic debug :
              </p>
              <p className="font-mono text-xs text-[#F26D3D] break-all">
                {error.message || "Runtime exception without description"}
              </p>
              {error.digest && (
                <p className="font-mono text-[10px] text-slate-500 mt-1">
                  Digest : {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={reset}
              icon={<RefreshCw className="h-4 w-4" aria-hidden />}
              iconPosition="left"
              className="neon-glow font-bold"
            >
              <span>{t("error.retry")}</span>
            </Button>

            <Button
              href={homeHref}
              variant="ghost"
              size="lg"
              icon={<Home className="h-4 w-4" aria-hidden />}
              iconPosition="left"
            >
              <span>{t("error.home")}</span>
            </Button>

            <Button
              href={contactHref}
              variant="outline"
              size="lg"
              icon={<Mail className="h-4 w-4" aria-hidden />}
              iconPosition="left"
            >
              <span>{t("error.contact")}</span>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
