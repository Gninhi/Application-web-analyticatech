import { BrainCircuit, Workflow, Bot, BarChart3 } from "lucide-react";

/**
 * Registre centralisé des icônes / images de fond / overlays mesh
 * associés aux services. Évite la duplication entre HomeView et ServicesView.
 * 4 piliers (02 Transformation supprimé) — réindexation 01→04.
 */

/** Map statique des icônes Lucide par nom de service. */
export const SERVICE_ICONS = {
  BrainCircuit,
  Workflow,
  Bot,
  BarChart3,
} as const;

/** Images de fond « version marque » : fonds procéduraux générés dans
 *  l'identité du site (base navy + mesh aux couleurs d'accent de chaque
 *  service + trame technique). Format WebP pour optimiser Lighthouse. */
const BG_IMAGES: Record<string, string> = {
  "01": "/services/bg-01-ia.webp",
  "02": "/services/bg-03-auto.webp",
  "03": "/services/bg-04-agents.webp",
  "04": "/services/bg-05-bi.webp",
};

/** Retourne l'URL de l'image de fond pour un index de service. */
export function getServiceBgImage(index: string): string {
  return BG_IMAGES[index] ?? BG_IMAGES["01"];
}

/** Dégradés mesh superposés à l'image pour cohérence brand. */
const MESH_OVERLAY: Record<string, string> = {
  "01": "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
  "02": "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(242,109,61,0.3), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(255,174,107,0.18), transparent 60%)",
  "03": "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
  "04": "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(242,109,61,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(168,85,247,0.18), transparent 60%)",
};

/** Retourne le dégradé mesh overlay pour un index de service. */
export function getServiceMeshOverlay(index: string): string {
  return MESH_OVERLAY[index] ?? MESH_OVERLAY["01"];
}

/** Couleur d'accent par service — déclinée sur la carte (liseré supérieur,
 *  chip icône, grand chiffre, valeurs metrics). Teintes alignées sur les
 *  mesh overlays pour une identité cohérente, lisibles sur les 2 thèmes. */
const SERVICE_ACCENT: Record<string, string> = {
  "01": "#F26D3D",
  "02": "#F26D3D",
  "03": "#38BDF8",
  "04": "#A855F7",
};

/** Retourne la couleur d'accent d'un service. */
export function getServiceAccent(index: string): string {
  return SERVICE_ACCENT[index] ?? SERVICE_ACCENT["01"];
}
