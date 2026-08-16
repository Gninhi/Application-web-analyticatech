"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { contactSchema, type ContactApiResponse } from "@/lib/validation/schemas";
import { safeFetch, FetchError } from "@/lib/http/safe-fetch";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";

interface FormState {
  prenom: string;
  nom: string;
  email: string;
  entreprise: string;
  sujet: string;
  message: string;
  consent: boolean;
  companyUrl: string; // honeypot 1
  website: string;    // honeypot 2
  fax: string;        // honeypot 3
}

const EMPTY: FormState = {
  prenom: "",
  nom: "",
  email: "",
  entreprise: "",
  sujet: "",
  message: "",
  consent: false,
  companyUrl: "",
  website: "",
  fax: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactView() {
  const { t } = useI18n();
  const { siteConfig } = useAppContent();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [reference, setReference] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation Zod côté client
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setServerMsg(t("contact.err.validation"));
      return;
    }

    setErrors({});
    setStatus("submitting");
    setServerMsg("");

    try {
      // Lecture du token CSRF depuis le cookie (posé par le middleware)
      const csrfToken = document.cookie
        .split("; ")
        .find((c) => c.startsWith("at-csrf="))
        ?.split("=")[1] ?? "";

      const res = await safeFetch<ContactApiResponse>("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(result.data),
        timeoutMs: 12000,
        retries: 1,
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (res.success) {
        setStatus("success");
        setServerMsg(res.message);
        setReference(res.reference ?? "");
        setForm(EMPTY);
      } else {
        setStatus("error");
        setServerMsg(res.message);
        if (res.errors) {
          const fe: Partial<Record<keyof FormState, string>> = {};
          for (const err of res.errors) {
            fe[err.field as keyof FormState] = err.message;
          }
          setErrors(fe);
        }
      }
    } catch (err) {
      setStatus("error");
      if (err instanceof FetchError && err.status === 429) {
        setServerMsg(t("contact.err.ratelimit"));
      } else {
        setServerMsg(t("contact.err.network"));
      }
    }
  };

  return (
    <div className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("contact.kicker")}
            title={t("contact.title1")}
            accent={t("contact.title2")}
            description={t("contact.desc")}
            className="max-w-3xl"
          />
        </SectionContainer>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid gap-8 lg:grid-cols-5">
          {/* === Terminal Form === */}
          <div className="lg:col-span-3">
            <div
              ref={terminalRef}
              className="glass-card rounded-2xl overflow-hidden border border-black/10 dark:border-white/10"
            >
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
                  <span className="text-slate-500">:</span>
                  <span className="text-sky-400">~/contact</span>
                  <span className="text-slate-500">$</span>{" "}
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
                  <p className="mt-1.5 font-mono text-[10px] text-slate-500 text-right">
                    {form.message.length}/2000
                  </p>
                </div>

                {/* Consentement RGPD */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#F26D3D]"
                    aria-invalid={!!errors.consent}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    {t("contact.consent")}
                  </span>
                </label>
                {errors.consent && (
                  <p className="font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" aria-hidden /> {errors.consent}
                  </p>
                )}

                {/* Multi-honeypot — invisible aux humains, piège aux bots.
                    aria-hidden retiré (audit WCAG : élément focusable ne doit
                    pas être aria-hidden). Masqué visuellement via CSS +
                    tabIndex={-1} sort du focus séquentiel clavier. */}
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

                {/* Message serveur */}
                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
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

          {/* === Panneau latéral — infos & SLA === */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
                {t("contact.channels")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/20">
                    <Mail className="h-4 w-4 text-[#F26D3D]" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {t("contact.channel.email")}
                    </p>
                    <a href={`mailto:${siteConfig.email}`} className="text-sm text-slate-700 dark:text-slate-200 hover:text-[#F26D3D] transition-colors">
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

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
                {t("contact.sla.title")}
              </h3>
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
        </div>
      </section>
    </div>
  );
}

/* === Champ terminal réutilisable === */
interface TerminalFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
}

function TerminalField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
}: TerminalFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 mb-2"
      >
        {label} {required && <span className="text-[#F26D3D]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={cn(
          "terminal-input w-full rounded-lg bg-black/30 border px-3.5 py-2.5 font-mono text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 outline-none transition",
          error ? "border-[#F26D3D]/60" : "border-black/10 dark:border-white/10"
        )}
      />
      {error && (
        <p
          id={`${name}-err`}
          className="mt-1.5 font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5"
        >
          <AlertTriangle className="h-3 w-3" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}
