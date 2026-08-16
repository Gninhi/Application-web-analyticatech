"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock, Hash, Newspaper, User } from "lucide-react";
import { type BlogPostDTO, type ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { cn } from "@/lib/utils/cn";
import { FilterPill } from "@/components/interactive/FilterPill";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BorderRotate } from "@/components/ui/animated-gradient-border";

type Filter = string;

/* Accent hex par catégorie — teintes distinctes lisibles sur les 2 thèmes.
 * Déclinées sur chaque carte (en-tête, pastilles, numéros HUD, liserés,
 * bordure animée) à la manière des accents des services et solutions. */
const CATEGORY_ACCENT: Record<string, string> = {
  IA: "#F26D3D",
  AI: "#F26D3D",
  Automatisation: "#4CAF50",
  Automation: "#4CAF50",
  BI: "#38BDF8",
  Architecture: "#A855F7",
};

function getCategoryAccent(key: string, label: string): string {
  return CATEGORY_ACCENT[key] ?? CATEGORY_ACCENT[label] ?? "#F26D3D";
}

/** Éclaircit une couleur hexadécimale — déclinaisons du BorderRotate. */
function tint(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function formatDate(iso: string, locale: string = "fr-FR"): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* === Couverture "rapport technique" — fond navy profond, grille technique
 * estompée sur les bords, halo accent doux, balayage lumineux lent. */
function ReportVisual({
  accent,
  className,
  children,
}: {
  accent: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const gradient = `linear-gradient(135deg, #050a18 0%, #0a1328 55%, color-mix(in srgb, ${accent} 22%, #050a18) 130%)`;
  const grid = `linear-gradient(color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${accent} 22%, transparent) 1px, transparent 1px)`;
  const gridMask = "radial-gradient(ellipse 85% 100% at 30% 0%, black 30%, transparent 92%)";
  const glow = `radial-gradient(300px circle at 84% 12%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`;

  return (
    <div className={cn("relative z-20 overflow-hidden", className)} style={{ background: gradient }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grid,
          backgroundSize: "24px 24px",
          maskImage: gridMask,
          WebkitMaskImage: gridMask,
          opacity: 0.5,
        }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: glow }} aria-hidden />

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

      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

/* === Pastille catégorie — pill glass avec glyphe losange accent === */
function CategoryPill({ accent, label }: { accent: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-md"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
      }}
    >
      <span className="h-1 w-1 rotate-45" style={{ background: accent }} aria-hidden />
      <span style={{ color: accent }}>{label}</span>
    </span>
  );
}

