/**
 * Tokens et constantes d'accent de couleur pour l'ensemble du site.
 * Charte : un seul accent, adapté au thème (orange en Nuit, bleu-600 en Clair).
 */

export const BRAND_ACCENT = "var(--accent-ink)";

/**
 * Accents distinctifs par service (fiches 01 à 04).
 */
export const SERVICE_ACCENTS: Record<string, string> = {
  "01": "var(--accent-ink)", // Orange marque — Raisonnement & RAG
  "02": "var(--accent-ink)", // Bleu azur — Automatisation & Workflows
  "03": "var(--accent-ink)", // Vert émeraude — Orchestration Multi-Agents
  "04": "var(--accent-ink)", // Violet moderne — Data & Décision Augmentée
};


/**
 * Accents sectoriels pour les solutions (1 à 6).
 */
export const SOLUTION_ACCENTS: Record<string, string> = {
  "1": "var(--accent-ink)", // Finance & Fintech
  "2": "var(--accent-ink)", // Industrie & Supply
  "3": "var(--accent-ink)", // Retail & E-commerce
  "4": "var(--accent-ink)", // Santé & Pharma
  "5": "var(--accent-ink)", // Services & B2B
  "6": "var(--accent-ink)", // Secteur public & Énergie
  "7": "var(--accent-ink)", // M&A & Private Equity (Indigo)
};

/**
 * Accents par catégorie d'insights/articles de blog.
 */
export const CATEGORY_ACCENTS: Record<string, string> = {
  ia: "var(--accent-ink)",
  ai: "var(--accent-ink)",
  automatisation: "var(--accent-ink)",
  automation: "var(--accent-ink)",
  bi: "var(--accent-ink)",
  architecture: "var(--accent-ink)",
  rag: "var(--accent-ink)",
  agents: "var(--accent-ink)",
  strategie: "var(--accent-ink)",
  strategy: "var(--accent-ink)",
};

