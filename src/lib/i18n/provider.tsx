"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

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
 * Les dictionnaires de traduction sont définis inline ci-dessous.
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

  // Met à jour <html lang>, localStorage + Cookie quand la locale change
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
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
      const value = dict[key];
      if (value !== undefined) return value;
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Clé manquante pour la locale "${locale}": "${key}"`);
      }
      return translations.fr[key] ?? key;
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
    "footer.compliance": "ISO 27001 · RGPD",

    // === HOME ===
    "home.badge": "Cabinet de Conseil IA · Transformation · Automatisation",
    "home.hero.title1": "DES SYSTÈMES",
    "home.hero.keyword": "INTELLIGENTS",
    "home.hero.title2": "pour des opérations plus simples.",
    "home.hero.desc": "Nous concevons des solutions d’intelligence artificielle, d’automatisation, de transformation digitale et de Business Intelligence pour rendre les entreprises plus rapides, plus fiables et plus évolutives.",
    "home.hero.cta1": "Évaluer votre projet",
    "home.hero.cta2": "Découvrir nos solutions",
    
    "home.section.proof": "02 — PREUVE RAPIDE",
    "home.section.proof.tagline": "4 expertises · 1 méthode de transformation · des systèmes conçus pour durer",

    "home.section.services": "03 — NOS SERVICES",
    "home.section.services.title": "Quatre piliers d'expertise pour transformer votre organisation",
    "home.section.services.desc": "Des architectures d'IA générative aux agents autonomes, découvrez nos domaines d'intervention conçus pour durer.",
    "home.section.services.explore": "Découvrir le service",

    "home.section.solutions": "03 — NOS SERVICES",
    "home.section.solutions.title": "Quatre piliers d'expertise pour transformer votre organisation",
    "home.section.solutions.desc": "Des architectures d'IA générative aux agents autonomes, découvrez nos domaines d'intervention conçus pour durer.",
    "home.section.solutions.explore": "Découvrir le service",
    "home.proof.heading": "Chiffres réels et engagements de méthode",
    "home.solution.more": "+ info ↗",
    "home.insights.all": "Tous les insights",
    "home.insights.reading": "Temps de lecture :",
    "home.insights.read": "Lire",
    "home.solution.ai.title": "Raisonnement & RAG",
    "home.solution.ai.promise": "Audit de l'existant et priorisation des cas d'usage à plus fort ROI : nous identifions ensemble où l'IA crée le plus de valeur mesurable.",
    "home.solution.ai.tagline": "Audit de l'existant & priorisation ROI",
    "home.solution.ai.metric": "Latence RAG",
    "home.solution.automation.title": "Automatisation & Workflows",
    "home.solution.automation.promise": "Un prototype fonctionnel sur vos données, en 4 à 6 semaines, évalué dans vos conditions réelles de production.",
    "home.solution.automation.tagline": "Workflows & Orchestrations",
    "home.solution.automation.metric": "Benchmark précision & latence",
    "home.solution.agents.title": "Orchestration Multi-Agents",
    "home.solution.agents.promise": "Architectures multi-agents capables de planifier, raisonner et agir : orchestration de rôles, mémoire long-terme, outillage dynamique et supervision humaine dans la boucle.",
    "home.solution.agents.tagline": "Multi-Agents & Autonomie",
    "home.solution.agents.metric": "Autonomie",
    "home.solution.bi.title": "Data & Décision Augmentée",
    "home.solution.bi.promise": "Supervision, évaluation continue et itérations mensuelles : votre système s'améliore avec l'usage, sans dérive ni dette.",
    "home.solution.bi.tagline": "Data & Décision Augmentée",
    "home.solution.bi.metric": "KPIs actifs",

    "home.section.painpoints": "04 — PROBLÈMES MÉTIERS",
    "home.section.painpoints.title": "Vous vous reconnaissez dans ces situations ?",
    "home.section.painpoints.desc": "Les freins opérationnels les plus fréquents que nous transformons en leviers d'efficacité.",
    "painpoint.observe": "Constat",
    "painpoint.response": "Réponse AnalyticaTech",
    "painpoint.solution": "Comment nous le résolvons :",
    "painpoint.impact": "Impact Mesuré",
    "painpoint.cta": "Identifier ce levier",
    "painpoint.cta.hint": "Éliminer ce problème ?",
    "painpoint.p1.problem": "Vos équipes ressaisissent les mêmes informations dans plusieurs outils.",
    "painpoint.p1.solution": "Automatisation et synchronisation bidirectionnelle via pipelines n8n / APIs unifiées.",
    "painpoint.p1.impact": "-85% de saisie manuelle",
    "painpoint.p1.sector": "Opérations & Admin",
    "painpoint.p2.problem": "Vos données sont disponibles mais difficiles à interpréter et exploitables trop tard.",
    "painpoint.p2.solution": "Plateforme BI avec couche sémantique dbt et dashboards exécutifs prédictifs.",
    "painpoint.p2.impact": "Décisions 5x plus rapides",
    "painpoint.p2.sector": "Management & Finance",
    "painpoint.p3.problem": "Vos processus dépendent de validations manuelles et peu traçables.",
    "painpoint.p3.solution": "Orchestration multi-agents avec boucles d'approbation et audit-trail complet.",
    "painpoint.p3.impact": "100% de traçabilité",
    "painpoint.p3.sector": "Conformité & Juridique",
    "painpoint.p4.problem": "Votre infrastructure technique actuelle limite la croissance ou la fiabilité.",
    "painpoint.p4.solution": "Refonte d'architecture cloud-native et migration sans interruption de service.",
    "painpoint.p4.impact": "99.98% d'uptime garanti",
    "painpoint.p4.sector": "IT & Tech",
    "painpoint.p5.problem": "Vos collaborateurs passent trop de temps à chercher, vérifier ou transférer l’information.",
    "painpoint.p5.solution": "Assistant cognitif RAG d'entreprise interrogeant l'ensemble de votre base de connaissances.",
    "painpoint.p5.impact": "-75% de temps de recherche",
    "painpoint.p5.sector": "Équipes métiers",

    "home.section.graph": "05 — SYSTÈME VIVANT",
    "home.graph.title": "Architecture vivante & flux en temps réel",
    "home.graph.desc": "Visualisez les interactions en direct entre vos sources de données, modèles d'IA et agents autonomes.",

    "dataconsole.tag": "06 — CONSOLE DATA & TÉLÉMÉTRIE",
    "dataconsole.title": "Systèmes en temps réel, preuves en direct.",
    "dataconsole.desc": "Métriques de production, flux d'activité et inventaire explorable : la donnée qui fait tourner vos opérations.",
    "dataconsole.live": "EN DIRECT",
    "dataconsole.console.title": "Flux d'activité temps réel",

    "home.section.method": "07 — MÉTHODE",
    "home.section.method.title": "Une démarche structurée et rassurante",
    "home.section.method.desc": "Du premier échange à l'optimisation continue, notre méthode garantit un accompagnement sans risque et à forte valeur ajoutée.",
    "home.section.method.cta": "Comprendre l'accompagnement",
    "method.result": "Résultat garanti à cette étape :",
    "method.deliverables": "Livrables concrets inclus :",
    "method.duration": "Délai moyen d'exécution :",
    "method.cta": "Démarrer à cette étape",
    "method.step1.phase": "PHASE 01 // DÉCOUVERTE & CADRAGE",
    "method.step1.title": "Découverte & Cadrage",
    "method.step1.subtitle": "Audit de l'existant & priorisation ROI",
    "method.step1.desc": "Audit de l'existant et priorisation des cas d'usage à plus fort ROI : nous identifions ensemble où l'IA crée le plus de valeur mesurable.",
    "method.step1.result": "Feuille de route priorisée et chiffrée, validée ensemble",
    "method.step1.deliverable1": "Audit de l'existant (données, processus, outils)",
    "method.step1.deliverable2": "Matrice de priorisation ROI des cas d'usage",
    "method.step1.deliverable3": "Feuille de route chiffrée et séquencée",
    "method.step1.duration": "1 à 2 semaines",
    "method.step2.phase": "PHASE 02 // POC EN CONDITIONS RÉELLES",
    "method.step2.title": "POC en conditions réelles",
    "method.step2.subtitle": "Prototype fonctionnel sur vos données",
    "method.step2.desc": "Un prototype fonctionnel sur vos données, en 4 à 6 semaines, évalué dans vos conditions réelles de production.",
    "method.step2.result": "POC fonctionnel testé sur vos propres données métier",
    "method.step2.deliverable1": "Prototype fonctionnel (agent, RAG ou automate)",
    "method.step2.deliverable2": "Benchmark précision, latence & coûts",
    "method.step2.deliverable3": "Dossier go/no-go documenté",
    "method.step2.duration": "4 à 6 semaines",
    "method.step3.phase": "PHASE 03 // INDUSTRIALISATION",
    "method.step3.title": "Industrialisation",
    "method.step3.subtitle": "Production, monitoring & CI/CD",
    "method.step3.desc": "Passage en production avec monitoring, garde-fous et CI/CD : architecture résiliente, sécurité et conformité intégrées dès la conception.",
    "method.step3.result": "Système en production supervisé, sécurisé et réversible",
    "method.step3.deliverable1": "Déploiement production (cloud souverain ou on-premise)",
    "method.step3.deliverable2": "Monitoring & supervision (latence, coût, qualité)",
    "method.step3.deliverable3": "Garde-fous : PII, anti-hallucination, rate limiting",
    "method.step3.duration": "6 à 8 semaines",
    "method.step4.phase": "PHASE 04 // RUN & AMÉLIORATION CONTINUE",
    "method.step4.title": "Run & amélioration continue",
    "method.step4.subtitle": "Supervision, évaluation & itérations",
    "method.step4.desc": "Supervision, évaluation continue et itérations mensuelles : votre système s'améliore avec l'usage, sans dérive ni dette.",
    "method.step4.result": "Valeur mesurée chaque mois, modèles maintenus à jour",
    "method.step4.deliverable1": "Supervision continue & détection de dérive",
    "method.step4.deliverable2": "Évaluation mensuelle des modèles",
    "method.step4.deliverable3": "Itérations mensuelles priorisées",
    "method.step4.duration": "Continu (itérations mensuelles)",

    "home.section.demo": "08 — CAS & DÉMONSTRATION",
    "home.section.demo.title": "Du processus manuel au système intelligent",
    "home.section.demo.desc": "Démonstration d'une transformation opérationnelle type : résultats mesurés et architecture déployée.",
    "home.section.demo.cta": "Voir l'étude de cas",

    "demo.before.label": "SITUATION INITIALE (AVANT)",
    "demo.before.switch": "❌ Avant Intervention (Processus Manuel)",
    "demo.before.title": "Processus manuel dispersé & risques opérationnels",
    "demo.before.desc": "Saisie d'information fragmentée sur 4 logiciels distincts, dépendance forte à des validations manuelles sur Excel, latence de traitement importante et risque élevé d'erreurs humaines.",
    "demo.before.point1": "Temps de traitement moyen : 48 heures par dossier",
    "demo.before.point2": "Taux d'erreur de re-saisie : ~15% des données",
    "demo.before.point3": "Visibilité exécutive : Reporting hebdomadaire décalé",
    "demo.before.point4": "Coût opérationnel : 14h/collaborateur/semaine perdues",
    "demo.before.score": "Bilan de performance",
    "demo.before.verdict": "Inefficace",
    "demo.before.verdict.desc": "Saturation des équipes et manque de scalabilité des opérations.",
    "demo.after.label": "SITUATION OPTIMISÉE (APRÈS ANALYTICATECH)",
    "demo.after.switch": "✨ Après Intervention (AnalyticaTech)",
    "demo.after.title": "Système intelligent, automatisé & contrôlé",
    "demo.after.desc": "Déploiement d'un agent cognitif RAG couplé à un pipeline d'automatisation n8n et un dashboard décisionnel PowerBI avec audit-trail continu.",
    "demo.after.point1": "Temps de traitement : Réduit à 3 secondes (-99%)",
    "demo.after.point2": "Taux d'erreur de re-saisie : 0% (Validation automatique)",
    "demo.after.point3": "Visibilité exécutive : Dashboard temps réel 24/7",
    "demo.after.point4": "ROI mesuré : 3.5x sur la première année",
    "demo.after.cta": "Obtenir un diagnostic similaire",
    "demo.after.m1.label": "Temps de traitement",
    "demo.after.m1.value": "-75 %",
    "demo.after.m2.label": "Taux d'Erreur",
    "demo.after.m2.value": "0 %",
    "demo.after.m3.label": "Retour Sur Investissement",
    "demo.after.m3.value": "ROI 3.5x",
    "demo.after.m3.sub": "Amorti sous 4 mois",

    "home.section.insights": "09 — INSIGHTS",
    "home.section.insights.title": "Réflexions & analyses d'experts",
    "home.section.insights.desc": "Découvrez nos derniers rapports techniques, études de cas et guides pratiques sur l'IA et l'automatisation.",

    "home.section.testimonials": "TÉMOIGNAGES · RETOUR D'EXPÉRIENCE",
    "home.testimonials.title": "La confiance des leaders technologiques",
    "home.testimonials.desc": "Retours d'expérience concrets de directions générales, DSI et équipes métiers transformées.",

    "home.faq.tag": "10 — FAQ",
    "home.faq.title": "Questions fréquentes.",
    "home.faq.desc": "Ce que les dirigeants nous demandent le plus avant de lancer un projet d'IA ou d'automatisation.",

    "home.section.cta.tag": "11 — CTA FINAL",
    "home.section.cta.title": "Identifions votre prochain levier de performance.",
    "home.section.cta.desc": "Un échange court pour comprendre votre contexte, vos priorités et les systèmes qui pourraient produire le plus de valeur.",
    "home.section.cta.button": "Parler de votre projet",
    "home.faq.q1": "Combien de temps faut-il pour livrer un projet d'IA ?",
    "home.faq.a1": "Cela dépend du périmètre : un proof of concept est livré en 2 à 4 semaines, un projet complet en 8 à 12 semaines. Nous déployons par incréments pour un retour sur investissement rapide et mesurable.",
    "home.faq.q2": "Comment garantissez-vous la sécurité et la confidentialité de nos données ?",
    "home.faq.a2": "Nous signons systématiquement un NDA, hébergeons vos données dans des environnements conformes RGPD et retirons les données de démonstration sous 90 jours. Aucune donnée client n'est utilisée pour l'entraînement.",
    "home.faq.q3": "Quels types d'entreprises accompagnez-vous ?",
    "home.faq.a3": "Des PME aux grands groupes, principalement dans la banque, l'industrie, le retail et les services. Nous adaptons nos systèmes à votre maturité digitale, sans imposer de refonte brutale.",
    "home.faq.q4": "Proposez-vous des accompagnements de transformation digitale complets ?",
    "home.faq.a4": "Oui — de l'audit de maturité à la conduite du changement, en passant par l'automatisation des process, le pilotage par la donnée et la gouvernance IA.",
    "home.faq.q5": "Comment se déroule un premier échange ?",
    "home.faq.a5": "Un appel de cadrage gratuit de 30 minutes pour comprendre vos enjeux, suivi d'une proposition chiffrée et d'une feuille de route sous 72 h. Sans engagement.",

    // === SERVICES ===
    "services.title1": "Cinq couches d'expertise,",
    "services.title2": "empilées avec précision",
    "services.kicker": "Services — Séquence d'Empilement",
    "services.desc": "Chaque service est une couche de notre monolithe. Défilez : les cartes se superposent et se collent en haut — la précédente disparaît sous la suivante, révélation par révélation.",
    "services.method.tag": "Méthode de livraison",
    "services.method.title": "Du cadrage au run, sans rupture",
    "services.scrollHint": "Défiler pour révéler",
    "services.method.desc": "Notre livraison suit un cycle itératif à 4 phases, chacune livrant de la valeur observable. Aucun « big bang » : chaque incrément est mis en production et monitoré.",
    "services.method.cta": "Cadrer votre mission",
    "services.card.cta": "Démarrer ce service",

    // === SERVICES PERSONA ===
    "services.persona.ceo": "Dirigeant",
    "services.persona.architect": "Architecte",
    "services.persona.operational": "Opérationnel",
    "services.persona.ceo-label": "CEO",
    "services.persona.architect-label": "Architect",
    "services.persona.operational-label": "Ops",
    "services.persona.selected": "Persona : {persona}",

    // === SOLUTIONS ===
    "solutions.title1": "Des solutions sectorielles,",
    "solutions.title2": "en orbite",
    "solutions.kicker": "Solutions — Dérive Latérale",
    "solutions.desc": "Défilez verticalement : les cas d'usage défilent horizontalement comme une séquence orbitale. Chaque solution est prête à être adaptée à votre contexte.",
    "solutions.card.cta": "En savoir plus",
    "solutions.card.viewDetail": "Voir le détail",
    "solutions.drift.label": "Séquence de Dérive",
    "solutions.phase.lead": "Préparation",
    "solutions.phase.drift": "Dérive",
    "solutions.phase.release": "Libération",
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
    "blog.kicker": "Insights — Rapports Techniques",
    "blog.desc": "Nos architectes partagent leurs analyses : patterns de production, choix d'outillage et leçons apprises sur les missions.",
    "blog.featured": "À la une",
    "blog.filter.all": "Tous les rapports",
    "blog.filter.aria": "Filtrer par catégorie",
    "blog.filter.entries.one": "entrée",
    "blog.filter.entries.other": "entrées",
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
    "contact.channels": "Canaux alternatifs",
    "contact.kicker": "Canal Sécurisé — Chiffré",
    "contact.terminal.title": "analyticatech@sécurisé ~ % contact --nouveau",
    "contact.terminal.cmd": "initier_session --chiffré",
    "contact.msg.placeholder": "$ echo 'Décrivez votre contexte, vos contraintes et objectifs…'",
    "contact.err.validation": "Validation échouée — corrigez les champs signalés.",
    "contact.err.ratelimit": "Trop de tentatives. Réessayez dans une heure.",
    "contact.err.network": "Erreur réseau. Vérifiez votre connexion et réessayez.",
    "contact.reference": "Référence ticket :",
    "contact.badge.tls": "TLS 1.3",
    "contact.badge.rgpd": "Conforme RGPD",
    "contact.badge.encrypted": "Chiffré bout-en-bout",
    "contact.badge.honeypot": "Pot-de-miel anti-spam",
    "contact.channel.email": "Email",
    "contact.channel.phone": "Téléphone",
    "contact.channel.hq": "Siège",
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
    "legal.lastUpdated": "Dernière mise à jour :",
    "legal.contact.question": "Une question sur ce document ?",
    "legal.contact.cta": "Nous contacter",

    // === ABOUT ===
    "about.title": "À propos d'Analyticatech",
    "about.desc": "Cabinet de conseil de haut niveau en IA, Transformation Digitale et Automatisation. Nous concevons et industrialisons des systèmes intelligents à l'échelle.",
    "about.mission.title": "Notre Mission",
    "about.mission.body": "Rendre l'intelligence artificielle opérationnelle et souveraine pour les organisations européennes. Du POC à la production, nous transformons l'IA en avantage concurrentiel durable — avec précision, sécurité et impact mesurable.",
    "about.vision.title": "Notre Vision",
    "about.vision.body": "Un futur où chaque organisation maîtrise ses systèmes agentiques, où la donnée est un levier et non une contrainte, et où l'IA sert l'humain — pas l'inverse. Nous bâtissons cette souveraineté technologique, une mission à la fois.",
    "about.values.title": "Nos Valeurs",
    "about.cta": "Travaillons ensemble",

    // === COMMON ===
    "common.back": "Retour",
    "common.contact": "Nous contacter",
    "common.read": "Lire",
    "common.deployed": "Déployé en production",
    "common.impact": "Impact mesuré",
    "common.techStack": "Stack technologique",
    "common.metrics": "Métriques clés",
    "common.presentation": "Présentation",
    "common.context": "Contexte",
    "common.keyPoints": "Points clés",
    "detail.noData": "// Aucune donnée",
    "detail.unavailable.title": "Contenu temporairement indisponible",
    "detail.service.unavailable": "Le service demandé n'est pas accessible pour le moment. Réessayez dans un instant.",
    "detail.solution.unavailable": "La solution demandée n'est pas accessible pour le moment. Réessayez dans un instant.",
    "detail.article.unavailable": "L'article demandé n'est pas accessible pour le moment. Réessayez dans un instant.",
    "detail.service.cta": "Prêt à démarrer ce service pour votre organisation ?",
    "detail.solution.cta": "Cette solution correspond à votre besoin ?",
    "detail.article.cta": "Cet article vous a intéressé ? Échangeons sur votre projet.",
    "detail.article.body": "Dans cet article, nous explorons en détail les enjeux techniques, les choix d'architecture et les leçons apprises sur le terrain. Notre objectif : fournir un cadre actionnable pour vos propres projets.",
    "detail.service.label": "Service",
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
    "footer.compliance": "ISO 27001 · GDPR",

    // === HOME ===
    "home.badge": "AI Consulting Firm · Transformation · Automation",
    "home.hero.title1": "INTELLIGENT",
    "home.hero.keyword": "SYSTEMS",
    "home.hero.title2": "for simpler operations.",
    "home.hero.desc": "We design artificial intelligence, automation, digital transformation, and Business Intelligence solutions to make businesses faster, more reliable, and scalable.",
    "home.hero.cta1": "Evaluate your project",
    "home.hero.cta2": "Discover our solutions",
    
    "home.section.proof": "02 — QUICK PROOF",
    "home.section.proof.tagline": "4 expertises · 1 transformation method · systems built to last",

    "home.section.services": "03 — OUR SERVICES",
    "home.section.services.title": "Four pillars of expertise to transform your organization",
    "home.section.services.desc": "From generative AI architectures to autonomous agents, explore our technical domains built to last.",
    "home.section.services.explore": "Explore service",

    "home.section.solutions": "03 — OUR SERVICES",
    "home.section.solutions.title": "Four pillars of expertise to transform your organization",
    "home.section.solutions.desc": "From generative AI architectures to autonomous agents, explore our technical domains built to last.",
    "home.section.solutions.explore": "Explore service",
    "home.proof.heading": "Real numbers and method commitments",
    "home.solution.more": "+ info ↗",
    "home.insights.all": "All insights",
    "home.insights.reading": "Reading time:",
    "home.insights.read": "Read",
    "home.solution.ai.title": "Artificial Intelligence",
    "home.solution.ai.promise": "Designing systems that can understand, reason and act.",
    "home.solution.ai.tagline": "Audit & ROI Prioritization",
    "home.solution.ai.metric": "RAG latency",
    "home.solution.automation.title": "Automation & Workflows",
    "home.solution.automation.promise": "A working prototype on your data, in 4 to 6 weeks, evaluated under real production conditions.",
    "home.solution.automation.tagline": "Workflows & Orchestration",
    "home.solution.automation.metric": "Accuracy & latency benchmark",
    "home.solution.agents.title": "Multi-Agent Orchestration",
    "home.solution.agents.promise": "Multi-agent architectures capable of planning, reasoning and acting: role orchestration, long-term memory, dynamic tooling and human-in-the-loop oversight.",
    "home.solution.agents.tagline": "Multi-Agent & Autonomy",
    "home.solution.agents.metric": "Autonomy",
    "home.solution.bi.title": "Data & Augmented Decision",
    "home.solution.bi.promise": "Monitoring, continuous evaluation and monthly iterations: your system improves with usage, without drift or technical debt.",
    "home.solution.bi.tagline": "Data & Augmented Decision",
    "home.solution.bi.metric": "Active KPIs",

    "home.section.painpoints": "04 — BUSINESS PAIN POINTS",
    "home.section.painpoints.title": "Do you recognize your organization in these situations?",
    "home.section.painpoints.desc": "The most common operational bottlenecks that we turn into efficiency levers.",
    "painpoint.observe": "Observation",
    "painpoint.response": "AnalyticaTech response",
    "painpoint.solution": "How we solve it:",
    "painpoint.impact": "Measured Impact",
    "painpoint.cta": "Identify this lever",
    "painpoint.cta.hint": "Eliminate this problem?",
    "painpoint.p1.problem": "Your teams re-enter the same information into multiple tools.",
    "painpoint.p1.solution": "Automation and bidirectional synchronization via n8n pipelines / unified APIs.",
    "painpoint.p1.impact": "-85% manual entry",
    "painpoint.p1.sector": "Operations & Admin",
    "painpoint.p2.problem": "Your data is available but hard to interpret and actionable too late.",
    "painpoint.p2.solution": "BI platform with an dbt semantic layer and predictive executive dashboards.",
    "painpoint.p2.impact": "5x faster decisions",
    "painpoint.p2.sector": "Management & Finance",
    "painpoint.p3.problem": "Your processes rely on manual, poorly traceable validations.",
    "painpoint.p3.solution": "Multi-agent orchestration with approval loops and a complete audit trail.",
    "painpoint.p3.impact": "100% traceability",
    "painpoint.p3.sector": "Compliance & Legal",
    "painpoint.p4.problem": "Your current technical infrastructure limits growth or reliability.",
    "painpoint.p4.solution": "Cloud-native architecture overhaul and migration with zero downtime.",
    "painpoint.p4.impact": "99.98% guaranteed uptime",
    "painpoint.p4.sector": "IT & Tech",
    "painpoint.p5.problem": "Your employees spend too much time searching, verifying or transferring information.",
    "painpoint.p5.solution": "Enterprise RAG cognitive assistant querying your entire knowledge base.",
    "painpoint.p5.impact": "-75% search time",
    "painpoint.p5.sector": "Business teams",

    "home.section.graph": "05 — LIVING SYSTEM",
    "home.graph.title": "Living Architecture & Real-Time Flows",
    "home.graph.desc": "Visualize live interactions between your data sources, AI models, and autonomous agents.",

    "dataconsole.tag": "06 — DATA & TELEMETRY CONSOLE",
    "dataconsole.title": "Real-time systems, live proof.",
    "dataconsole.desc": "Production metrics, live activity feed and an explorable inventory: the data that runs your operations.",
    "dataconsole.live": "LIVE",
    "dataconsole.console.title": "Real-time activity feed",

    "home.section.method": "07 — METHOD",
    "home.section.method.title": "A structured and reassuring approach",
    "home.section.method.desc": "From initial scoping to continuous optimization, our method ensures high-value, risk-free support.",
    "home.section.method.cta": "Understand the engagement",
    "method.result": "Guaranteed result at this step:",
    "method.deliverables": "Concrete deliverables included:",
    "method.duration": "Average execution time:",
    "method.cta": "Start at this step",
    "method.step1.phase": "PHASE 01 // DISCOVERY & SCOPING",
    "method.step1.title": "Discovery & Scoping",
    "method.step1.subtitle": "Existing-state audit & ROI prioritization",
    "method.step1.desc": "We audit your existing landscape and prioritize the use cases with the highest measurable ROI.",
    "method.step1.result": "A prioritized, quantified roadmap validated together",
    "method.step1.deliverable1": "Existing-state audit (data, processes, tooling)",
    "method.step1.deliverable2": "ROI prioritization matrix of use cases",
    "method.step1.deliverable3": "Quantified, sequenced roadmap",
    "method.step1.duration": "1 to 2 weeks",
    "method.step2.phase": "PHASE 02 // REAL-WORLD POC",
    "method.step2.title": "Real-world POC",
    "method.step2.subtitle": "Working prototype on your data",
    "method.step2.desc": "A working prototype on your data, in 4 to 6 weeks, evaluated under real production conditions.",
    "method.step2.result": "A functional POC tested on your own business data",
    "method.step2.deliverable1": "Working prototype (agent, RAG or workflow)",
    "method.step2.deliverable2": "Accuracy, latency & cost benchmark",
    "method.step2.deliverable3": "Documented go/no-go file",
    "method.step2.duration": "4 to 6 weeks",
    "method.step3.phase": "PHASE 03 // INDUSTRIALIZATION",
    "method.step3.title": "Industrialization",
    "method.step3.subtitle": "Production, monitoring & CI/CD",
    "method.step3.desc": "Production rollout with monitoring, guardrails and CI/CD: resilient architecture, security and compliance built in from day one.",
    "method.step3.result": "A supervised, secure and reversible production system",
    "method.step3.deliverable1": "Production deployment (sovereign cloud or on-premise)",
    "method.step3.deliverable2": "Monitoring & supervision (latency, cost, quality)",
    "method.step3.deliverable3": "Guardrails: PII protection, anti-hallucination, rate limiting",
    "method.step3.duration": "6 to 8 weeks",
    "method.step4.phase": "PHASE 04 // RUN & CONTINUOUS IMPROVEMENT",
    "method.step4.title": "Run & Continuous Improvement",
    "method.step4.subtitle": "Monitoring, evaluation & monthly iterations",
    "method.step4.desc": "Monitoring, continuous evaluation and monthly iterations: your system improves with usage, without drift or technical debt.",
    "method.step4.result": "Value measured every month, models always up to date",
    "method.step4.deliverable1": "Continuous monitoring & drift detection",
    "method.step4.deliverable2": "Monthly model evaluation",
    "method.step4.deliverable3": "Prioritized monthly iterations",
    "method.step4.duration": "Ongoing (monthly iterations)",

    "home.section.demo": "08 — CASE & DEMO",
    "home.section.demo.title": "From manual process to intelligent system",
    "home.section.demo.desc": "Demonstration of a typical operational transformation: measured results and deployed architecture.",
    "home.section.demo.cta": "View case study",

    "demo.before.label": "INITIAL STATE (BEFORE)",
    "demo.before.switch": "❌ Before Intervention (Manual Process)",
    "demo.before.title": "Scattered manual process & operational risks",
    "demo.before.desc": "Information entry fragmented across 4 separate tools, heavy reliance on manual Excel validations, significant processing latency and high risk of human error.",
    "demo.before.point1": "Average processing time: 48 hours per case",
    "demo.before.point2": "Re-entry error rate: ~15% of data",
    "demo.before.point3": "Executive visibility: Delayed weekly reporting",
    "demo.before.point4": "Operational cost: 14h/employee/week lost",
    "demo.before.score": "Performance assessment",
    "demo.before.verdict": "Inefficient",
    "demo.before.verdict.desc": "Team overload and lack of operational scalability.",
    "demo.after.label": "OPTIMIZED STATE (AFTER ANALYTICATECH)",
    "demo.after.switch": "✨ After Intervention (AnalyticaTech)",
    "demo.after.title": "Intelligent, automated & controlled system",
    "demo.after.desc": "Deployment of a RAG cognitive agent coupled with an n8n automation pipeline and a PowerBI decision dashboard with continuous audit trail.",
    "demo.after.point1": "Processing time: Reduced to 3 seconds (-99%)",
    "demo.after.point2": "Re-entry error rate: 0% (Automatic validation)",
    "demo.after.point3": "Executive visibility: Real-time 24/7 dashboard",
    "demo.after.point4": "Measured ROI: 3.5x in the first year",
    "demo.after.cta": "Get a similar diagnosis",
    "demo.after.m1.label": "Processing time",
    "demo.after.m1.value": "-75 %",
    "demo.after.m2.label": "Error rate",
    "demo.after.m2.value": "0 %",
    "demo.after.m3.label": "Return On Investment",
    "demo.after.m3.value": "ROI 3.5x",
    "demo.after.m3.sub": "Paid back within 4 months",

    "home.section.insights": "09 — INSIGHTS",
    "home.section.insights.title": "Expert insights & analysis",
    "home.section.insights.desc": "Discover our latest technical reports, case studies, and practical guides on AI and automation.",

    "home.section.testimonials": "TESTIMONIALS · CLIENT FEEDBACK",
    "home.testimonials.title": "Trusted by technology leaders",
    "home.testimonials.desc": "Concrete feedback from executive leadership, CIOs, and transformed operational teams.",

    "home.faq.tag": "10 — FAQ",
    "home.faq.title": "Frequently asked questions.",
    "home.faq.desc": "What executives ask us most before launching an AI or automation project.",

    "home.section.cta.tag": "11 — FINAL CTA",
    "home.section.cta.title": "Let's identify your next performance lever.",
    "home.section.cta.desc": "A short exchange to understand your context, priorities, and systems that could generate maximum value.",
    "home.section.cta.button": "Talk about your project",
    "home.faq.q1": "How long does it take to deliver an AI project?",
    "home.faq.a1": "It depends on scope: a proof of concept ships in 2 to 4 weeks, a full project in 8 to 12 weeks. We deploy in increments for a fast, measurable return on investment.",
    "home.faq.q2": "How do you guarantee the security and confidentiality of our data?",
    "home.faq.a2": "We systematically sign an NDA, host your data in GDPR-compliant environments, and remove demonstration data within 90 days. No customer data is ever used for training.",
    "home.faq.q3": "What types of companies do you work with?",
    "home.faq.a3": "From SMEs to large groups, mainly in banking, industry, retail, and services. We adapt our systems to your digital maturity without forcing a disruptive overhaul.",
    "home.faq.q4": "Do you offer end-to-end digital transformation programs?",
    "home.faq.a4": "Yes — from maturity audits to change management, including process automation, data-driven management, and AI governance.",
    "home.faq.q5": "How does a first exchange work?",
    "home.faq.a5": "A free 30-minute scoping call to understand your challenges, followed by a priced proposal and a roadmap within 72 hours. No commitment.",

    // === SERVICES ===
    "services.title1": "Five layers of expertise,",
    "services.title2": "stacked with precision",
    "services.kicker": "Services — Stack Sequence",
    "services.desc": "Each service is a layer of our monolith. Scroll: cards stack and stick at the top — the previous one disappears under the next, revelation by revelation.",
    "services.method.tag": "Delivery method",
    "services.method.title": "From framing to run, without rupture",
    "services.scrollHint": "Scroll to reveal",
    "services.method.desc": "Our delivery follows an iterative 4-phase cycle, each delivering observable value. No « big bang »: every increment goes to production and is monitored.",
    "services.method.cta": "Frame your mission",
    "services.card.cta": "Start this service",

    // === SERVICES PERSONA ===
    "services.persona.ceo": "CEO",
    "services.persona.architect": "Architect",
    "services.persona.operational": "Ops",
    "services.persona.ceo-label": "CEO",
    "services.persona.architect-label": "Architect",
    "services.persona.operational-label": "Ops",
    "services.persona.selected": "Persona: {persona}",

    // === SOLUTIONS ===
    "solutions.title1": "Sectoral solutions,",
    "solutions.title2": "in orbit",
    "solutions.kicker": "Solutions — Lateral Drift",
    "solutions.desc": "Scroll vertically: use cases flow horizontally like an orbital sequence. Each solution is ready to be adapted to your context.",
    "solutions.card.cta": "Learn more",
    "solutions.card.viewDetail": "View detail",
    "solutions.drift.label": "Drift Sequence",
    "solutions.phase.lead": "Staging",
    "solutions.phase.drift": "Drift",
    "solutions.phase.release": "Release",
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
    "blog.kicker": "Insights — Technical Reports",
    "blog.desc": "Our architects share their analyses: production patterns, tooling choices and lessons learned in the field.",
    "blog.featured": "Featured",
    "blog.filter.all": "All reports",
    "blog.filter.aria": "Filter by category",
    "blog.filter.entries.one": "entry",
    "blog.filter.entries.other": "entries",
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
    "contact.channels": "Alternative channels",
    "contact.kicker": "Secure Channel — Encrypted",
    "contact.terminal.title": "analyticatech@secure ~ % contact --new",
    "contact.terminal.cmd": "initiate_session --encrypted",
    "contact.msg.placeholder": "$ echo 'Describe your context, constraints and goals…'",
    "contact.err.validation": "Validation failed — please fix the highlighted fields.",
    "contact.err.ratelimit": "Too many attempts. Try again in an hour.",
    "contact.err.network": "Network error. Check your connection and try again.",
    "contact.reference": "Ticket reference:",
    "contact.badge.tls": "TLS 1.3",
    "contact.badge.rgpd": "GDPR compliant",
    "contact.badge.encrypted": "End-to-end encrypted",
    "contact.badge.honeypot": "Anti-spam honeypot",
    "contact.channel.email": "Email",
    "contact.channel.phone": "Phone",
    "contact.channel.hq": "Headquarters",
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
    "legal.lastUpdated": "Last updated:",
    "legal.contact.question": "A question about this document?",
    "legal.contact.cta": "Contact us",

    // === ABOUT ===
    "about.title": "About Analyticatech",
    "about.desc": "High-level consulting firm in AI, Digital Transformation and Automation. We design and industrialize intelligent systems at scale.",
    "about.mission.title": "Our Mission",
    "about.mission.body": "Making artificial intelligence operational and sovereign for European organizations. From POC to production, we turn AI into a lasting competitive advantage — with precision, security and measurable impact.",
    "about.vision.title": "Our Vision",
    "about.vision.body": "A future where every organization masters its agentic systems, where data is a lever rather than a constraint, and where AI serves humans — not the other way around. We build this technological sovereignty, one mission at a time.",
    "about.values.title": "Our Values",
    "about.cta": "Let's work together",

    // === COMMON ===
    "common.back": "Back",
    "common.contact": "Contact us",
    "common.read": "Read",
    "common.deployed": "Deployed in production",
    "common.impact": "Measured impact",
    "common.techStack": "Technology stack",
    "common.metrics": "Key metrics",
    "common.presentation": "Overview",
    "common.context": "Context",
    "common.keyPoints": "Key points",
    "detail.noData": "// No data",
    "detail.unavailable.title": "Content temporarily unavailable",
    "detail.service.unavailable": "The requested service is not accessible at the moment. Try again shortly.",
    "detail.solution.unavailable": "The requested solution is not accessible at the moment. Try again shortly.",
    "detail.article.unavailable": "The requested article is not accessible at the moment. Try again shortly.",
    "detail.service.cta": "Ready to start this service for your organization?",
    "detail.solution.cta": "Does this solution match your need?",
    "detail.article.cta": "Did this article interest you? Let's talk about your project.",
    "detail.article.body": "In this article, we explore in detail the technical challenges, the architecture choices and the lessons learned in the field. Our goal: to provide an actionable framework for your own projects.",
    "detail.service.label": "Service",
  },
};
