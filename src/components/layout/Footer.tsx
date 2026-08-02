"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck, Github, Linkedin, Twitter } from "lucide-react";
import { type ViewKey } from "@/lib/i18n/data-fr";
import { NavLink } from "@/components/interactive/NavLink";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/moving-border";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";

const SOCIAL_ICONS = { Linkedin, Twitter, Github };

interface FooterProps {
  onNavigate: (view: ViewKey) => void;
}

/** Horloge temps réel au format UTC HH:MM:SS. */
function useUtcClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Footer({ onNavigate }: FooterProps) {
  const utc = useUtcClock();
  const { t } = useI18n();
  const { navItems, services, siteConfig } = useAppContent();
  const NAV_ITEMS = navItems.map((n) => ({ key: n.viewKey as ViewKey, label: n.label }));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative mt-auto border-t border-black/10 dark:border-white/10 glass-card">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Marque + statut */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={36} delay={0.3} />
              <span className="font-display text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-5">
              Cabinet de conseil en IA, Transformation Digitale et Automatisation.
              Architecture de systèmes intelligents à l&apos;échelle.
            </p>

            {/* Indicateur de statut système */}
            <div className="inline-flex items-center gap-2.5 rounded-lg glass px-3 py-2">
              <motion.span
                className="h-2 w-2 rounded-full bg-[#4CAF50]"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-300">
                System Online
              </span>
              <span className="mx-1 h-3 w-px bg-white/15" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                UTC {utc}
              </span>
            </div>
          </div>

          {/* Navigation secondaire */}
          <nav className="md:col-span-2" aria-label={t("footer.nav.title")}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.nav.title")}
            </h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <NavLink
                    variant="footer"
                    onClick={() => onNavigate(item.key)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertises */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.expertises.title")}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {t("footer.newsletter.desc")}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletter.placeholder")}
                  aria-label="Adresse email pour la newsletter"
                  className="terminal-input flex-1 min-w-0 rounded-lg bg-black/30 border border-black/10 dark:border-white/10 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 outline-none transition"
                />
                <Button
                  type="submit"
                  aria-label="S'abonner à la newsletter"
                  borderRadius="0.5rem"
                  duration={3500}
                  className="h-9 w-9 shrink-0 flex items-center justify-center bg-[#F26D3D] text-white transition hover:bg-[#ff7a4a]"
                >
                  <Send className="h-4 w-4" aria-hidden />
            </Button>
              </div>
              {subscribed && (
                <p className="font-mono text-[10px] text-[#4CAF50] uppercase tracking-wider">
                  {t("footer.newsletter.confirmed")}
                </p>
              )}
            </form>

            <div className="flex items-center gap-3 mt-5">
              {[
                { label: "LinkedIn", url: siteConfig.socialLinkedin, icon: "Linkedin" },
                { label: "Twitter / X", url: siteConfig.socialTwitter, icon: "Twitter" },
                { label: "GitHub", url: siteConfig.socialGithub, icon: "Github" },
              ].filter((s) => s.url).map((social) => {
                const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS];
                return (
                  <a
                    key={social.label}
                    href={social.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg glass text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Analyticatech — {t("footer.copyright")}
          </p>
            <Button
              onClick={() => onNavigate("rgpd")}
              borderRadius="0.375rem"
              duration={4000}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] transition-colors px-2 py-1"
            >
              {t("footer.confidentiality")}
         </Button>
            <Button
              onClick={() => onNavigate("legal")}
              borderRadius="0.375rem"
              duration={4000}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] transition-colors px-2 py-1"
            >
              {t("footer.legal")}
         </Button>
            <Button
              onClick={() => onNavigate("about")}
              borderRadius="0.375rem"
              duration={4000}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] transition-colors px-2 py-1"
            >
              {t("footer.about")}
         </Button>
       </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4CAF50]" aria-hidden />
              {t("footer.compliance")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              v2.4.1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
