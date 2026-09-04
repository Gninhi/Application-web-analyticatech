/**
 * Tokens et constantes d'accent de couleur pour l'ensemble du site.
 * Palette "Corporate Cyberpunk" bicolore & multidomaine.
 */

export const BRAND_ACCENT = "#F26D3D";

/**
 * Accents distinctifs par service (fiches 01 à 04).
 */
export const SERVICE_ACCENTS: Record<string, string> = {
  "01": "#F26D3D", // Orange marque — Raisonnement & RAG
  "02": "#38BDF8", // Bleu azur — Automatisation & Workflows
  "03": "#10B981", // Vert émeraude — Orchestration Multi-Agents
  "04": "#A855F7", // Violet moderne — Data & Décision Augmentée
};


/**
 * Accents sectoriels pour les solutions (1 à 6).
 */
export const SOLUTION_ACCENTS: Record<string, string> = {
  "1": "#38BDF8", // Finance & Fintech
  "2": "#4CAF50", // Industrie & Supply
  "3": "#F26D3D", // Retail & E-commerce
  "4": "#A855F7", // Santé & Pharma
  "5": "#F59E0B", // Services & B2B
  "6": "#22D3EE", // Secteur public & Énergie
  "7": "#6366F1", // M&A & Private Equity (Indigo)
};

/**
 * Accents par catégorie d'insights/articles de blog.
 */
export const CATEGORY_ACCENTS: Record<string, string> = {
  ia: "#F26D3D",
  ai: "#F26D3D",
  automatisation: "#4CAF50",
  automation: "#4CAF50",
  bi: "#38BDF8",
  architecture: "#A855F7",
  rag: "#38BDF8",
  agents: "#F26D3D",
  strategie: "#F59E0B",
  strategy: "#F59E0B",
};

