"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Copy,
  Check,
  CalendarCheck,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { getSlaList, SLA_COMMITMENTS } from "@/data/commitments";

export function ContactSidePanel() {
  const { t, locale } = useI18n();
  const { siteConfig } = useAppContent();
  const slaList = getSlaList(locale);
  const isEn = locale === "en";

  const [copiedItem, setCopiedItem] = useState<"email" | "phone" | null>(null);

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const steps = [
    {
      step: "01",
      titleFr: "Réception & Accord NDA",
      titleEn: "Reception & Mutual NDA",
      descFr: "Signature systématique d'un accord de confidentialité avant toute divulgation technique.",
      descEn: "Systematic NDA signature before any proprietary technical disclosure.",
      icon: FileCheck2,
    },
    {
      step: "02",
      titleFr: "Premier échange avec le fondateur",
      titleEn: "First call with the founder",
      descFr: "20 minutes pour comprendre votre besoin, sans intermédiaire commercial.",
      descEn: "20 minutes to understand your need, with no sales intermediary.",
      icon: CalendarCheck,
    },
    {
      step: "03",
      titleFr: "Proposition écrite",
      titleEn: "Written proposal",
      descFr: "Une proposition claire : périmètre, étapes, budget. Vous décidez ensuite.",
      descEn: "A clear proposal: scope, steps, budget. Then you decide.",
      icon: Sparkles,
    },
  ];

  return (
    <aside className="lg:col-span-2 space-y-5">
      {/* 1. Canaux de contact directs */}
      <div className="glass-card rounded-3xl p-6 border border-black/10 dark:border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-ink font-bold">
            {t("contact.channels")}
          </h2>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-link bg-link/10 px-2 py-0.5 rounded-full border border-link/20">
            <span className="h-1.5 w-1.5 rounded-full bg-link " />
            <span>{isEn ? "PERSONAL REPLY" : "RÉPONSE PERSONNELLE"}</span>
          </div>
        </div>

        <ul className="space-y-4">
          {/* Email officiel */}
          <li className="flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-accent-ink group-hover:scale-105 transition-transform">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {t("contact.channel.email")}
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-accent-ink dark:hover:text-accent-ink transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(siteConfig.email, "email")}
              className="p-2 rounded-lg text-slate-400 hover:text-accent-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={isEn ? "Copy email" : "Copier l'email"}
              aria-label={isEn ? "Copy email" : "Copier l'email"}
            >
              {copiedItem === "email" ? (
                <Check className="h-4 w-4 text-link" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </li>

          {/* Téléphone direct */}
          <li className="flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-accent-ink group-hover:scale-105 transition-transform">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {t("contact.channel.phone")}
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-accent-ink dark:hover:text-accent-ink transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(siteConfig.phone, "phone")}
              className="p-2 rounded-lg text-slate-400 hover:text-accent-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={isEn ? "Copy phone number" : "Copier le téléphone"}
              aria-label={isEn ? "Copy phone number" : "Copier le téléphone"}
            >
              {copiedItem === "phone" ? (
                <Check className="h-4 w-4 text-link" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </li>

          {/* Siège social */}
          <li className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-accent-ink">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("contact.channel.hq")}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {siteConfig.streetAddress}, {siteConfig.postalCode} {siteConfig.city}
              </p>
              <p className="font-mono text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                {isEn ? SLA_COMMITMENTS.schedule.fullEn : SLA_COMMITMENTS.schedule.fullFr}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* 2. Notre Protocole de Cadrage en 3 Étapes */}
      <div className="glass-card rounded-3xl p-6 border border-black/10 dark:border-white/10">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-ink font-bold mb-4">
          {isEn ? "3-STEP SCOPING" : "CADRAGE EN 3 ÉTAPES"}
        </h2>

        <div className="space-y-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F26D3D]/10 border border-[#F26D3D]/30 font-mono text-[11px] font-bold text-accent-ink">
                  {item.step}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-accent-ink shrink-0" aria-hidden />
                    <span>{isEn ? item.titleEn : item.titleFr}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {isEn ? item.descEn : item.descFr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Engagements de réponse & SLA */}
      <div className="glass-card rounded-3xl p-6 border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-accent-ink" aria-hidden="true" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-ink font-bold">
            {t("contact.sla.title")}
          </h2>
        </div>
        <div className="space-y-2.5">
          {slaList.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0"
            >
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{s.label}</span>
              <span className="font-mono text-[11px] text-link font-bold bg-link/10 px-2 py-0.5 rounded border border-link/20">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Encart Confidentialité & Secret Professionnel */}
      <div className="glass-card rounded-3xl p-6 border border-black/10 dark:border-white/10 bg-gradient-to-br from-[#011C40]/30 to-[#022859]/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-link" aria-hidden="true" />
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-50">
            {t("contact.confidentiality.title")}
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t("contact.confidentiality.desc")}
        </p>
      </div>
    </aside>
  );
}
