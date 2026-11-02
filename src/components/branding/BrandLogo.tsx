import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Hauteur affichée en px. Défaut : 32. */
  height?: number;
  /** Ajoute la signature « L'IA, expliquée simplement ». */
  signature?: boolean;
  className?: string;
  /** Texte alternatif. Défaut : « Analyticatech ». */
  alt?: string;
  priority?: boolean;
}

/**
 * Logotype officiel Analyticatech (version A « flux »), servi en SVG.
 * Deux fichiers : fond clair et fond sombre, permutés selon le thème.
 * Le dégradé du flux est le seul dégradé autorisé par la charte.
 */
export function BrandLogo({
  height = 32,
  signature = false,
  className,
  alt = "Analyticatech",
  priority = false,
}: BrandLogoProps) {
  const ratio = signature ? 1457.8 / 405.9 : 1457.8 / 344.9;
  const width = Math.round(height * ratio);
  const clair = signature
    ? "/brand/analyticatech-logotype-A-flux-signature.svg"
    : "/brand/analyticatech-logotype-A-flux.svg";
  const nuit = signature
    ? "/brand/analyticatech-logotype-A-flux-signature-nuit.svg"
    : "/brand/analyticatech-logotype-A-flux-fond-sombre.svg";
  const loading = priority ? "eager" : "lazy";

  return (
    <span className={cn("inline-flex shrink-0", className)} style={{ height }}>
      <img
        src={clair}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className="block h-full w-auto dark:hidden"
      />
      <img
        src={nuit}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}

export default BrandLogo;
