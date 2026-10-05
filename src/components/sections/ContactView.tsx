"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/provider";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ContactForm } from "./contact/ContactForm";
import { ContactSidePanel } from "./contact/ContactSidePanel";
import { FaqSection } from "@/components/sections/FaqSection";
import {
  ShieldCheck,
  Clock,
  Lock,
  Headphones,
} from "lucide-react";

export function ContactView() {
  const { t, locale } = useI18n();
  const isEn = locale === "en";

  const trustMetrics = [
    {
      icon: Clock,
      labelFr: "Réactivité SLA",
      labelEn: "SLA Reactivity",
      valFr: "< 2h ouvrées",
      valEn: "< 2 business hours",
      descFr: "Prise en compte immédiate",
      descEn: "Immediate dispatch",
    },
    {
      icon: Lock,
      labelFr: "Confidentialité",
      labelEn: "Confidentiality",
      valFr: "NDA Préalable",
      valEn: "Mutual NDA",
      descFr: "Signature systématique",
      descEn: "Executed upfront",
    },
    {
      icon: ShieldCheck,
      labelFr: "Infrastructure",
      labelEn: "Infrastructure",
      valFr: "100% Souverain",
      valEn: "100% Sovereign",
      descFr: "Cloud & serveurs en UE",
      descEn: "EU-only hosting",
    },
    {
      icon: Headphones,
      labelFr: "Interlocuteur",
      labelEn: "Direct Contact",
      valFr: "Lead Architecte",
      valEn: "Lead Architect",
      descFr: "Échange technique direct",
      descEn: "Direct technical peer",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Halo d'ambiance d'arrière-plan */}
      <div
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full opacity-15 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(242, 109, 61, 0.4) 0%, rgba(3, 49, 140, 0.25) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* 1. En-tête de la page Contact */}
      <section className="pt-32 md:pt-40 pb-10 relative z-10">
        <SectionContainer>
          <PageHeader
            kicker={t("contact.kicker")}
            title={t("contact.title1")}
            accent={t("contact.title2")}
            description={t("contact.desc")}
            className="max-w-4xl"
          />

          {/* Bandeau de réassurance / Métriques de confiance */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {trustMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-4 border border-black/10 dark:border-white/10 hover:border-[#F26D3D]/40 transition-colors flex items-center gap-3.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F26D3D]/10 border border-[#F26D3D]/25 text-[#F26D3D]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isEn ? metric.labelEn : metric.labelFr}
                    </p>
                    <p className="font-display font-bold text-slate-900 dark:text-slate-50 text-sm truncate">
                      {isEn ? metric.valEn : metric.valFr}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {isEn ? metric.descEn : metric.descFr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* 2. Formulaire & Panneau Latéral */}
      <section className="pb-16 relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid gap-8 lg:grid-cols-5">
          <ContactForm />
          <ContactSidePanel />
        </div>
      </section>

      {/* 3. Section FAQ Exécutive (déplacée depuis l'accueil pour un parcours de conversion optimal) */}
      <div className="pb-24 relative z-10">
        <FaqSection
          tag={isEn ? "FAQ // CONSULTATION PROTOCOL" : "FAQ // QUESTIONS FRÉQUENTES"}
          title={isEn ? "Frequently Asked Questions." : "Questions fréquentes avant de démarrer."}
          description={
            isEn
              ? "Everything executives and engineering leaders ask before initiating an AI or data project with us."
              : "Tout ce que les dirigeants et directeurs techniques nous demandent avant de lancer un projet avec nous."
          }
        />
      </div>
    </div>
  );
}
