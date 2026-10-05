"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ContactForm } from "./contact/ContactForm";
import { ContactSidePanel } from "./contact/ContactSidePanel";
import {
  ShieldCheck,
  Clock,
  Lock,
  Headphones,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

  const faqItems = [
    {
      qFr: "Comment se déroule le premier échange technique ?",
      qEn: "How does the initial technical consultation work?",
      aFr: "Dès réception de votre demande, un Lead Architecte dédié prend connaissance de votre contexte. Nous planifions une session exploratoire de 30 minutes (en visio sécurisée ou en présentiel à Paris) pour analyser vos flux de données, contraintes réglementaires et cas d'usage cibles.",
      aEn: "Upon receipt, a dedicated Lead Architect reviews your requirements. We schedule a confidential 30-minute exploratory session (secure video or in-person in Paris) to qualify your data pipelines, regulatory constraints, and target use cases.",
    },
    {
      qFr: "Signez-vous un accord de confidentialité (NDA) avant l'échange ?",
      qEn: "Do you sign a non-disclosure agreement (NDA) beforehand?",
      aFr: "Oui, sans exception. Si vos contraintes le requièrent, nous signons votre propre modèle de NDA ou vous fournissons notre modèle standard d'accord de confidentialité réciproque avant toute communication d'informations sensibles.",
      aEn: "Yes, without exception. We execute your corporate NDA or provide our standard mutual confidentiality agreement before any sensitive or proprietary technical discussion takes place.",
    },
    {
      qFr: "Quel livrable recevons-nous à l'issue du cadrage ?",
      qEn: "What deliverable do we receive after the initial scoping?",
      aFr: "Sous 48 heures ouvrées, nous vous remettons une note de cadrage d'architecture : schéma de la solution cible (agents, flux RAG ou pipelines data), matrice des prérequis, calendrier prévisionnel et chiffrage transparent en régie ou forfait.",
      aEn: "Within 48 business hours, you receive an architecture synthesis note: target solution diagram (agents, RAG flow or data stack), prerequisite matrix, timeline, and transparent investment scoping.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

      {/* 3. Section FAQ Exécutive de Cadrage */}
      <section className="pb-24 relative z-10">
        <SectionContainer maxWidth="4xl">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-[#F26D3D]" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] font-bold">
                {isEn ? "FAQ // CONSULTATION PROTOCOL" : "FAQ // PROTOCOLE DE CADRAGE"}
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              {isEn ? "Common Questions about Technical Scoping" : "Questions fréquentes sur notre cadrage technique"}
            </h2>

            <div className="space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:text-[#F26D3D]"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 pr-4">
                        {isEn ? item.qEn : item.qFr}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-[#F26D3D] transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-3">
                        {isEn ? item.aEn : item.aFr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
