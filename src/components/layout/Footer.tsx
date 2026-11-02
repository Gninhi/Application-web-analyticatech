"use client";


import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Github, Linkedin, Twitter } from "lucide-react";

import { type ViewKey } from "@/types/content";
import { usePathname } from "next/navigation";
import { viewToPath, getLocaleFromPath } from "@/lib/navigation/routes";
import { NavLink } from "@/components/interactive/NavLink";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { isValidSocialUrl } from "@/lib/content/site";

export interface SocialLinkItem {
  id: "linkedin" | "twitter" | "github";
  label: string;
  url: string;
  icon: typeof Linkedin;
}

export function getValidSocialLinks(config: {
  socialLinkedin?: string | null;
  socialTwitter?: string | null;
  socialGithub?: string | null;
}): SocialLinkItem[] {
  const definitions: Array<{
    id: SocialLinkItem["id"];
    label: string;
    url: string | null | undefined;
    icon: typeof Linkedin;
  }> = [
    { id: "linkedin", label: "LinkedIn", url: config.socialLinkedin, icon: Linkedin },
    { id: "twitter", label: "Twitter / X", url: config.socialTwitter, icon: Twitter },
    { id: "github", label: "GitHub", url: config.socialGithub, icon: Github },
  ];

  return definitions.filter(
    (item): item is SocialLinkItem =>
      Boolean(item.url) &&
      item.url !== "#" &&
      item.url !== "javascript:void(0)" &&
      isValidSocialUrl(item.url)
  );
}

export function Footer() {
  const pathname = usePathname() || "/";
  const currentLocale = getLocaleFromPath(pathname);
  const { t } = useI18n();
  const { navItems, services, siteConfig } = useAppContent();
  const NAV_ITEMS = navItems.map((n) => ({ key: n.viewKey as ViewKey, label: n.label }));
  const socialLinks = getValidSocialLinks(siteConfig);

  const handleOpenCookiePreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("at:open-cookie-preferences"));
    }
  };

  return (
    <footer className="relative mt-auto border-t border-border bg-[#F4F6FA] dark:bg-[#011C40]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Marque + statut */}
          <div className="md:col-span-4">
            <div className="mb-5">
              <BrandLogo height={52} signature alt="Analyticatech — L'IA, expliquée simplement" />
            </div>
            <p className="text-sm text-slate-600 dark:text-[#B6C2D6] max-w-xs mb-5">
              {currentLocale === "en" ? "AI consulting for SME and mid-market leaders: AI agents, automation, data and EU AI Act compliance." : "Conseil en intelligence artificielle pour les dirigeants de PME et d'ETI : agents IA, automatisation, données et conformité AI Act."}
            </p>
            <p className="text-sm text-slate-600 dark:text-[#B6C2D6]">
              {currentLocale === "en" ? "Head office in Paris · Office in Strasbourg" : "Siège à Paris · Bureau à Strasbourg"}
            </p>
          </div>

          {/* Navigation secondaire */}
          <nav className="md:col-span-2" aria-label={t("footer.nav.title")}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink mb-4">
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
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink mb-4">
              {t("footer.expertises.title")}
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={viewToPath("service-detail", s.index, currentLocale)}
                    className="hover:text-accent-ink transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premier échange */}
          <div className="md:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink mb-4">
              {currentLocale === "en" ? "First call" : "Premier échange"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#B6C2D6] mb-4">
              {currentLocale === "en" ? "Let's take 20 minutes to scope your needs." : "Prenons 20 minutes pour cadrer votre besoin."}
            </p>
            <Link
              href={viewToPath("contact", undefined, currentLocale)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F26D3D] px-4 py-2.5 text-[14px] font-semibold text-[#011C40] hover:bg-[#E35F31] transition-colors"
              data-cta="footer_premier_echange"
            >
              {currentLocale === "en" ? "Book a call" : "Prendre rendez-vous"}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-slate-500 dark:text-slate-400 hover:text-accent-ink transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
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
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-accent-ink px-2 py-1"
            >
              {t("footer.confidentiality")}
            </Link>
            <Link
              href={viewToPath("legal", undefined, currentLocale)}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-accent-ink px-2 py-1"
            >
              {t("footer.legal")}
            </Link>
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-accent-ink px-2 py-1 cursor-pointer transition-colors"
            >
              {t("footer.cookies")}
            </button>
            <Link
              href={viewToPath("about", undefined, currentLocale)}
              className="font-mono text-[10px] uppercase tracking-widest bg-transparent text-slate-500 dark:text-slate-400 hover:text-accent-ink px-2 py-1"
            >
              {t("footer.about")}
            </Link>
       </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-link" aria-hidden />
              {t("footer.compliance")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
