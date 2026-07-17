"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import * as dataFr from "@/lib/data";
import * as dataEn from "@/lib/data-en";

export type Locale = "fr" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "at-locale";

/**
 * I18nProvider — fournisseur de contexte pour l'internationalisation.
 *
 * - Persiste le choix de langue dans localStorage.
 * - Met à jour `lang` sur <html> pour l'accessibilité et le SEO.
 * - Expose `t(key)` pour les traductions UI et `locale` pour les données.
 *
 * Les dictionnaires de traduction sont dans `translations.ts`.
 */
export function I18nProvider({ children, initialLocale = "fr" }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Initialise depuis localStorage (post-hydration via rAF pour éviter le mismatch)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "fr" || stored === "en") {
        setLocaleState(stored);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Met à jour <html lang> + localStorage quand la locale change
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale];
      return dict[key] ?? translations.fr[key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Hook pour accéder aux traductions et à la locale courante. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n doit être utilisé dans un I18nProvider");
  }
  return ctx;
}

// Alias court
export const useTranslation = useI18n;

/**
 * Hook pour accéder aux données localisées (SERVICES, SOLUTIONS, etc.).
 * Retourne les données FR ou EN selon la locale courante.
 */
export function useLocalizedData() {
  const { locale } = useI18n();
  return locale === "en" ? dataEn : dataFr;
}

/**
 * Dictionnaires de traduction UI.
 * Organisés par namespace : nav, footer, home, services, etc.
 */
