"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Compass, TrendingUp, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { type ViewKey } from "@/types/content";
import { type SolutionDTO } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { MovingButton } from "@/components/interactive/MovingButton";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";

interface SolutionsViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/** Couleur d'accent par solution (ordre 1..6) — teintes de secteur distinctes,
 *  lisibles sur les 2 thèmes. Déclinées sur la carte (liseré supérieur, chip
 *  secteur, watermark, impact, bordures animées) comme les accents des services. */
const SOLUTION_ACCENT: Record<string, string> = {
  "1": "#38BDF8",
  "2": "#4CAF50",
  "3": "#F26D3D",
  "4": "#A855F7",
  "5": "#F59E0B",
  "6": "#22D3EE",
};

function getSolutionAccent(order: number): string {
  return SOLUTION_ACCENT[String(order)] ?? SOLUTION_ACCENT["1"];
}

/** Éclaircit une couleur hexadécimale — déclinaisons du BorderRotate
 *  (primary = accent, secondary/accent = teintes plus claires). */
function tint(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * SolutionsView — catalogue interactif en scroll horizontal.
 *
 * Structure du scroll (3 phases restaurée) :
 *  1. STAGING (0% → 15%) : la section se met en place, la piste
 *     horizontale est immobile, la 1ère carte est centrée/staged.
 *  2. DRIFT   (15% → 85%): la piste horizontale translate de gauche
 *     à droite, révélant les cartes successives.
 *  3. RELEASE (85% → 100%): la piste est immobile sur la dernière
 *     carte, puis la section libère le scroll vertical.
 *
 * Depuis la refonte : la translation est mesurée en pixels (ResizeObserver)
 * pour rester parfaitement calibrée quel que soit le breakpoint, et les
 * cartes sont thématisées à la manière des fiches services — accent propre
 * à chaque secteur (liseré supérieur, watermark, spot curseur, bordure
 * animée, impact, chips glass), dégradé d'en-tête sectoriel, et l'ensemble
 * des libellés d'interface via i18n (aucun texte codé en dur).
 */
export function SolutionsView({ onNavigate, onNavigateDetail }: SolutionsViewProps) {
  const { t } = useI18n();
  const { solutions: SOLUTIONS } = useAppContent();

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Décalage horizontal total (px) pour amener la dernière carte au bord droit.
  // `startPx` stagings la 1ère carte (léger décalage de mise en place à 5vw).
  const [drift, setDrift] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const vw = window.innerWidth;
      const trackWidth = track.scrollWidth;
      const startPx = vw * 0.05;
      // drift laisse une marge droite de 4vw → dernière carte visible + breathing room
      setDrift(Math.max(0, trackWidth - vw + vw * 0.04 + startPx));
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [SOLUTIONS.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // x mappé sur la portion centrale [0.15, 0.85] → lead-in & lead-out
  const x = useTransform(scrollYProgress, [0.15, 0.85], [0, -drift]);
  // Indicateur de progression (même plage que x)
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);
  // Opacité de la barre de progression (s'allume pendant le drift)
  const driftActive = useTransform(
    scrollYProgress,
    [0.14, 0.16, 0.84, 0.86],
    [0.3, 1, 1, 0.3]
  );

  // Hauteur totale : lead-in + drift + lead-out
  const totalHeight = `${(SOLUTIONS.length + 1) * 100}vh`;

  return (
    <div ref={containerRef} className="relative">
      {/* === En-tête === */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("solutions.kicker")}
            title={t("solutions.title1")}
            accent={t("solutions.title2")}
            description={t("solutions.desc")}
            className="max-w-3xl"
          />

          {/* Barre de progression horizontale (style cula) */}
          <motion.div
            style={{ opacity: driftActive }}
            className="mt-10 flex items-center gap-3"
          >
            <Compass className="h-4 w-4 text-[#F26D3D]" aria-hidden />
            <div className="relative h-px flex-1 bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="absolute inset-y-0 left-0 bg-[#F26D3D]"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("solutions.drift.label")}
            </span>
          </motion.div>
        </SectionContainer>
      </section>

      {/* === Piste horizontale pin === */}
      <section className="relative" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Indicateur de phase (subtil, en haut) */}
          <PhaseIndicator progress={scrollYProgress} />

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-5 md:gap-8 pl-[6vw] md:pl-[8vw] pr-[6vw]"
          >
            {SOLUTIONS.map((sol, i) => (
              <SolutionCard
                key={sol.id}
                solution={sol}
                index={i}
                total={SOLUTIONS.length}
                onNavigateDetail={onNavigateDetail}
              />
            ))}

            {/* Carte finale CTA */}
            <article className="relative shrink-0 w-[82vw] sm:w-[68vw] md:w-[54vw] lg:w-[42vw] h-[78vh] rounded-[28px] border-2 border-dashed border-[#F26D3D]/50 bg-[#F26D3D]/5 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 md:p-12 overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <span className="relative h-16 w-16 rounded-2xl border border-[#F26D3D]/40 bg-[#F26D3D]/10 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-[#F26D3D]" aria-hidden />
              </span>
              <h3 className="relative font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {t("solutions.final.title")}
              </h3>
              <p className="relative text-slate-500 dark:text-slate-400 mb-8 max-w-md text-base leading-relaxed">
                {t("solutions.final.desc")}
              </p>
              <MovingButton
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="lg"
                className="relative neon-glow"
              >
                {t("solutions.final.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MovingButton>
            </article>
          </motion.div>
        </div>
      </section>

      {/* === Bandeau confiance === */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: t("solutions.confiance.sovereignty"), d: t("solutions.confiance.sovereignty.desc") },
              { icon: Zap, t: t("solutions.confiance.time"), d: t("solutions.confiance.time.desc") },
              { icon: Compass, t: t("solutions.confiance.long"), d: t("solutions.confiance.long.desc") },
            ].map((f) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-card relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-accent/40"
              >
                {/* Liseré supérieur d'accent — définit la tuile */}
                <div
                  className="pointer-events-none absolute inset-x-3 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(242,109,61,0.8), transparent)",
                  }}
                  aria-hidden
                />
                <f.icon className="h-7 w-7 text-[#F26D3D] mb-3" aria-hidden />
                <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1.5">
                  {f.t}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* === Carte solution — grand format === */
interface SolutionCardProps {
  solution: SolutionDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

function SolutionCard({ solution, index, total, onNavigateDetail }: SolutionCardProps) {
  const { t } = useI18n();
  const sol = solution;
  const num = String(index + 1).padStart(2, "0");
  const accent = getSolutionAccent(sol.order);
  const reduceMotion = useReducedMotion();

  // En-tête image — esthétique premium minimaliste : fond navy profond,
  // grille technique estompée sur les bords, halo accent doux.
  const headerGradient = `linear-gradient(135deg, #050a18 0%, #0a1328 55%, color-mix(in srgb, ${accent} 22%, #050a18) 130%)`;
  const headerGrid = `linear-gradient(color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px)`;
  const headerGridMask = "radial-gradient(ellipse 85% 100% at 30% 0%, black 30%, transparent 92%)";
  const headerGlow = `radial-gradient(300px circle at 84% 12%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`;

  // Bordure animée déclinée sur l'accent du secteur.
  const borderColors = {
    primary: accent,
    secondary: tint(accent, 46),
    accent: tint(accent, 96),
  };

  // Style accent des chips (secteur, impact, icônes).
  const chipStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
    background: `color-mix(in srgb, ${accent} 12%, transparent)`,
  };
  const impactStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
    background: `linear-gradient(90deg, color-mix(in srgb, ${accent} 8%, transparent), transparent)`,
  };

  // Spot lumineux suivant le curseur (pattern 21st.dev) : 2 variables CSS
  // posées au survol, aucun transform pendant le scroll.
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  return (
    <BorderRotate
      onClick={() => onNavigateDetail("solution-detail", sol.id)}
      className="group shrink-0 w-[82vw] sm:w-[68vw] md:w-[54vw] lg:w-[42vw] h-[78vh] cursor-pointer"
      animationSpeed={9}
      borderRadius={30}
      borderWidth={2}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full glass-card grain rounded-[28px] overflow-hidden flex flex-col"
        style={{ "--sa": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Liseré supérieur — teinte du secteur */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
          aria-hidden
        />

        {/* Watermark géant — numéro de solution en bas, teinté de l'accent */}
        <span
          className="pointer-events-none absolute -bottom-6 -right-4 z-0 select-none font-display text-[7rem] font-bold leading-none md:text-[9rem]"
          style={{ color: `color-mix(in srgb, ${accent} 9%, transparent)` }}
          aria-hidden
        >
          {num}
        </span>

        {/* Spot lumineux suivant le curseur — couleur du secteur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx) var(--my), color-mix(in srgb, var(--sa) 18%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Visuel de fond — en-tête image premium minimaliste */}
        <div className="relative h-36 md:h-44 shrink-0 overflow-hidden" style={{ background: headerGradient }}>
          {/* Grille technique — estompée sur les bords */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: headerGrid,
              backgroundSize: "24px 24px",
              maskImage: headerGridMask,
              WebkitMaskImage: headerGridMask,
              opacity: 0.5,
            }}
            aria-hidden
          />
          {/* Halo accent doux */}
          <div className="absolute inset-0" style={{ background: headerGlow }} aria-hidden />

          {/* Balayage lumineux — fine barre d'accent qui dérive lentement */}
          {!reduceMotion && (
            <motion.div
              initial={{ x: "-140%" }}
              animate={{ x: "140%" }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-[45%]"
              style={{
                background: `linear-gradient(100deg, transparent, color-mix(in srgb, ${accent} 30%, transparent) 45%, transparent)`,
              }}
              aria-hidden
            />
          )}

          {/* Top row : pastille secteur + numéro fantôme */}
          <div className="absolute top-4 left-5 right-5 z-20 flex items-start justify-between">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-md"
              style={chipStyle}
            >
              <span className="h-1 w-1 rotate-45" style={{ background: accent }} aria-hidden />
              <span style={{ color: accent }}>{sol.sector}</span>
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-display text-4xl font-bold leading-none md:text-5xl"
                style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
              >
                /{num}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
              >
                / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Bottom row : statut déployé + hover hint */}
          <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#4CAF50] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              {t("common.deployed")}
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: accent }}
            >
              {t("solutions.card.viewDetail")} ↗
            </span>
          </div>

          {/* Liseré de séparation en-tête / contenu */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 28%, transparent), transparent)`,
            }}
            aria-hidden
          />
        </div>

        {/* Contenu — conteneur contraint : si l'espace manque (petits
            écrans), le contenu défile à l'intérieur de la carte au lieu de
            déborder (jamais tronqué). Scrollbar fine aux couleurs du thème. */}
        <div
          className="relative z-20 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-5 md:p-7 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-card-border)] [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--glass-card-border) transparent" }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground transition-colors duration-300 group-hover:text-[var(--sa)]">
            {sol.title}
          </h3>
          {/* Règle d'accent sous le titre — dégradé */}
          <div
            className="mb-4 h-px w-14"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            aria-hidden
          />
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 flex-1">
            {sol.summary}
          </p>

          {/* Impact — métrique sectorielle, barre d'accent à gauche */}
          <div className="relative rounded-xl p-3.5 md:p-4 mb-4 flex items-center gap-3.5 overflow-hidden" style={impactStyle}>
            <span className="absolute inset-y-2 left-0 w-0.5 rounded-full" style={{ background: accent }} aria-hidden />
            <span className="h-10 w-10 shrink-0 rounded-lg border flex items-center justify-center" style={chipStyle}>
              <TrendingUp className="h-5 w-5" style={{ color: accent }} aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
                {t("common.impact")}
              </p>
              <p className="font-display text-lg md:text-xl font-bold leading-snug" style={{ color: accent }}>
                {sol.impact}
              </p>
            </div>
          </div>

          {/* Tags — puces glass */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {sol.tags.map((tag: string) => (
              <span
                key={tag}
                className="glass rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-300 hover:border-accent/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <MovingButton
              onClick={(e) => {
                e.stopPropagation();
                onNavigateDetail("solution-detail", sol.id);
              }}
              variant="outline"
              size="md"
              className="group/btn w-full"
            >
              {t("solutions.card.cta")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" aria-hidden />
            </MovingButton>
          </div>
        </div>
      </article>
    </BorderRotate>
  );
}

/* === Indicateur de phase (lead-in / drift / lead-out) === */
function PhaseIndicator({ progress }: { progress: MotionValue<number> }) {
  const { t } = useI18n();
  const leadIn = useTransform(progress, [0, 0.15], [1, 0.3]);
  const drift = useTransform(progress, [0.15, 0.16, 0.84, 0.85], [0.3, 1, 1, 0.3]);
  const leadOut = useTransform(progress, [0.85, 1], [0.3, 1]);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-none">
      <motion.span
        style={{ opacity: leadIn }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        {t("solutions.phase.lead")}
      </motion.span>
      <span className="h-px w-4 bg-black/15 dark:bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: drift }}
        className="font-mono text-[9px] uppercase tracking-widest text-[#F26D3D]"
      >
        {t("solutions.phase.drift")}
      </motion.span>
      <span className="h-px w-4 bg-black/15 dark:bg-white/20" aria-hidden />
      <motion.span
        style={{ opacity: leadOut }}
        className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
      >
        {t("solutions.phase.release")}
      </motion.span>
    </div>
  );
}