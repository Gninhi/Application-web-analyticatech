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
    },
    {
      href: servicesHref,
      title: t("notFound.routes.services.title"),
      desc: t("notFound.routes.services.desc"),
      icon: Layers,
    },
    {
      href: solutionsHref,
      title: t("notFound.routes.solutions.title"),
      desc: t("notFound.routes.solutions.desc"),
      icon: Cpu,
    },
    {
      href: insightsHref,
      title: t("notFound.routes.insights.title"),
      desc: t("notFound.routes.insights.desc"),
      icon: BookOpen,
    },
  ];

  return (
    <div className="pt-32 md:pt-40 pb-24 min-h-[80vh] flex items-center">
      <SectionContainer maxWidth="5xl" className="w-full">
        {/* Carte d'incident 404 */}
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

          {/* Badge statut */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-3.5 py-1.5 mb-6">
            <Compass className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#F26D3D]">
              {t("notFound.tag")}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            {t("notFound.title")}
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {t("notFound.desc")}
          </p>

          {/* Bouton retour accueil principal */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button
              href={homeHref}
              variant="primary"
              size="lg"
              icon={<Home className="h-4 w-4" aria-hidden />}
              iconPosition="left"
              className="neon-glow font-bold"
            >
              <span>{t("notFound.home")}</span>
            </Button>
            <Button
              href={contactHref}
              variant="ghost"
              size="lg"
              icon={<Mail className="h-4 w-4" aria-hidden />}
              iconPosition="left"
            >
              <span>{t("notFound.contact")}</span>
            </Button>
          </div>

          {/* Grille de liens de réorientation */}
          <div className="text-left border-t border-black/10 dark:border-white/10 pt-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-4 text-center md:text-left">
              {t("notFound.recommended")}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {suggestedRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group glass-card rounded-2xl p-4 md:p-5 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/50 transition-all block text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10">
                        <Icon className="h-4 w-4 text-[#F26D3D]" aria-hidden />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#F26D3D] transition-colors flex items-center justify-between text-sm md:text-base">
                          {route.title}
                          <ArrowRight
                            className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#F26D3D]"
                            aria-hidden
                          />
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {route.desc}
                        </p>
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
