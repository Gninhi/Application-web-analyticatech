"use client";

import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";

export function ContactSidePanel() {
  const { t } = useI18n();
  const { siteConfig } = useAppContent();

  return (
    <aside className="lg:col-span-2 space-y-5">
      {/* Canaux de contact directs */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
          {t("contact.channels")}
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/20">
              <Mail className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("contact.channel.email")}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm text-slate-700 dark:text-slate-200 hover:text-[#F26D3D] transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/20">
              <Phone className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("contact.channel.phone")}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{siteConfig.phone}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/20">
              <MapPin className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("contact.channel.hq")}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {siteConfig.streetAddress}, {siteConfig.postalCode} {siteConfig.city}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Engagements de réponse & SLA */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
          {t("contact.sla.title")}
        </h2>
        <div className="space-y-3">
          {[
            { l: t("contact.sla.ack"), v: t("contact.sla.ack.v") },
            { l: t("contact.sla.architect"), v: t("contact.sla.architect.v") },
            { l: t("contact.sla.workshop"), v: t("contact.sla.workshop.v") },
            { l: t("contact.sla.urgent"), v: t("contact.sla.urgent.v") },
          ].map((s) => (
            <div
              key={s.l}
              className="flex items-center justify-between py-2 border-b border-black/10 dark:border-white/10 last:border-0"
            >
              <span className="text-sm text-slate-500 dark:text-slate-300">{s.l}</span>
              <span className="font-mono text-xs text-[#4CAF50] uppercase tracking-wider">
                {s.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Encart Confidentialité & Secret Professionnel */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-[#4CAF50]" aria-hidden />
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">
            {t("contact.confidentiality.title")}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
          {t("contact.confidentiality.desc")}
        </p>
      </div>
    </aside>
  );
}