interface BlogViewProps {
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

export function BlogView({ onNavigateDetail }: BlogViewProps) {
  const { t } = useI18n();
  const { blogPosts: BLOG_POSTS, blogCategories: DB_CATEGORIES } = useAppContent();
  const [filter, setFilter] = useState<Filter>("all");

  const categories = useMemo(
    () => [
      { key: "all", label: t("blog.filter.all") },
      ...DB_CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
    ],
    [DB_CATEGORIES, t]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.categoryKey === filter || p.categoryLabel === filter);
  }, [filter, BLOG_POSTS]);

  // Navigation clavier des onglets (WAI-ARIA tabs pattern) :
  // flèches gauche/droite + Home/End, focus déplacé vers l'onglet activé.
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, key: string) => {
      const idx = categories.findIndex((c) => c.key === key);
      if (idx === -1) return;
      let next: number;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next = (idx + 1) % categories.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          next = (idx - 1 + categories.length) % categories.length;
          break;
        case "Home":
          e.preventDefault();
          next = 0;
          break;
        case "End":
          e.preventDefault();
          next = categories.length - 1;
          break;
        default:
          return;
      }
      const target = categories[next];
      setFilter(target.key);
      requestAnimationFrame(() => {
        document.getElementById(`blog-tab-${target.key}`)?.focus();
      });
    },
    [categories]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="relative">
      {/* En-tête */}
      <section className="pt-32 md:pt-40 pb-10">
        <SectionContainer>
          <PageHeader
            kicker={t("blog.kicker")}
            title={t("blog.title1")}
            accent={t("blog.title2")}
            description={t("blog.desc")}
            className="max-w-3xl"
          />
        </SectionContainer>
      </section>

      {/* Filtres */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label={t("blog.filter.aria")}
          >
            {categories.map((cat) => (
              <FilterPill
                key={cat.key}
                id={`blog-tab-${cat.key}`}
                active={filter === cat.key}
                aria-controls="blog-results"
                tabIndex={filter === cat.key ? 0 : -1}
                onClick={() => setFilter(cat.key)}
                onKeyDown={(e) => handleTabKey(e, cat.key)}
                dotColor={cat.key === "all" ? undefined : getCategoryAccent(cat.key, cat.label)}
              >
                {cat.label}
              </FilterPill>
            ))}
            <span className="ml-auto font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {filtered.length} {filtered.length > 1 ? t("blog.filter.entries.other") : t("blog.filter.entries.one")}
            </span>
          </div>
        </div>
      </section>

      {/* Contenu filtré — panneau contrôlé par les onglets catégories */}
      <div role="tabpanel" id="blog-results" aria-labelledby={`blog-tab-${filter}`}>
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            {/* Article à la une — hero pleine largeur */}
            <AnimatePresence mode="wait">
              {featured && (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <HeroCard
                    post={featured}
                    index={0}
                    total={filtered.length}
                    onNavigateDetail={onNavigateDetail}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grille d'articles — les suivants de la sélection filtrée */}
            {rest.length > 0 && (
              <motion.div layout className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rest.map((post, i) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="h-full"
                    >
                      <ReportCard
                        post={post}
                        index={i + 1}
                        total={filtered.length}
                        onNavigateDetail={onNavigateDetail}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("blog.empty")}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* === Carte à la une — hero pleine largeur, contenu à gauche, "couverture"
 * de rapport à droite (grille masquée, halo, balayage, numéro géant). */
function HeroCard({
  post,
  index,
  total,
  onNavigateDetail,
}: {
  post: BlogPostDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}) {
  const { t, locale } = useI18n();
  const accent = getCategoryAccent(post.categoryKey, post.categoryLabel);
  const num = String(index + 1).padStart(2, "0");
  const borderColors = { primary: accent, secondary: tint(accent, 44), accent: tint(accent, 96) };

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
      animationSpeed={9}
      borderRadius={30}
      borderWidth={1.5}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <button
        type="button"
        onClick={() => onNavigateDetail("blog-detail", post.slug)}
        aria-label={`${t("common.read")} : ${post.title}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative block w-full overflow-hidden rounded-[28px] text-left glass-card grain flex flex-col lg:grid lg:grid-cols-[1.05fr_1fr] focus-visible:outline-2 focus-visible:outline-[color:var(--ca)] focus-visible:outline-offset-2"
        style={{ "--ca": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Liseré supérieur — teinte de la catégorie */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
          aria-hidden
        />

        {/* Spot lumineux suivant le curseur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx) var(--my), color-mix(in srgb, var(--ca) 18%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Contenu */}
        <div className="relative z-20 flex flex-col justify-center gap-4 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CategoryPill accent={accent} label={post.categoryLabel} />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("blog.featured")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{formatDate(post.date, locale)}</span>
            <span className="h-px w-4 bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.readingTime}
            </span>
            <span className="h-px w-4 bg-border" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.author}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight leading-tight text-foreground transition-colors duration-300 group-hover:text-[var(--ca)] md:text-4xl">
            {post.title}
          </h2>

          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            aria-hidden
          />

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.excerpt}
          </p>

          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
            {t("common.read")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: accent }}
              aria-hidden
            />
          </span>
        </div>

        {/* Couverture du rapport */}
        <ReportVisual accent={accent} className="min-h-[260px] lg:min-h-full">
          <span
            className="absolute top-5 left-5 z-20 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
          >
            REPORT_{post.id.slice(0, 4).toUpperCase()}
          </span>
          <Newspaper
            className="absolute top-5 right-5 z-20 h-4 w-4"
            style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
            aria-hidden
          />
          <div className="absolute bottom-5 left-5 z-20 flex max-w-[60%] flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="glass rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          <div className="absolute bottom-4 right-6 z-20 flex items-baseline gap-1.5">
            <span
              className="font-display text-7xl font-bold leading-none md:text-8xl"
              style={{ color: `color-mix(in srgb, ${accent} 30%, transparent)` }}
            >
              /{num}
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
            >
              /{String(total).padStart(2, "0")}
            </span>
          </div>
        </ReportVisual>
      </button>
    </BorderRotate>
  );
}

/* === Carte rapport — grille premium alignée sur les cartes Solutions :
 * en-tête image (grille masquée + halo + balayage), numéro HUD, pastille
 * catégorie, métadonnées, titre, tags glass, pied "lire". */
function ReportCard({
  post,
  index,
  total,
  onNavigateDetail,
}: {
  post: BlogPostDTO;
  index: number;
  total: number;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}) {
  const { t, locale } = useI18n();
  const accent = getCategoryAccent(post.categoryKey, post.categoryLabel);
  const num = String(index + 1).padStart(2, "0");
  const borderColors = { primary: accent, secondary: tint(accent, 44), accent: tint(accent, 96) };

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
      className="h-full"
      animationMode="rotate-on-hover"
      animationSpeed={6}
      borderRadius={26}
      borderWidth={1}
      gradientColors={borderColors}
      backgroundColor="var(--glass-card-bg)"
    >
      <button
        type="button"
        onClick={() => onNavigateDetail("blog-detail", post.slug)}
        aria-label={`${t("common.read")} : ${post.title}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-[25px] text-left glass-card grain focus-visible:outline-2 focus-visible:outline-[color:var(--ca)] focus-visible:outline-offset-2"
        style={{ "--ca": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
      >
        {/* Liseré supérieur — teinte de la catégorie */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)` }}
          aria-hidden
        />

        {/* Spot lumineux suivant le curseur */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--mx) var(--my), color-mix(in srgb, var(--ca) 18%, transparent), transparent 70%)",
          }}
          aria-hidden
        />

        {/* En-tête image */}
        <ReportVisual accent={accent} className="h-40 shrink-0 md:h-44">
          <div className="absolute top-4 left-5 right-5 z-20 flex items-start justify-between">
            <CategoryPill accent={accent} label={post.categoryLabel} />
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-display text-4xl font-bold leading-none"
                style={{ color: `color-mix(in srgb, ${accent} 35%, transparent)` }}
              >
                /{num}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: `color-mix(in srgb, ${accent} 65%, transparent)` }}
              >
                /{String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.readingTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3 w-3" style={{ color: accent }} aria-hidden />
              {post.author}
            </span>
          </div>
        </ReportVisual>

        {/* Liseré de séparation en-tête / contenu */}
        <div
          className="relative z-20 h-px shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 28%, transparent), transparent)`,
          }}
          aria-hidden
        />

        {/* Corps */}
        <div className="relative z-20 flex min-h-0 flex-1 flex-col p-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatDate(post.date, locale)}
          </p>
          <h3 className="mb-2 font-display text-lg font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
            {post.title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="glass inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-300 hover:border-accent/30"
              >
                <Hash className="h-2.5 w-2.5" aria-hidden />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span
              className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{
                borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
                color: accent,
              }}
            >
              {post.categoryLabel}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-[var(--ca)]">
              {t("common.read")}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: accent }}
                aria-hidden
              />
            </span>
          </div>
        </div>
      </button>
    </BorderRotate>
  );
}