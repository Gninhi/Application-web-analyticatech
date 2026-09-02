import {
  BRAND_ACCENT,
  SERVICE_ACCENTS,
  SOLUTION_ACCENTS,
  CATEGORY_ACCENTS,
} from "@/lib/constants/theme-accents";

/**
 * Éclaircit une couleur hexadécimale (ex: pour déclinaisons BorderRotate).
 */
export function tint(hex: string, amount: number): string {
  const cleanHex = hex.replace("#", "");
  const n = parseInt(cleanHex, 16);
  if (isNaN(n)) return BRAND_ACCENT;
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Récupère l'accent de couleur associé à un service par son index ("01", "02", etc.).
 */
export function getServiceAccent(index: string): string {
  const normalized = index.trim().padStart(2, "0");
  return SERVICE_ACCENTS[normalized] ?? SERVICE_ACCENTS["01"];
}

/**
 * Récupère l'accent de couleur associé à une solution par son ordre (1 à 6).
 */
export function getSolutionAccent(order: number | string): string {
  const key = String(order);
  return SOLUTION_ACCENTS[key] ?? SOLUTION_ACCENTS["1"];
}

/**
 * Récupère l'accent de couleur associé à une catégorie de blog par sa clé ou son libellé.
 */
export function getCategoryAccent(key: string, label?: string): string {
  const cleanKey = key.toLowerCase().trim();
  const cleanLabel = (label ?? "").toLowerCase().trim();
  return CATEGORY_ACCENTS[cleanKey] ?? CATEGORY_ACCENTS[cleanLabel] ?? BRAND_ACCENT;
}
