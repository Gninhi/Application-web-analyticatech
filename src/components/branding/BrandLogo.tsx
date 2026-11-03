import { cn } from "@/lib/utils";

/** Fichiers du logotype officiel (design system), fond clair puis fond sombre. */
const VARIANTS = {
  /** Version A « flux » : à partir de 160 px de large. */
  flux: {
    ratio: 1457.8 / 344.9,
    clair: "/brand/analyticatech-logotype-A-flux.svg",
    nuit: "/brand/analyticatech-logotype-A-flux-fond-sombre.svg",
  },
  /** Même logotype avec la signature « L'IA, expliquée simplement ». */
  signature: {
    ratio: 1457.8 / 405.9,
    clair: "/brand/analyticatech-logotype-A-flux-signature.svg",
    nuit: "/brand/analyticatech-logotype-A-flux-signature-nuit.svg",
  },
  /** Mot seul (sans trait de flux) : sous 160 px de large, le trait devient trop fin. */
  mot: {
    ratio: 1438.6 / 316.9,
    clair: "/brand/analyticatech-logotype-mot.svg",
    nuit: "/brand/analyticatech-logotype-mot-fond-sombre.svg",
  },
} as const;

export type BrandLogoVariant = keyof typeof VARIANTS;

interface BrandLogoProps {
  /** Hauteur affichée en px. Défaut : 32. */
  height?: number;
  /** Version du logotype. Défaut : « flux ». */
  variant?: BrandLogoVariant;
  /** Raccourci historique pour `variant="signature"`. */
  signature?: boolean;
  className?: string;
  /** Texte alternatif. Défaut : « Analyticatech ». */
  alt?: string;
  priority?: boolean;
  /** Occupe toute la largeur du conteneur (signature de pied de page). */
  fluid?: boolean;
}

/**
 * Logotype officiel Analyticatech (design system), servi en SVG.
 * Deux fichiers par version : fond clair et fond sombre, permutés selon le thème.
 * Le dégradé du flux est le seul dégradé autorisé par la charte.
 */
export function BrandLogo({
  height = 32,
  variant,
  signature = false,
  className,
  alt = "Analyticatech",
  priority = false,
  fluid = false,
}: BrandLogoProps) {
  const files = VARIANTS[variant ?? (signature ? "signature" : "flux")];
  const width = Math.round(height * files.ratio);
  // Toujours « lazy » : le navigateur ne télécharge pas les versions masquées
  // (thème inactif, autre point de rupture), une seule requête par logotype visible.
  // `priority` ne demande que la priorité réseau haute pour la version affichée.
  const loading = "lazy";
  const fetchPriority = priority ? "high" : undefined;

  return (
    <span
      className={cn(fluid ? "flex w-full" : "inline-flex shrink-0", className)}
      style={fluid ? undefined : { height }}
    >
      <img
        src={files.clair}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={cn("block dark:hidden", fluid ? "h-auto w-full" : "h-full w-auto")}
      />
      <img
        src={files.nuit}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={cn("hidden dark:block", fluid ? "h-auto w-full" : "h-full w-auto")}
      />
    </span>
  );
}

export default BrandLogo;
