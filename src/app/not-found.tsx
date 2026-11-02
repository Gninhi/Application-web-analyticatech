"use client";

import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Cpu,
  Layers,
  BookOpen,
  Mail,
  Home,
} from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const { t, locale } = useI18n();

  const isEn = locale === "en";
  const homeHref = isEn ? "/en" : "/";
  const servicesHref = isEn ? "/en/services" : "/services";
  const solutionsHref = isEn ? "/en/solutions" : "/solutions";
  const insightsHref = isEn ? "/en/insights" : "/insights";
  const contactHref = isEn ? "/en/contact" : "/contact";

  const suggestedRoutes = [
    {
      href: homeHref,
      title: t("notFound.routes.home.title"),
      desc: t("notFound.routes.home.desc"),
      icon: Home,
      latency: "< 5ms",
    },
    {
      href: servicesHref,
      title: t("notFound.routes.services.title"),
      desc: t("notFound.routes.services.desc"),
      icon: Layers,
      latency: "< 8ms",
    },
    {
      href: solutionsHref,
      title: t("notFound.routes.solutions.title"),
      desc: t("notFound.routes.solutions.desc"),
      icon: Cpu,
      latency: "< 10ms",
    },
    {
      href: insightsHref,
      title: t("notFound.routes.insights.title"),
      desc: t("notFound.routes.insights.desc"),
      icon: BookOpen,
      latency: "< 6ms",
    },
  ];

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-[85vh] flex items-center relative overflow-hidden">
      {/* Halos d'ambiance d'arrière-plan */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(242, 109, 61, 0.4) 0%, rgba(3, 49, 140, 0.3) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <SectionContainer maxWidth="5xl" className="w-full relative z-10">
        {/* Carte principale d'incident 404 */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-14 border border-black/10 dark:border-white/10 text-center relative overflow-hidden shadow-2xl">
          {/* Liseré supérieur néon */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(242, 109, 61, 0.8), rgba(3, 49, 140, 0.8), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Radar vectoriel stylisé en arrière-plan du 404 */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Anneaux de radar en filigrane */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30" aria-hidden="true">
              <div className="h-64 w-64 rounded-full border border-dashed border-[#F26D3D] animate-[spin_40s_linear_infinite]" />
              <div className="absolute h-44 w-44 rounded-full border border-slate-400 dark:border-slate-600" />
              <div className="absolute h-24 w-24 rounded-full border border-[#03318C]" />
            </div>

            {/* Monumental 404 */}
            <div className="relative z-10 select-none">
              <p
                className="font-display text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, #F26D3D 0%, #F5F7FA 45%, #03318C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 20px rgba(242, 109, 61, 0.25))",
                }}
              >
                404
              </p>
            </div>
          </div>

          {/* Badge statut de la route */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(242,109,61,0.15)]">
            <Compass className="h-3.5 w-3.5 text-accent-ink animate-spin" style={{ animationDuration: "12s" }} aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-ink font-bold">
              {t("notFound.tag")}
            </span>
          </div>

          {/* Titre & Description */}
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 max-w-2xl mx-auto">
            {t("notFound.title")}
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {t("notFound.desc")}
          </p>

          {/* Boutons d'action principaux */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button
              href={homeHref}
              variant="primary"
              size="lg"
              icon={<Home className="h-4 w-4" aria-hidden="true" />}
              iconPosition="left"
              className="font-bold shadow-[0_0_20px_rgba(242,109,61,0.3)] hover:shadow-[0_0_30px_rgba(242,109,61,0.5)]"
            >
              <span>{t("notFound.home")}</span>
            </Button>
            <Button
              href={contactHref}
              variant="ghost"
              size="lg"
              icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              iconPosition="left"
              className="font-medium"
            >
              <span>{t("notFound.contact")}</span>
            </Button>
          </div>

          {/* Grille de liens vers les pages principales */}
          <div className="text-left border-t border-black/10 dark:border-white/10 pt-8">
            <div className="flex items-center justify-between gap-4 mb-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent-ink font-bold">
                {t("notFound.recommended")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {suggestedRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group glass-card rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/50 hover:shadow-[0_4px_20px_rgba(242,109,61,0.12)] transition-all duration-200 block text-left relative overflow-hidden"
                  >
                    {/* Trait d'accent au hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F26D3D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F26D3D]/30 bg-[#F26D3D]/10 text-accent-ink group-hover:scale-105 group-hover:bg-[#F26D3D]/20 transition-all duration-200">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent-ink transition-colors text-sm sm:text-base">
                            {route.title}
                          </p>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-accent-ink"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {route.desc}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-400">
                            PING: {route.latency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
