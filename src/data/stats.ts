/**
 * ==============================================================================
 * 📊 ANALYTICATECH — SOURCE UNIQUE DE VÉRITÉ DES STATISTIQUES CLÉS
 * ==============================================================================
 * Ce fichier centralise les 4 statistiques majeures d'Analyticatech :
 * 1. Missions livrées (ex: 48+, 127+, etc.)
 * 2. Coûts réduits (ex: 35%, etc.)
 * 3. Uptime plateforme (ex: 99.9%, etc.)
 * 4. Satisfaction C-Level (ex: 4.9/5, etc.)
 *
 * Ces valeurs alimentent directement et de manière synchronisée :
 * - La page d'accueil (Section 02 « Preuve Rapide » & Barre de réassurance Hero)
 * - La page /a-propos (Section « Statistiques »)
 * - Les fallbacks applicatifs et métadonnées SEO structurées
 *
 * 👉 INSTRUCTIONS :
 * Modifiez directement les propriétés ci-dessous avec vos vrais chiffres actuels.
 * Vous pouvez également définir des variables d'environnement équivalentes
 * (ex: NEXT_PUBLIC_STAT_MISSIONS="127+").
 * ==============================================================================
 */

export interface KeyStatItem {
  /** Identifiant unique du signal */
  id: string;
  /** Clé standardisée du domaine */
  key: "missions_delivered" | "cost_reduction" | "uptime_platform" | "satisfaction_rate";
  /** Valeur textuelle affichée (ex: "48+", "35%", "99.9%", "4.9/5") */
  value: string;
  /** Valeur numérique pour compteurs, calculs et sparklines */
  numericValue: number;
  /** Suffixe d'affichage optionnel (ex: "+", "%", "/5") */
  suffix?: string;
  /** Libellé affiché en français */
  labelFr: string;
  /** Libellé affiché en anglais */
  labelEn: string;
}

export interface KeyStatsConfig {
  /** 1. Missions livrées / déployées */
  missions: KeyStatItem;
  /** 2. Réduction des coûts d'exploitation */
  costReduction: KeyStatItem;
  /** 3. Taux de disponibilité / Uptime de la plateforme */
  uptime: KeyStatItem;
  /** 4. Note de satisfaction des dirigeants / C-Level */
  satisfaction: KeyStatItem;
}

/**
 * SOURCE UNIQUE DE VÉRITÉ :
 * Remplissez directement ici vos chiffres actuels réels.
 */
export const KEY_STATS_CONFIG: KeyStatsConfig = {
  // 1. Missions livrées / déployées
  missions: {
    id: "stat-missions",
    key: "missions_delivered",
    value: process.env.NEXT_PUBLIC_STAT_MISSIONS || "48+",
    numericValue: Number(process.env.NEXT_PUBLIC_STAT_MISSIONS_NUM) || 48,
    suffix: "+",
    labelFr: "Missions livrées",
    labelEn: "Deployed Missions",
  },

  // 2. Coûts réduits
  costReduction: {
    id: "stat-cost-reduction",
    key: "cost_reduction",
    value: process.env.NEXT_PUBLIC_STAT_COST_REDUCTION || "35%",
    numericValue: Number(process.env.NEXT_PUBLIC_STAT_COST_REDUCTION_NUM) || 35,
    suffix: "%",
    labelFr: "Coûts réduits",
    labelEn: "Cost Reduction",
  },

  // 3. Uptime plateforme
  uptime: {
    id: "stat-uptime",
    key: "uptime_platform",
    value: process.env.NEXT_PUBLIC_STAT_UPTIME || "99.9%",
    numericValue: Number(process.env.NEXT_PUBLIC_STAT_UPTIME_NUM) || 99.9,
    suffix: "%",
    labelFr: "Uptime plateforme",
    labelEn: "Platform Uptime",
  },

  // 4. Satisfaction C-Level
  satisfaction: {
    id: "stat-satisfaction",
    key: "satisfaction_rate",
    value: process.env.NEXT_PUBLIC_STAT_SATISFACTION || "4.9/5",
    numericValue: Number(process.env.NEXT_PUBLIC_STAT_SATISFACTION_NUM) || 4.9,
    suffix: "/5",
    labelFr: "Satisfaction C-Level",
    labelEn: "C-Level Satisfaction",
  },
};

/**
 * Format prêt à l'emploi consommé par les composants HomeView (Preuve Rapide)
 * et AboutView (Statistiques clés).
 */
export interface DisplayStat {
  /** Valeur formatée (ex: "48+") */
  v: string;
  /** Libellé localisé (ex: "Missions livrées" ou "Deployed Missions") */
  l: string;
  /** Clé normalisée */
  key: KeyStatItem["key"];
  /** Valeur numérique */
  numericValue: number;
}

/**
 * Retourne la liste des 4 statistiques clés pour une langue donnée (FR ou EN).
 * Source unique garantie pour la page d'accueil et la page /a-propos.
 */
export function getKeyStats(locale: "fr" | "en" = "fr"): DisplayStat[] {
  const isEn = locale === "en";
  return [
    {
      v: KEY_STATS_CONFIG.missions.value,
      l: isEn ? KEY_STATS_CONFIG.missions.labelEn : KEY_STATS_CONFIG.missions.labelFr,
      key: KEY_STATS_CONFIG.missions.key,
      numericValue: KEY_STATS_CONFIG.missions.numericValue,
    },
    {
      v: KEY_STATS_CONFIG.costReduction.value,
      l: isEn ? KEY_STATS_CONFIG.costReduction.labelEn : KEY_STATS_CONFIG.costReduction.labelFr,
      key: KEY_STATS_CONFIG.costReduction.key,
      numericValue: KEY_STATS_CONFIG.costReduction.numericValue,
    },
    {
      v: KEY_STATS_CONFIG.uptime.value,
      l: isEn ? KEY_STATS_CONFIG.uptime.labelEn : KEY_STATS_CONFIG.uptime.labelFr,
      key: KEY_STATS_CONFIG.uptime.key,
      numericValue: KEY_STATS_CONFIG.uptime.numericValue,
    },
    {
      v: KEY_STATS_CONFIG.satisfaction.value,
      l: isEn ? KEY_STATS_CONFIG.satisfaction.labelEn : KEY_STATS_CONFIG.satisfaction.labelFr,
      key: KEY_STATS_CONFIG.satisfaction.key,
      numericValue: KEY_STATS_CONFIG.satisfaction.numericValue,
    },
  ];
}
