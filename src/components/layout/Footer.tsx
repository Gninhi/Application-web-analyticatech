"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Send, ShieldCheck, Github, Linkedin, Twitter } from "lucide-react";

import { type ViewKey } from "@/types/content";
import { usePathname } from "next/navigation";
import { viewToPath, getLocaleFromPath } from "@/lib/navigation/routes";
import { NavLink } from "@/components/interactive/NavLink";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { isValidSocialUrl } from "@/lib/content/site";

const SOCIAL_ICONS = { Linkedin, Twitter, Github };

/** Horloge temps réel au format UTC HH:MM:SS.
 *  Mise à jour limitée (~1 tick/5s) et démarrée après le chargement/idle :
 *  un tick toutes les secondes pendant la fenêtre de chargement crée des
 *  tâches main-thread inutiles (pénalise TBT et LCP simulé). */
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
    let id: number | null = null;
    const startTicking = () => {
      id = window.setInterval(update, 5000);
    };
    if (typeof requestIdleCallback === "function") {
      id = requestIdleCallback(startTicking);
    } else {
      id = window.setTimeout(startTicking, 5000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, []);
  return time;
}

export function Footer() {
  const pathname = usePathname() || "/";
  const currentLocale = getLocaleFromPath(pathname);
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

  const handleOpenCookiePreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("at:open-cookie-preferences"));
    }
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
              Cabinet de conseil en IA, Automatisation & Workflows et Décision Augmentée.
              Architecture de systèmes intelligents à l&apos;échelle.
            </p>

            {/* Indicateur de statut système */}
            <div className="inline-flex items-center gap-2.5 rounded-lg glass px-3 py-2">
              <span
                className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse"
                aria-hidden
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-300">
                System Online
              </span>

              <span className="mx-1 h-3 w-px bg-black/15 dark:bg-white/15" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                UTC {utc}
              </span>
            </div>
          </div>

          {/* Navigation secondaire */}
          <nav className="md:col-span-2" aria-label={t("footer.nav.title")}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.nav.title")}
            </h2>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <NavLink variant="footer" href={viewToPath(item.key, undefined, currentLocale)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertises */}
          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.expertises.title")}
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={viewToPath("service-detail", s.index, currentLocale)}
                    className="hover:text-[#F26D3D] transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              {t("footer.newsletter.title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {t("footer.newsletter.desc")}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  id="footer-newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletter.placeholder")}
                  aria-label="Adresse email pour la newsletter"
                  className="terminal-input flex-1 min-w-0 min-h-9 rounded-lg bg-black/30 border border-black/10 dark:border-white/10 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 outline-none transition"
                />
                <Button
                  type="submit"
                  aria-label="S'abonner à la newsletter"
                  iconOnly
                  borderRadius="0.5rem"
                  duration={3500}
                  icon={<Send className="h-4 w-4" aria-hidden />}
                  className="h-9 w-9 shrink-0 bg-[#C9470F] text-white hover:bg-[#B63C0C]"
                />
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
              ]
                .filter((s): s is { label: string; url: string; icon: string } => isValidSocialUrl(s.url))
                .map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS];
                  return (
                    <a
                      key={social.label}
                      href={social.url}
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
            <Link
              href={viewToPath("rgpd", undefined, currentLocale)}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] px-2 py-1"
            >
              {t("footer.confidentiality")}
            </Link>
            <Link
              href={viewToPath("legal", undefined, currentLocale)}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] px-2 py-1"
            >
              {t("footer.legal")}
            </Link>
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] px-2 py-1 cursor-pointer transition-colors"
            >
              {t("footer.cookies")}
            </button>
            <Link
              href={viewToPath("about", undefined, currentLocale)}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#F26D3D] px-2 py-1"
            >
              {t("footer.about")}
            </Link>
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
