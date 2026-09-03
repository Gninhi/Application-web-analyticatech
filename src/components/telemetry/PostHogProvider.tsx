"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  initTelemetryClient,
  trackPageView,
  trackCtaClick,
  trackScrollDepth,
  trackClientException,
} from "@/instrumentation-client";
import {
  isAnalyticsAllowed,
  type ConsentProof,
} from "@/components/branding/CookieConsent";

/**
 * Composant client gérant le cycle de vie de la télémétrie PostHog :
 * - Initialisation lazy au montage conditionnée au consentement CNIL 2026
 * - Suivi automatique des routes Next.js ($pageview)
 * - Suivi des paliers de scroll (25%, 50%, 75%, 90%) sur les pages de contenu
 * - Suivi des clics sur les boutons CTA
 * - Capture automatique des erreurs JS non gérées
 */
export function PostHogTelemetry() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reportedScrollMilestones = useRef<Set<number>>(new Set());

  // 1. Initialisation client PostHog (seulement si consentement préalablement accordé)
  useEffect(() => {
    if (isAnalyticsAllowed()) {
      initTelemetryClient();
    }
  }, []);

  // 2. Écoute dynamique du consentement pour déclencher la première vue de page si accordée
  useEffect(() => {
    const handleConsent = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentProof | "accepted" | "refused">;
      const allowed =
        typeof customEvent.detail === "string"
          ? customEvent.detail === "accepted"
          : customEvent.detail?.choices?.analytics === true;

      if (allowed) {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        trackPageView(url);
      }
    };

    window.addEventListener("at:consent-change", handleConsent);
    return () => {
      window.removeEventListener("at:consent-change", handleConsent);
    };
  }, [pathname, searchParams]);

  // 3. Vue de page ($pageview) à chaque transition de route (si consenti)
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
    // Réinitialisation des paliers de scroll pour la nouvelle page
    reportedScrollMilestones.current.clear();
  }, [pathname, searchParams]);

  // 3. Suivi automatique des clics CTA principaux
  useEffect(() => {
    const handleCtaClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cta], a[href*='/contact'], a[href*='#contact'], button[data-action]"
      );
      if (!target) return;

      const ctaName =
        target.getAttribute("data-cta") ||
        target.getAttribute("data-action") ||
        target.textContent?.trim() ||
        "CTA Button";

      const href = target.getAttribute("href") || undefined;
      const section = target.closest("section")?.id || "global";

      trackCtaClick(ctaName, section, href);
    };

    document.addEventListener("click", handleCtaClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleCtaClick);
    };
  }, []);

  // 4. Suivi de profondeur de scroll (Scroll Depth) sur les pages longues
  useEffect(() => {
    // Uniquement sur les pages à fort contenu (services, solutions, blog, accueil)
    const isScrollTrackedRoute =
      pathname === "/" ||
      pathname === "/en" ||
      pathname.includes("/services") ||
      pathname.includes("/solutions") ||
      pathname.includes("/insights");

    if (!isScrollTrackedRoute) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) {
          ticking = false;
          return;
        }

        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        const milestones = [25, 50, 75, 90];

        for (const milestone of milestones) {
          if (
            scrollPercent >= milestone &&
            !reportedScrollMilestones.current.has(milestone)
          ) {
            reportedScrollMilestones.current.add(milestone);
            trackScrollDepth(milestone, pathname);
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // 5. Capture automatique des erreurs JavaScript non rattrapées
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackClientException(event.error || event.message, {
        route: window.location.pathname,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackClientException(
        event.reason instanceof Error ? event.reason : String(event.reason),
        {
          route: window.location.pathname,
        }
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