const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // === NAVBAR ===
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.solutions": "Solutions",
    "nav.blog": "Insights",
    "nav.contact": "Contact",
    "nav.cta": "Demander un devis",
    "nav.menu.open": "Ouvrir le menu de navigation",
    "nav.menu.close": "Fermer le menu",
    "nav.menu.status": "Panel de Commande // ACTIF",
    "nav.menu.footer": "Analyticatech — Connexion Sécurisée Établie",

    // === FOOTER ===
    "footer.nav.title": "Navigation",
    "footer.expertises.title": "Expertises",
    "footer.newsletter.title": "Newsletter Insights",
    "footer.newsletter.desc": "Recevez nos analyses techniques sur l'IA en production.",
    "footer.newsletter.placeholder": "vous@entreprise.com",
    "footer.newsletter.confirmed": "✓ Abonnement confirmé",
    "footer.copyright": "Tous droits réservés",
    "footer.confidentiality": "Confidentialité",
    "footer.legal": "Mentions légales",
    "footer.about": "À propos",
    "footer.status.online": "System Online",
    "footer.compliance": "ISO 27001 · RGPD",

    // === HOME ===
    "home.badge": "Cabinet IA · Transformation · Automatisation",
    "home.hero.title1": "LE FUTUR DE",
    "home.hero.title2": "L'INTELLIGENCE",
    "home.hero.desc": "Nous concevons et industrialisons des systèmes à base d'IA, d'agents cognitifs et d'automatisations critiques. De l'architecture au déploiement, nous transformons vos processus métier en avantage concurrentiel durable.",
    "home.hero.cta1": "Explorer nos services",
    "home.hero.cta2": "Demander un devis",
    "home.section.monolith": "// 01 — MONOLITHE",
    "home.section.monolith.title": "Une expertise, cinq piliers technologiques",
    "home.section.monolith.desc": "Un monolithe d'expertise couvrant l'ensemble de la chaîne de valeur de l'IA appliquée — de la donnée brute à la décision autonome.",
    "home.section.datastream": "// 02 — FLUX DE DONNÉES",
    "home.section.datastream.title": "La donnée, en flux continu",
    "home.section.datastream.desc": "Un aperçu live de notre infrastructure de monitoring. Chaque mission alimente une télémétrie partagée et observable.",
    "home.section.capabilities": "// 03 — CAPACITÉS",
    "home.section.capabilities.title": "Un système voit. Tous savent.",
    "home.section.capabilities.desc": "Nos architectures agentiques fonctionnent en réseau coordonné. La signature d'une plateforme de classe bancaire : détection, réponse, apprentissage — en continu.",
    "home.section.trust": "// 04 — SIGNAL DE CONFIANCE",
    "home.section.trust.title": "Ils nous confient leurs systèmes critiques",
    "home.section.trust.desc": "Directions générales, CIO et C-Level d'organisations européennes : la confiance se construit sur la livraison.",
    "home.section.cta.title": "Construisons votre architecture IA",
    "home.section.cta.desc": "Un échange d'une heure avec un architecte Solution pour cadrer votre besoin.",
    "home.section.cta.button": "Planifier l'échange",
    "home.section.cta.tag": "// Prêt à initier ?",
    "home.features.title": "Précision fondatrice. Conçu pour durer.",
    "home.features.desc": "Quatre capacités fondamentales, instrumentées et auditables. Chaque déploiement s'appuie sur ce socle opérationnel.",
    "home.bespoke.title": "Besoin sur-mesure ?",
    "home.bespoke.desc": "Co-construisons votre architecture cible avec nos architectes Solution.",
    "home.bespoke.cta": "Initier un projet",

    // === SERVICES ===
    "services.title": "Cinq couches d'expertise, empilées avec précision",
    "services.desc": "Chaque service est une couche de notre monolithe. Défilez : les cartes se superposent et se collent en haut — la précédente disparaît sous la suivante, révélation par révélation.",
    "services.method.title": "Du cadrage au run, sans rupture",
    "services.method.desc": "Notre livraison suit un cycle itératif à 4 phases, chacune livrant de la valeur observable. Aucun « big bang » : chaque incrément est mis en production et monitoré.",
    "services.method.cta": "Cadrer votre mission",
    "services.card.cta": "Démarrer ce service",

    // === SOLUTIONS ===
    "solutions.title1": "Des solutions sectorielles,",
    "solutions.title2": "en orbite",
    "solutions.desc": "Défilez verticalement : les cas d'usage défilent horizontalement comme une séquence orbitale. Chaque solution est prête à être adaptée à votre contexte.",
    "solutions.card.cta": "En savoir plus",
    "solutions.final.title": "Votre secteur n'est pas listé ?",
    "solutions.final.desc": "Nous concevons des solutions sur-mesure. Expliquons-nous votre cas d'usage en 30 minutes.",
    "solutions.final.cta": "Briefing express",
    "solutions.confiance.sovereignty": "Souveraineté garantie",
    "solutions.confiance.sovereignty.desc": "Hébergement SecNumCloud, données chiffrées bout-en-bout, code audité.",
    "solutions.confiance.time": "Time-to-value court",
    "solutions.confiance.time.desc": "Premier incrément en production sous 6 semaines, en moyenne.",
    "solutions.confiance.long": "Accompagnement long",
    "solutions.confiance.long.desc": "Du discovery au run : une équipe dédiée, sans rotation intempestive.",

    // === BLOG ===
    "blog.title1": "Rapports techniques &",
    "blog.title2": "retours de terrain",
    "blog.desc": "Nos architectes partagent leurs analyses : patterns de production, choix d'outillage et leçons apprises sur les missions.",
    "blog.filter.all": "Tous les rapports",
    "blog.empty": "Aucun rapport dans cette catégorie.",

    // === CONTACT ===
    "contact.title1": "Établissons une",
    "contact.title2": "connexion sécurisée",
    "contact.desc": "Décrivez votre besoin. Un architecte Solution vous répond sous 24h ouvrées. Toutes les transmissions sont chiffrées et journalisées.",
    "contact.execute": "EXÉCUTER",
    "contact.encrypting": "CHIFFREMENT... TRANSMISSION...",
    "contact.success": "Transmission sécurisée confirmée. Un architecte Analyticatech vous répondra sous 24h ouvrées.",
    "contact.fields.prenom": "PRENOM",
    "contact.fields.nom": "NOM",
    "contact.fields.email": "EMAIL_PRO",
    "contact.fields.entreprise": "ENTREPRISE",
    "contact.fields.sujet": "SUJET",
    "contact.fields.message": "MESSAGE",
    "contact.consent": "J'accepte que mes données soient traitées par Analyticatech pour répondre à ma demande, conformément à la politique de confidentialité. Aucune revente, suppression sous 90 jours.",
    "contact.consent.error": "Vous devez accepter la politique de confidentialité",
    "contact.channels": "Canaux alternatifs",
    "contact.sla.title": "Engagement de réponse",
    "contact.sla.ack": "Premier accusé de réception",
    "contact.sla.ack.v": "< 2h ouvrées",
    "contact.sla.architect": "Réponse d'un architecte",
    "contact.sla.architect.v": "< 24h ouvrées",
    "contact.sla.workshop": "Atelier de cadrage proposé",
    "contact.sla.workshop.v": "< 5 jours",
    "contact.sla.urgent": "Disponibilités d'urgence",
    "contact.sla.urgent.v": "24/7 critique",
    "contact.confidentiality.title": "Confidentialité garantie",
    "contact.confidentiality.desc": "Vos informations sont traitées en toute confidentialité. Nous signons systématiquement un NDA avant tout échange technique détaillé. Données supprimées sous 90 jours en l'absence de suite.",

    // === LEGAL ===
    "legal.rgpd.title": "Politique de Confidentialité",
    "legal.rgpd.subtitle": "RGPD — Protection des données personnelles",
    "legal.legal.title": "Mentions Légales",
    "legal.legal.subtitle": "Informations légales et éditeur du site",
    "legal.back": "Retour à l'accueil",
    "legal.contact.question": "Une question sur ce document ?",
    "legal.contact.cta": "Nous contacter",

    // === ABOUT ===
    "about.title": "À propos d'Analyticatech",
    "about.desc": "Cabinet de conseil de haut niveau en IA, Transformation Digitale et Automatisation. Nous concevons et industrialisons des systèmes intelligents à l'échelle.",
    "about.mission.title": "Notre Mission",
    "about.vision.title": "Notre Vision",
    "about.values.title": "Nos Valeurs",
    "about.cta": "Travaillons ensemble",

    // === COMMON ===
    "common.back": "Retour",
    "common.contact": "Nous contacter",
    "common.start": "Démarrer",
    "common.learn": "En savoir plus",
    "common.read": "Lire",
    "common.deployed": "Déployé en production",
    "common.impact": "Impact mesuré",
    "common.techStack": "Stack technologique",
    "common.metrics": "Métriques clés",
    "common.presentation": "Présentation",
    "common.context": "Contexte",
    "common.keyPoints": "Points clés",
  },

  en: {
    // === NAVBAR ===
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.solutions": "Solutions",
    "nav.blog": "Insights",
    "nav.contact": "Contact",
    "nav.cta": "Request a quote",
    "nav.menu.open": "Open navigation menu",
    "nav.menu.close": "Close menu",
    "nav.menu.status": "Command Panel // ACTIVE",
    "nav.menu.footer": "Analyticatech — Secure Connection Established",

    // === FOOTER ===
    "footer.nav.title": "Navigation",
    "footer.expertises.title": "Expertise",
    "footer.newsletter.title": "Insights Newsletter",
    "footer.newsletter.desc": "Receive our technical analysis on production AI.",
    "footer.newsletter.placeholder": "you@company.com",
    "footer.newsletter.confirmed": "✓ Subscription confirmed",
    "footer.copyright": "All rights reserved",
    "footer.confidentiality": "Privacy",
    "footer.legal": "Legal Notice",
    "footer.about": "About",
    "footer.status.online": "System Online",
    "footer.compliance": "ISO 27001 · GDPR",

    // === HOME ===
    "home.badge": "AI Firm · Transformation · Automation",
    "home.hero.title1": "THE FUTURE OF",
    "home.hero.title2": "INTELLIGENCE",
    "home.hero.desc": "We design and industrialize AI-based systems, cognitive agents and critical automations. From architecture to deployment, we transform your business processes into a sustainable competitive advantage.",
    "home.hero.cta1": "Explore our services",
    "home.hero.cta2": "Request a quote",
    "home.section.monolith": "// 01 — MONOLITH",
    "home.section.monolith.title": "One expertise, five technological pillars",
    "home.section.monolith.desc": "A monolith of expertise covering the entire AI value chain — from raw data to autonomous decision-making.",
    "home.section.datastream": "// 02 — DATA STREAM",
    "home.section.datastream.title": "Data, in continuous flow",
    "home.section.datastream.desc": "A live overview of our monitoring infrastructure. Every mission feeds shared, observable telemetry.",
    "home.section.capabilities": "// 03 — CAPABILITIES",
    "home.section.capabilities.title": "One system sees. All know.",
    "home.section.capabilities.desc": "Our agentic architectures operate as a coordinated network. The signature of a banking-grade platform: detection, response, learning — continuously.",
    "home.section.trust": "// 04 — TRUST SIGNAL",
    "home.section.trust.title": "They entrust us with their critical systems",
    "home.section.trust.desc": "Executive boards, CIOs and C-Levels of European organizations: trust is built on delivery.",
    "home.section.cta.title": "Let's build your AI architecture",
    "home.section.cta.desc": "A one-hour exchange with a Solution Architect to frame your needs.",
    "home.section.cta.button": "Schedule the exchange",
    "home.section.cta.tag": "// Ready to start?",
    "home.features.title": "Grounded in precision. Built to scale.",
    "home.features.desc": "Four fundamental capabilities, instrumented and auditable. Every deployment relies on this operational foundation.",
    "home.bespoke.title": "Custom needs?",
    "home.bespoke.desc": "Let's co-build your target architecture with our Solution Architects.",
    "home.bespoke.cta": "Start a project",

    // === SERVICES ===
    "services.title": "Five layers of expertise, stacked with precision",
    "services.desc": "Each service is a layer of our monolith. Scroll: cards stack and stick at the top — the previous one disappears under the next, revelation by revelation.",
    "services.method.title": "From framing to run, without rupture",
    "services.method.desc": "Our delivery follows an iterative 4-phase cycle, each delivering observable value. No « big bang »: every increment goes to production and is monitored.",
    "services.method.cta": "Frame your mission",
    "services.card.cta": "Start this service",

    // === SOLUTIONS ===
    "solutions.title1": "Sectoral solutions,",
    "solutions.title2": "in orbit",
    "solutions.desc": "Scroll vertically: use cases flow horizontally like an orbital sequence. Each solution is ready to be adapted to your context.",
    "solutions.card.cta": "Learn more",
    "solutions.final.title": "Your sector not listed?",
    "solutions.final.desc": "We design custom solutions. Let's discuss your use case in 30 minutes.",
    "solutions.final.cta": "Express briefing",
    "solutions.confiance.sovereignty": "Guaranteed sovereignty",
    "solutions.confiance.sovereignty.desc": "SecNumCloud hosting, end-to-end encrypted data, audited code.",
    "solutions.confiance.time": "Short time-to-value",
    "solutions.confiance.time.desc": "First increment in production within 6 weeks on average.",
    "solutions.confiance.long": "Long-term support",
    "solutions.confiance.long.desc": "From discovery to run: a dedicated team, no rotation.",

    // === BLOG ===
    "blog.title1": "Technical reports &",
    "blog.title2": "field feedback",
    "blog.desc": "Our architects share their analyses: production patterns, tooling choices and lessons learned in the field.",
    "blog.filter.all": "All reports",
    "blog.empty": "No reports in this category.",

    // === CONTACT ===
    "contact.title1": "Let's establish a",
    "contact.title2": "secure connection",
    "contact.desc": "Describe your needs. A Solution Architect will respond within 24 business hours. All transmissions are encrypted and logged.",
    "contact.execute": "EXECUTE",
    "contact.encrypting": "ENCRYPTING... TRANSMITTING...",
    "contact.success": "Secure transmission confirmed. An Analyticatech architect will respond within 24 business hours.",
    "contact.fields.prenom": "FIRST NAME",
    "contact.fields.nom": "LAST NAME",
    "contact.fields.email": "PROFESSIONAL EMAIL",
    "contact.fields.entreprise": "COMPANY",
    "contact.fields.sujet": "SUBJECT",
    "contact.fields.message": "MESSAGE",
    "contact.consent": "I agree that my data may be processed by Analyticatech to respond to my request, in accordance with the privacy policy. No resale, deletion within 90 days.",
    "contact.consent.error": "You must accept the privacy policy",
    "contact.channels": "Alternative channels",
    "contact.sla.title": "Response commitment",
    "contact.sla.ack": "First acknowledgment",
    "contact.sla.ack.v": "< 2 business hours",
    "contact.sla.architect": "Architect response",
    "contact.sla.architect.v": "< 24 business hours",
    "contact.sla.workshop": "Scoping workshop proposed",
    "contact.sla.workshop.v": "< 5 days",
    "contact.sla.urgent": "Emergency availability",
    "contact.sla.urgent.v": "24/7 critical",
    "contact.confidentiality.title": "Guaranteed confidentiality",
    "contact.confidentiality.desc": "Your information is treated in strict confidence. We systematically sign an NDA before any detailed technical exchange. Data deleted within 90 days if no follow-up.",

    // === LEGAL ===
    "legal.rgpd.title": "Privacy Policy",
    "legal.rgpd.subtitle": "GDPR — Personal data protection",
    "legal.legal.title": "Legal Notice",
    "legal.legal.subtitle": "Legal information and site publisher",
    "legal.back": "Back to home",
    "legal.contact.question": "A question about this document?",
    "legal.contact.cta": "Contact us",

    // === ABOUT ===
    "about.title": "About Analyticatech",
    "about.desc": "High-level consulting firm in AI, Digital Transformation and Automation. We design and industrialize intelligent systems at scale.",
    "about.mission.title": "Our Mission",
    "about.vision.title": "Our Vision",
    "about.values.title": "Our Values",
    "about.cta": "Let's work together",

    // === COMMON ===
    "common.back": "Back",
    "common.contact": "Contact us",
    "common.start": "Start",
    "common.learn": "Learn more",
    "common.read": "Read",
    "common.deployed": "Deployed in production",
    "common.impact": "Measured impact",
    "common.techStack": "Technology stack",
    "common.metrics": "Key metrics",
    "common.presentation": "Overview",
    "common.context": "Context",
    "common.keyPoints": "Key points",
  },
};
