"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { TerminalField } from "./TerminalField";
import { useContactForm } from "@/lib/hooks/useContactForm";
import { cn } from "@/lib/utils/cn";

export function ContactForm() {
  const { t } = useI18n();
  const { form, errors, status, serverMsg, reference, update, handleSubmit } =
    useContactForm();

  return (
    <div className="lg:col-span-3">
      <div className="glass-card rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
        {/* Barre de titre terminal */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-slate-900/70">
          <span className="h-3 w-3 rounded-full bg-[#F26D3D]/80" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#4CAF50]/70" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-slate-500/60" aria-hidden />
          <span className="ml-3 font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-300">
            {t("contact.terminal.title")}
          </span>
          <Terminal className="ml-auto h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden />
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-5" noValidate>
          {/* Ligne de commande simulée */}
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[#4CAF50]">root@analyticatech</span>
            <span className="text-slate-600 dark:text-slate-400">:</span>
            <span className="text-sky-400">~/contact</span>
            <span className="text-slate-600 dark:text-slate-400">$</span>{" "}
            <span className="text-slate-500 dark:text-slate-300">{t("contact.terminal.cmd")}</span>
            <span className="blink-cursor" />
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <TerminalField
              label={t("contact.fields.prenom")}
              name="prenom"
              placeholder="Aïcha"
              value={form.prenom}
              onChange={(v) => update("prenom", v)}
              error={errors.prenom}
              required
            />
            <TerminalField
              label={t("contact.fields.nom")}
              name="nom"
              placeholder="Benkacem"
              value={form.nom}
              onChange={(v) => update("nom", v)}
              error={errors.nom}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TerminalField
              label={t("contact.fields.email")}
              name="email"
              type="email"
              placeholder="a.benkacem@entreprise.com"
              value={form.email}
              onChange={(v) => update("email", v)}
              error={errors.email}
              required
            />
            <TerminalField
              label={t("contact.fields.entreprise")}
              name="entreprise"
              placeholder="Novabank SA"
              value={form.entreprise}
              onChange={(v) => update("entreprise", v)}
              error={errors.entreprise}
              required
            />
          </div>

          <TerminalField
            label={t("contact.fields.sujet")}
            name="sujet"
            placeholder="Cadrage d'une plateforme agentique souveraine"
            value={form.sujet}
            onChange={(v) => update("sujet", v)}
            error={errors.sujet}
            required
          />

          {/* Zone message */}
          <div>
            <label
              htmlFor="message"
              className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 mb-2"
            >
              {t("contact.fields.message")} <span className="text-[#F26D3D]">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder={t("contact.msg.placeholder")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-err" : undefined}
              className={cn(
                "terminal-input w-full rounded-lg bg-black/30 border px-3.5 py-3 font-mono text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 outline-none transition resize-y min-h-[120px]",
                errors.message ? "border-[#F26D3D]/60" : "border-black/10 dark:border-white/10"
              )}
            />
            {errors.message && (
              <p id="message-err" className="mt-1.5 font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" aria-hidden /> {errors.message}
              </p>
            )}
            <p className="mt-1.5 font-mono text-[10px] text-slate-600 dark:text-slate-400 text-right">
              {form.message.length}/2000
            </p>
          </div>

          {/* Consentement RGPD */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              id="consent"
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#F26D3D]"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-err" : undefined}
            />
            <span className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
              {t("contact.consent")}
            </span>
          </label>
          {errors.consent && (
            <p id="consent-err" className="font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3" aria-hidden /> {errors.consent}
            </p>
          )}

          {/* Multi-honeypot */}
          <input
            type="text"
            name="companyUrl"
            tabIndex={-1}
            autoComplete="off"
            value={form.companyUrl}
            onChange={(e) => update("companyUrl", e.target.value)}
            className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
          />
          <input
            type="text"
            name="fax"
            tabIndex={-1}
            autoComplete="off"
            value={form.fax}
            onChange={(e) => update("fax", e.target.value)}
            className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 w-0"
          />

          {/* Bouton EXÉCUTER */}
          <div className="pt-2">
            <MovingButton
              type="submit"
              disabled={status === "submitting"}
              variant="primary"
              size="lg"
              className="group w-full neon-glow font-bold"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("contact.encrypting")}
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" aria-hidden />
                  {t("contact.execute")}
                  <ChevronRight className="h-4 w-4 rotate-180" aria-hidden />
                </>
              )}
            </MovingButton>
          </div>

          {/* Messages de retour */}
          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className="rounded-lg border border-[#4CAF50]/40 bg-[#4CAF50]/10 p-4"
              >
                <p className="flex items-center gap-2 font-mono text-sm text-[#4CAF50]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                  {status === "success" && serverMsg ? serverMsg : t("contact.success")}
                </p>
                {reference && (
                  <p className="mt-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-300">
                    {t("contact.reference")}{" "}
                    <span className="text-[#F26D3D]">{reference}</span>
                  </p>
                )}
              </motion.div>
            )}
            {status === "error" && serverMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10 p-4"
              >
                <p className="flex items-center gap-2 font-mono text-sm text-[#F26D3D]">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                  {serverMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Badges sécurité */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[
          { icon: Lock, t: t("contact.badge.tls") },
          { icon: ShieldCheck, t: t("contact.badge.rgpd") },
          { icon: Lock, t: t("contact.badge.encrypted") },
          { icon: ShieldCheck, t: t("contact.badge.honeypot") },
        ].map((b) => (
          <span
            key={b.t}
            className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-300"
          >
            <b.icon className="h-3 w-3 text-[#4CAF50]" aria-hidden />
            {b.t}
          </span>
        ))}
      </div>
    </div>
  );
}
