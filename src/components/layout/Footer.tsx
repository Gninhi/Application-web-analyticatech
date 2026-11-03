"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, ShieldCheck, Github, Linkedin, Twitter } from "lucide-react";

import { type ViewKey } from "@/types/content";
import { usePathname } from "next/navigation";
import { viewToPath, getLocaleFromPath } from "@/lib/navigation/routes";
import { NavLink } from "@/components/interactive/NavLink";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { isValidSocialUrl } from "@/lib/content/site";
import { isAnalyticsConfigured } from "@/instrumentation-client";

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

/** Lien du pied de page (colonnes) : cible tactile ≥ 44 px sur mobile. */
const COLUMN_LINK =
  "inline-flex min-h-11 items-center text-sm text-slate-600 dark:text-[#B6C2D6] hover:text-accent-ink transition-colors sm:min-h-0 sm:py-1";
/** Lien de la barre légale. */
const LEGAL_LINK =
  "inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-accent-ink transition-colors sm:min-h-0 sm:py-1";
const COLUMN_TITLE = "font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink mb-3 sm:mb-4";

/**
 * Footer — pied de page commun.
 *
 * Inspiré des pieds de page primés (Awwwards) sans en reprendre un : appel au
 * premier échange en tête, colonnes de navigation, barre légale, puis logotype
 * en pleine largeur comme signature. Mise en page fluide : 1 colonne (mobile),
 * 2 (tablette), 12 colonnes (desktop) ; aucun débordement horizontal, liens à
 * 44 px de hauteur tactile sur mobile.
 */
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
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-[#F0F4F8] dark:bg-[#06070B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20">
        {/* 1 — Appel au premier échange */}
        <div className="grid gap-8 pb-10 sm:pb-12 border-b border-black/10 dark:border-white/10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className={COLUMN_TITLE}>{t("footer.cta.tag")}</p>
            <h2 className="font-display font-bold tracking-tight text-slate-900 dark:text-white text-[clamp(1.875rem,5vw,3.5rem)] leading-[1.05] text-balance">
              {t("footer.cta.title")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-[26px] text-slate-600 dark:text-[#B6C2D6]">
              {t("footer.cta.desc")}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:col-span-4 lg:flex-col lg:items-end">
            <Button
              href={viewToPath("contact", undefined, currentLocale)}
              variant="primary"
              size="lg"
              data-cta="footer_premier_echange"
              icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              {t("nav.cta")}
            </Button>
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`${t("footer.contact.email")} : ${siteConfig.email}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 break-all font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white underline decoration-[#F26D3D] decoration-2 underline-offset-[6px] hover:text-accent-ink transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                {siteConfig.email}
              </a>
            )}
          </div>
        </div>

        {/* 2 — Colonnes */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <p className="max-w-sm text-sm leading-[22px] text-slate-600 dark:text-[#B6C2D6]">{t("footer.tagline")}</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-[#B6C2D6]">{t("footer.location")}</p>
          </div>

          <nav className="lg:col-span-2" aria-label={t("footer.nav.title")}>
            <h2 className={COLUMN_TITLE}>{t("footer.nav.title")}</h2>
            <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-1 sm:space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <NavLink variant="footer" href={viewToPath(item.key, undefined, currentLocale)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className={COLUMN_TITLE}>{t("footer.expertises.title")}</h2>
            <ul className="sm:space-y-1.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link href={viewToPath("service-detail", s.index, currentLocale)} className={COLUMN_LINK}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={COLUMN_TITLE}>{t("footer.contact.title")}</h2>
            <ul className="sm:space-y-1.5">
              <li>
                <Link href={viewToPath("contact", undefined, currentLocale)} className={COLUMN_LINK}>
                  {t("nav.cta")}
                </Link>
              </li>
              <li>
                <Link href={viewToPath("about", undefined, currentLocale)} className={COLUMN_LINK}>
                  {t("footer.about")}
                </Link>
              </li>
            </ul>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-2" aria-label={t("footer.social.title")}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-slate-600 dark:text-slate-400 hover:text-accent-ink hover:border-[#F26D3D]/40 transition-colors"
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

        {/* 3 — Barre légale */}
        <div className="flex flex-col gap-4 border-t border-black/10 dark:border-white/10 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-x-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <p className="col-span-2 mb-1 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 sm:mb-0">
              © {new Date().getFullYear()} Analyticatech — {t("footer.copyright")}
            </p>
            <Link href={viewToPath("rgpd", undefined, currentLocale)} className={LEGAL_LINK}>
              {t("footer.confidentiality")}
            </Link>
            <Link href={viewToPath("legal", undefined, currentLocale)} className={LEGAL_LINK}>
              {t("footer.legal")}
            </Link>
            {isAnalyticsConfigured && (
              <button type="button" onClick={handleOpenCookiePreferences} className={`${LEGAL_LINK} cursor-pointer text-left`}>
                {t("footer.cookies")}
              </button>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-link" aria-hidden />
            {t("footer.compliance")}
          </span>
        </div>

        {/* 4 — Signature : logotype officiel en pleine largeur */}
        <div className="pb-6 sm:pb-8">
          <BrandLogo variant="mot" fluid alt="Analyticatech" />
        </div>
      </div>
    </footer>
  );
}
