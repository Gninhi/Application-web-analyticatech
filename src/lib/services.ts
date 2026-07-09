import {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

/**
 * Registre centralisé des icônes / images de fond / overlays mesh
 * associés aux services. Évite la duplication entre HomeView et ServicesView.
 */

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
};

/** Map statique des icônes Lucide par nom de service. */
export const SERVICE_ICONS = {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
} as const;

/** Retourne l'icône Lucide associée à un nom de service. */
export function getServiceIcon(name: string): LucideIcon {
  return ICONS[name] ?? BrainCircuit;
}

/** Images de fond générées par IA, associées à chaque service. */
const BG_IMAGES: Record<string, string> = {
  "01": "/services/bg-01-ia.png",
  "02": "/services/bg-02-transfo.png",
  "03": "/services/bg-03-auto.png",
  "04": "/services/bg-04-agents.png",
  "05": "/services/bg-05-bi.png",
};

/** Retourne l'URL de l'image de fond pour un index de service. */
export function getServiceBgImage(index: string): string {
  return BG_IMAGES[index] ?? BG_IMAGES["01"];
}

/** Dégradés mesh superposés à l'image pour cohérence brand. */
const MESH_OVERLAY: Record<string, string> = {
  "01": "radial-gradient(ellipse 70% 90% at 15% 20%, rgba(242,109,61,0.35), transparent 55%), radial-gradient(ellipse 60% 80% at 90% 90%, rgba(2,40,89,0.7), transparent 60%)",
  "02": "radial-gradient(ellipse 70% 90% at 85% 15%, rgba(76,175,80,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 85%, rgba(2,40,89,0.7), transparent 60%)",
  "03": "radial-gradient(ellipse 70% 90% at 20% 85%, rgba(242,109,61,0.3), transparent 55%), radial-gradient(ellipse 60% 80% at 85% 15%, rgba(255,174,107,0.18), transparent 60%)",
  "04": "radial-gradient(ellipse 70% 90% at 85% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(2,40,89,0.7), transparent 60%)",
  "05": "radial-gradient(ellipse 70% 90% at 25% 20%, rgba(242,109,61,0.28), transparent 55%), radial-gradient(ellipse 60% 80% at 80% 85%, rgba(168,85,247,0.18), transparent 60%)",
};

/** Retourne le dégradé mesh overlay pour un index de service. */
export function getServiceMeshOverlay(index: string): string {
  return MESH_OVERLAY[index] ?? MESH_OVERLAY["01"];
}
