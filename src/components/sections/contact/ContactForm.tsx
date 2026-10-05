"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
  Mail,
  Building2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Bot,
  BrainCircuit,
  Database,
  SearchCode,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { TerminalField } from "./TerminalField";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { cn } from "@/lib/utils/cn";

const DOMAIN_SUGGESTIONS = [
  {
    id: "agents",
    labelFr: "IA Agentique & Multi-Agents",
    labelEn: "Agentic AI & Multi-Agents",
    icon: Bot,
  },
  {
    id: "rag",
    labelFr: "RAG & LLM Souverain",
    labelEn: "Sovereign RAG & LLMs",
    icon: BrainCircuit,
  },
  {
    id: "data",
    labelFr: "Modern Data Stack & BI",
    labelEn: "Modern Data Stack & BI",
    icon: Database,
  },
  {
    id: "audit",
    labelFr: "Audit & Cadrage Technique",
    labelEn: "Technical Audit & Scoping",
    icon: SearchCode,
  },
] as const;

export function ContactForm() {
  const { t, locale } = useI18n();
  const { form, errors, status, serverMsg, reference, update, handleSubmit } =
    useContactForm();

  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  // Détection proactive d'adresse email grand public pour aider l'utilisateur
  const emailDomain = form.email.includes("@") ? form.email.split("@")[1]?.toLowerCase() : "";
  const isBlockedDomain = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
  ].includes(emailDomain ?? "");

  const handleCopyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectDomain = (domainLabel: string) => {
    update("sujet", domainLabel);
  };

  const messageLength = form.message.length;
  const isMessageValid = messageLength >= 20;

  return (
    <div className="lg:col-span-3">
      <div className="glass-card rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative">
        {/* Liseré supérieur néon */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(242, 109, 61, 0.8), rgba(3, 49, 140, 0.8), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Barre de commande supérieure — Style High-Tech Console */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-black/10 dark:border-white/10 bg-slate-100/80 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#F26D3D]/90 shadow-[0_0_8px_rgba(242,109,61,0.6)]" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-[#4CAF50]/80 shadow-[0_0_8px_rgba(76,175,80,0.5)]" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-slate-400/50" aria-hidden="true" />
            <span className="ml-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300">
              {t("contact.terminal.title")}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
            <span className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" aria-hidden="true" />
            <span className="uppercase tracking-wider">
              {isEn ? "SECURE PORTAL · TLS 1.3" : "SESSION SÉCURISÉE · TLS 1.3"}
            </span>
          </div>
        </div>

        {/* Formulaire ou Écran de confirmation de succès */}
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="p-8 sm:p-12 text-center space-y-6"
            >
              {/* Badge animé de succès */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#4CAF50]/40 bg-[#4CAF50]/10 text-[#4CAF50] shadow-[0_0_30px_rgba(76,175,80,0.25)]">
                <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#4CAF50] font-bold">
                  {isEn ? "TRANSMISSION CONFIRMED" : "TRANSMISSION CONFIRMÉE"}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {isEn ? "Request Logged & Encrypted" : "Demande enregistrée & chiffrée"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {serverMsg || t("contact.success")}
                </p>
              </div>

              {/* Référence de ticket avec bouton de copie */}
              {reference && (
                <div className="max-w-md mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4 flex items-center justify-between gap-4">
                  <div className="text-left min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {t("contact.reference")}
                    </p>
                    <p className="font-mono text-base font-bold text-[#F26D3D] truncate">
                      {reference}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-200 hover:border-[#F26D3D] transition-colors shrink-0"
                    aria-label="Copier la référence"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#4CAF50]" />
                        <span className="text-[#4CAF50]">{isEn ? "Copied" : "Copié"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>{isEn ? "Copy" : "Copier"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Prochaines étapes SLA */}
              <div className="max-w-md mx-auto border-t border-black/10 dark:border-white/10 pt-6 text-left space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] font-bold">
                  {isEn ? "// PROTOCOL NEXT STEPS" : "// PROCHAINES ÉTAPES DU PROTOCOLE"}
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[#F26D3D] font-bold">01.</span>
                    <span>{isEn ? "Automated security receipt sent to your corporate email (< 2h)" : "Accusé de réception sécurisé envoyé sur votre email d'entreprise (< 2h)"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[#F26D3D] font-bold">02.</span>
                    <span>{isEn ? "Review & scoping by a dedicated Solutions Architect (< 24h)" : "Analyse d'architecture par un Architecte Référent (< 24h)"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[#F26D3D] font-bold">03.</span>
                    <span>{isEn ? "Confidential technical scoping workshop scheduling" : "Planification d'un atelier technique exploratoire sous NDA"}</span>
                  </div>
                </div>
              </div>

              {/* Bouton pour renouveler */}
              <div className="pt-2">
                <Button
                  onClick={() => window.location.reload()}
                  variant="ghost"
                  size="md"
                  icon={<RotateCcw className="h-4 w-4" />}
                  iconPosition="left"
                >
                  <span>{isEn ? "Submit another inquiry" : "Initier une autre demande"}</span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" noValidate>

              {/* SECTION 1 : IDENTITÉ & ORGANISATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F26D3D]/10 font-mono text-[10px] font-bold text-[#F26D3D]">
                    01
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                    {isEn ? "Identity & Structure" : "Identité & Structure"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <TerminalField
                    label={t("contact.fields.prenom")}
                    name="prenom"
                    autoComplete="given-name"
                    placeholder={isEn ? "Elena" : "Aïcha"}
                    value={form.prenom}
                    onChange={(v) => update("prenom", v)}
                    error={errors.prenom}
                    icon={<User className="h-4 w-4" />}
                    required
                  />
                  <TerminalField
                    label={t("contact.fields.nom")}
                    name="nom"
                    autoComplete="family-name"
                    placeholder={isEn ? "Vance" : "Benkacem"}
                    value={form.nom}
                    onChange={(v) => update("nom", v)}
                    error={errors.nom}
                    icon={<User className="h-4 w-4" />}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <TerminalField
                      label={t("contact.fields.email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="contact@enterprise.com"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                      required
                    />
                    {isBlockedDomain && (
                      <p className="mt-1 font-mono text-[10px] text-amber-500 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {isEn
                          ? "Corporate email required (public webmails excluded)."
                          : "Email professionnel requis (adresses grand public non acceptées)."}
                      </p>
                    )}
                  </div>

                  <TerminalField
                    label={t("contact.fields.entreprise")}
                    name="entreprise"
                    autoComplete="organization"
                    placeholder="Novabank SA"
                    value={form.entreprise}
                    onChange={(v) => update("entreprise", v)}
                    error={errors.entreprise}
                    icon={<Building2 className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              {/* SECTION 2 : DOMAINE D'INTERVENTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F26D3D]/10 font-mono text-[10px] font-bold text-[#F26D3D]">
                      02
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                      {isEn ? "Project Domain & Scope" : "Périmètre & Domaine de Consultation"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                    {isEn ? "Select to prefill" : "Cliquez pour pré-remplir"}
                  </span>
                </div>

                {/* Suggestions interactives de domaines */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DOMAIN_SUGGESTIONS.map((domain) => {
                    const Icon = domain.icon;
                    const label = isEn ? domain.labelEn : domain.labelFr;
                    const isSelected = form.sujet === label;

                    return (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={() => selectDomain(label)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl border text-left font-mono text-[11px] transition-all duration-200 group select-none",
                          isSelected
                            ? "border-[#F26D3D] bg-[#F26D3D]/10 text-[#F26D3D] shadow-[0_0_12px_rgba(242,109,61,0.15)] font-semibold"
                            : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:border-[#F26D3D]/50 hover:bg-[#F26D3D]/5"
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors", isSelected ? "text-[#F26D3D]" : "text-slate-400 group-hover:text-[#F26D3D]")} />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <TerminalField
                  label={t("contact.fields.sujet")}
                  name="sujet"
                  placeholder={isEn ? "e.g. Multi-agent platform deployment" : "Ex: Déploiement d'une plateforme agentique souveraine"}
                  value={form.sujet}
                  onChange={(v) => update("sujet", v)}
                  error={errors.sujet}
                  required
                />
              </div>

              {/* SECTION 3 : EXPRESSION DU BESOIN */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F26D3D]/10 font-mono text-[10px] font-bold text-[#F26D3D]">
                      03
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                      {t("contact.fields.message")} <span className="text-[#F26D3D]">*</span>
                    </span>
                  </div>
                  <span className={cn(
                    "font-mono text-[10px] transition-colors",
                    isMessageValid ? "text-[#4CAF50]" : "text-slate-400"
                  )}>
                    {messageLength} / 2000 {messageLength < 20 && `(${isEn ? "min 20 chars" : "min 20 car."})`}
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder={t("contact.msg.placeholder")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-err" : undefined}
                    className={cn(
                      "w-full rounded-xl border p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 resize-y min-h-[130px] bg-white/80 dark:bg-slate-950/60 backdrop-blur-sm",
                      errors.message
                        ? "border-[#F26D3D] ring-2 ring-[#F26D3D]/20 shadow-[0_0_12px_rgba(242,109,61,0.15)]"
                        : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-[#F26D3D] focus:ring-2 focus:ring-[#F26D3D]/20"
                    )}
                  />

                  {/* Micro-barre de progression vers les 20 caractères min */}
                  <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        isMessageValid ? "bg-[#4CAF50]" : "bg-[#F26D3D]"
                      )}
                      style={{ width: `${Math.min(100, (messageLength / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                {errors.message && (
                  <p id="message-err" className="font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5" role="alert">
                    <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* SECTION 4 : CONSENTEMENT ET SÉCURITÉ */}
              <div className="pt-2 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 dark:border-white/20 accent-[#F26D3D] cursor-pointer"
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-err" : undefined}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {t("contact.consent")}
                  </span>
                </label>

                {errors.consent && (
                  <p id="consent-err" className="font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5" role="alert">
                    <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{errors.consent}</span>
                  </p>
                )}

                {/* Honeypots de sécurité invisibles */}
                <input
                  type="text"
                  name="companyUrl"
                  tabIndex={-1}
                  aria-hidden="true"
                  aria-label="Ne pas remplir"
                  autoComplete="off"
                  value={form.companyUrl}
                  onChange={(e) => update("companyUrl", e.target.value)}
                  className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
                />
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  aria-hidden="true"
                  aria-label="Ne pas remplir"
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
                />
                <input
                  type="text"
                  name="fax"
                  tabIndex={-1}
                  aria-hidden="true"
                  aria-label="Ne pas remplir"
                  autoComplete="off"
                  value={form.fax}
                  onChange={(e) => update("fax", e.target.value)}
                  className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
                />

                {/* Bouton de soumission sécurisé */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    loading={status === "submitting"}
                    variant="primary"
                    size="lg"
                    icon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                    iconPosition="right"
                    className="w-full font-bold shadow-[0_0_20px_rgba(242,109,61,0.25)] hover:shadow-[0_0_30px_rgba(242,109,61,0.4)]"
                  >
                    <span>
                      {status === "submitting" ? t("contact.encrypting") : t("contact.execute")}
                    </span>
                  </Button>
                </div>

                {/* Message d'erreur serveur si applicable */}
                {status === "error" && serverMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="rounded-xl border border-[#F26D3D]/50 bg-[#F26D3D]/10 p-3.5 text-xs font-mono text-[#F26D3D] flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{serverMsg}</span>
                  </motion.div>
                )}
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>

      {/* Badges de conformité et sécurité sous le formulaire */}
      <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 px-1">
        {[
          { icon: ShieldCheck, text: t("contact.badge.rgpd") },
          { icon: Lock, text: t("contact.badge.encrypted") },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              <Icon className="h-3 w-3 text-[#4CAF50]" aria-hidden="true" />
              <span>{badge.text}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
