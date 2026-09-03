"use client";

import { useLayoutEffect, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Cpu,
  Layers,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ServiceDTO, ViewKey } from "@/types/content";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import {
  SERVICE_ICONS,
  getServiceAccent,
  getServiceBgImage,
  getServiceMeshOverlay,
} from "@/lib/content/services";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cn } from "@/lib/utils/cn";

interface ServicesViewProps {
  onNavigate: (view: ViewKey) => void;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/** Icônes des 4 phases de livraison (DeliveryStepDTO.iconKey). */
const STEP_ICONS: Record<string, LucideIcon> = {
  Layers,
  Cpu,
  ShieldCheck,
  Workflow,
};

/**
 * ServicesView — page « Services », conçue comme un deck de fiches techniques.
 *
 * Structure (docs du projet — SUIVI.md : « Services (empilement) ») :
 *   1. En-tête (PageHeader) présentant les 5 couches d'expertise.
 *   2. Pile de cartes sticky : chaque service occupe un viewport de scroll,
 *      se colle en haut un cran plus bas que la précédente (var(--deck-gap)),
 *      et se fait recouvrir par la suivante. Chaque carte pilote son décor
 *      (parallaxe subtile + assombrissement) sur sa propre fenêtre de scroll,
 *      sans spring → empilement stable, déterministe et composité 60fps.
 *   3. Méthode de livraison : les 4 phases (DeliveryStepDTO) en pipeline.
 *
 * Le contenu des cartes est entièrement piloté par les données (ServiceDTO)
 * et thématisé par le design system (--bg, --deck-veil, --glass-*, accent
 * propre à chaque service). Aucune classe ni import mort.
 */
export function ServicesView({ onNavigate, onNavigateDetail }: ServicesViewProps) {
  const { t } = useI18n();
  const { services, deliverySteps } = useAppContent();
  const reduceMotion = useReducedMotion();

  // Offset de scroll brut (rAF-throttlé par framer-motion) + géométrie du
  // deck mesurée à l'écran : on en déduit la fenêtre de scroll réelle de
  // chaque carte (une hauteur de viewport exactement), ce qui cale le
  // parallaxe et l'assombrissement sur le cycle de vie réel de la carte —
  // plus de dérive entre décor et cadre, et plus de spring (aucun lag).
  const { scrollY } = useScroll();
  const deckRef = useRef<HTMLElement>(null);
  const [geometry, setGeometry] = useState({ deckTop: 0, vh: 1000 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = deckRef.current;
      if (!el) return;
      setGeometry({
        deckTop: el.getBoundingClientRect().top + window.scrollY,
        vh: window.innerHeight,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (deckRef.current) ro.observe(deckRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const [activePersona, setActivePersona] = useState<string | null>(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem("analyticatech-persona");
        if (stored === "ceo" || stored === "architect" || stored === "operational") {
          setActivePersona(stored);
        }
      } catch {
        // Ignorer si indisponible
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleSelectPersona = (p: "ceo" | "architect" | "operational") => {
    try {
      if (activePersona === p) {
        localStorage.removeItem("analyticatech-persona");
        setActivePersona(null);
      } else {
        localStorage.setItem("analyticatech-persona", p);
        setActivePersona(p);
      }
    } catch {
      // Ignorer
    }
  };

  return (
    <div>
      {/* === En-tête de page === */}
      <section className="relative z-10 bg-background pb-12 pt-32 md:pt-40">
        <SectionContainer>
          <PageHeader
            kicker={t("services.kicker")}
            title={t("services.title1")}
            accent={t("services.title2")}
            description={t("services.desc")}
            className="max-w-3xl"
          />

          {/* Sélecteur de persona */}
          <div className="mt-8 flex flex-wrap items-center gap-3" role="tablist" aria-label={t("services.persona.filter") || "Vue ciblée"}>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("services.persona.filter") || "Vue ciblée :"}
            </span>
            {[
              { id: "ceo" as const, label: t("services.persona.ceo-label"), ariaLabel: t("services.persona.ceo"), color: "#F26D3D" },
              { id: "architect" as const, label: t("services.persona.architect-label"), ariaLabel: t("services.persona.architect-label"), color: "#43A047" },
              { id: "operational" as const, label: t("services.persona.operational-label"), ariaLabel: t("services.persona.operational-label"), color: "#38BDF8" },
            ].map((p) => {
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={p.ariaLabel}
                  onClick={() => handleSelectPersona(p.id)}
                  className={cn(
                    "glass rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
                    isSelected
                      ? "font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-white/10"
                  )}
                  style={{
                    borderColor: isSelected ? p.color : undefined,
                    backgroundColor: isSelected ? `color-mix(in srgb, ${p.color} 18%, transparent)` : undefined,
                    color: isSelected ? p.color : undefined,
                    boxShadow: isSelected ? `0 0 12px color-mix(in srgb, ${p.color} 25%, transparent)` : undefined,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Indice de défilement — guide vers la pile de cartes */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 inline-flex items-center gap-3 text-accent"
          >
            <motion.span
              animate={reduceMotion ? { y: 0 } : { y: [0, 5, 0] }}
              transition={{ repeat: reduceMotion ? 0 : Infinity, duration: 1.6, ease: "easeInOut" }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-accent/10"
              aria-hidden
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
              {t("services.scrollHint")}
            </span>
          </motion.div>
        </SectionContainer>
      </section>

      {/* === Pile de cartes sticky === */}
      <section ref={deckRef} className="relative" data-testid="services-deck">
        {services.map((service, i) => (
          <ServiceDeckCard
            key={service.index}
            service={service}
            index={i}
            total={services.length}
            scrollY={scrollY}
            arrive={geometry.deckTop + i * geometry.vh}
            end={geometry.deckTop + (i + 1) * geometry.vh}
            activePersona={activePersona}
            onNavigateDetail={onNavigateDetail}
          />
        ))}
      </section>

      {/* === Méthode de livraison === */}
      <section className="relative bg-background py-24 md:py-32">
        <SectionContainer>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                {"// " + t("services.method.tag")}
              </p>
              <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("services.method.title")}
              </h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {t("services.method.desc")}
              </p>
              <Button
                onClick={() => onNavigate("contact")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="h-4 w-4" aria-hidden />}
                iconPosition="right"
                className="neon-glow"
              >
                {t("services.method.cta")}
              </Button>
            </motion.div>

            {/* Pipeline des 4 phases de livraison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Ligne de pipeline reliant les phases */}
              <div
                className="absolute bottom-8 left-[22px] top-8 w-px bg-accent/20"
                aria-hidden
              />
              <div className="space-y-3">
                {deliverySteps.map((step, i) => {
                  const StepIcon = STEP_ICONS[step.iconKey] ?? Layers;
                  return (
                    <div
                      key={step.id}
                      className="glass-card relative flex items-start gap-4 rounded-xl p-4 transition-colors duration-300 hover:border-accent/40"
                    >
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-accent/10">
                        <StepIcon className="h-5 w-5 text-accent" aria-hidden />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground font-mono text-[9px] font-bold text-background">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground">
                          {/* Le label en base embarque son numéro (« 01 · Discovery ») ;
                              le badge porte déjà l'index → on retire le préfixe pour
                              éviter le doublon visuel. Fallback sûr si format différent. */}
                          {step.label.replace(/^\d+ · /, "")}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}

interface ServiceDeckCardProps {
  service: ServiceDTO;
  index: number;
  total: number;
  scrollY: ReturnType<typeof useScroll>["scrollY"];
  arrive: number;
  end: number;
  activePersona?: string | null;
  onNavigateDetail: (view: ViewKey, id: string) => void;
}

/* === Carte sticky — fiche technique d'un service ===
 *
 * Approche cula.tech adaptée (SUIVI.md) :
 *  - position: sticky; top: index * var(--deck-gap) → la carte se colle un
 *    cran plus bas que la précédente : son bord reste visible en liseré
 *    au-dessus de la suivante (effet jeu de cartes).
 *  - height: 100vh ; fond opaque (var(--bg) + voile + image + mesh) →
 *    recouvre la précédente ; z-index croissant.
 *  - Le progress de chaque carte est dérivé directement du scroll brut sur
 *    SA fenêtre réelle (arrive → end, une hauteur de viewport exactement),
 *    sans spring : l'assombrissement (overlay de profondeur) et le parallaxe
 *    suivent le cycle de vie exact de la carte — plus de dérive ni de lag.
 *  - Parallaxe : seule l'image de fond est transformée (composited), très
 *    subtile (±1.5%), désactivée sous prefers-reduced-motion — aucun
 *    transform sur la carte ou le panneau → empilement 60fps et carte active
 *    parfaitement stable.
 *
 * Contenu : fiche technique premium — identifiant + tagline, titre avec
 * règle d'accent, description, stack technologique, métriques chiffrées et
 * CTA vers la page de détail. Tout est issu de ServiceDTO + i18n.
 */
function ServiceDeckCard({
  service,
  index,
  total,
  scrollY,
  arrive,
  end,
  activePersona,
  onNavigateDetail,
}: ServiceDeckCardProps) {
  const { t } = useI18n();
  const IconComponent = SERVICE_ICONS[service.iconKey] ?? SERVICE_ICONS.BrainCircuit;
  const bgImage = service.bgImagePath ?? getServiceBgImage(service.index);
  const meshOverlay = service.meshOverlay ?? getServiceMeshOverlay(service.index);
  const accent = getServiceAccent(service.index);
  const panelRef = useRef<HTMLDivElement>(null);

  const isLast = index === total - 1;

  // Progression directe sur la fenêtre de scroll réelle de la carte : 0 à
  // l'arrivée en haut du viewport, 1 quand la suivante la recouvre. Aucun
  // spring → déterministe et synchronisé au pixel près avec le cadre sticky.
  const progress = useTransform(scrollY, [arrive, end], [0, 1], { clamp: true });

  // Overlay de profondeur : assombrit les cartes précédentes (0 → 0.45) quand
  // la carte suivante arrive, piloté directement par le scroll.
  const overlayOpacity = useTransform(progress, [0, 1], [0, isLast ? 0 : 0.45]);

  // Parallaxe du décor : l'image de fond dérive très légèrement (±1.5%) à
  // l'opposé du scroll pendant que la carte monte.
  //
  // NOTE hydratation : le range est volontairement déterministe (jamais
  // branché sur useReducedMotion, qui vaut null en SSR → mismatch serveur/
  // client). La désactivation sous prefers-reduced-motion se fait en CSS
  // (`.service-card-bg` + @media) pour rester identique entre les deux.
  const bgY = useTransform(progress, [0, 1], ["1.5%", "-1.5%"]);

  // Spot lumineux suivant le curseur (pattern 21st.dev) : 2 variables CSS
  // posées au survol, aucun transform pendant le scroll.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const handleMouseLeave = () => {
    const el = panelRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-200px");
    el.style.setProperty("--my", "-200px");
  };

  const chipStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
    background: `color-mix(in srgb, ${accent} 12%, transparent)`,
    color: accent,
  };

  return (
    <article
      className="sticky flex h-screen w-full items-center justify-center overflow-hidden px-3 md:px-6"
      data-testid="service-card"
      style={{
        zIndex: index + 1,
        backgroundColor: "var(--bg)",
        // Écart d'empilement : chaque carte se colle un cran plus bas que la
        // précédente → son bord reste visible en liseré au-dessus de la
        // suivante (illusion d'un jeu de cartes).
        top: `calc(${index} * var(--deck-gap))`,
        // Liseré de bord entre cartes empilées (permet de lire l'empilement)
        borderTop: "1px solid var(--glass-card-border)",
      }}
    >
      {/* Décor : image en parallaxe + mesh + voile adaptatif */}
      <motion.div
        className="service-card-bg absolute inset-0 overflow-hidden"
        data-testid="service-card-bg"
        style={{ y: bgY, scale: 1.1 }}
        aria-hidden
      >
        <Image
          src={bgImage}
          alt=""
          fill
          sizes="100vw"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={75}
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: meshOverlay }} aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: "var(--deck-veil)" }}
        aria-hidden
      />

      {/* Overlay de profondeur (assombrit les cartes précédentes, les 2 thèmes) */}
      {!isLast && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          data-testid="service-card-depth"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
      )}

      {/* Panneau — fiche technique du service */}
      <div className="relative z-10 w-full max-w-6xl">
        <div
          ref={panelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-testid="service-card-panel"
          className="group relative overflow-hidden rounded-[28px] deck-card"
          style={{ "--sa": accent, "--mx": "-200px", "--my": "-200px" } as CSSProperties}
        >
          {/* Liseré supérieur — teinte du service */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}b3, transparent)`,
            }}
            aria-hidden
          />

          {/* Watermark géant — numéro de service en fond */}
          <div
            className="pointer-events-none absolute -bottom-10 -right-4 select-none font-display text-[15rem] font-bold leading-none md:text-[20rem]"
            style={{ color: `color-mix(in srgb, ${accent} 10%, transparent)` }}
            aria-hidden
          >
            {service.index}
          </div>

          {/* Spot lumineux suivant le curseur — couleur du service */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(560px circle at var(--mx) var(--my), color-mix(in srgb, var(--sa) 20%, transparent), transparent 70%)",
            }}
            aria-hidden
          />

          {/* Barre supérieure : identifiant du module + compteur de pile */}
          <div className="relative z-20 flex items-center justify-between p-5 md:p-6">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              {"// " + service.index}
              <span className="hidden md:inline">{" · " + service.tagline}</span>
            </p>
            <span className="glass rounded-full px-3 py-1 font-mono text-[11px] text-muted-foreground">
              {service.index} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Contenu : identité (gauche) + détail expert (droite) */}
          <div className="relative z-10 grid min-h-[62vh] md:grid-cols-5 md:min-h-[66vh]">
            {/* Identité du service */}
            <div className="flex flex-col justify-between p-8 md:col-span-2 md:p-12">
              <div className="flex items-start justify-between">
                <span
                  className="select-none font-display text-5xl font-bold md:text-6xl"
                  style={{ color: `color-mix(in srgb, ${accent} 55%, transparent)` }}
                >
                  {service.index}
                </span>
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-sm"
                  style={chipStyle}
                >
                  <IconComponent className="h-8 w-8" aria-hidden />
                </span>
              </div>
              <div>
                <p
                  className="mb-2 font-mono text-[11px] uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {service.tagline}
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                  {service.title}
                </h2>
                {/* Règle d'accent sous le titre */}
                <div
                  className="mt-4 h-px w-16"
                  style={{ background: accent }}
                  aria-hidden
                />
              </div>
            </div>

            {/* Détail expert du service */}
            <div className="flex flex-col p-8 md:col-span-3 md:border-l md:border-border md:p-12">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t("common.presentation")}
                </p>
                {activePersona && service.persona?.[activePersona as keyof typeof service.persona] && (
                  <span
                    className="rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                    style={{
                      borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                      color: accent,
                      backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
                    }}
                  >
                    {activePersona === "ceo"
                      ? t("services.persona.ceo")
                      : activePersona === "architect"
                      ? t("services.persona.architect")
                      : t("services.persona.operational")}
                  </span>
                )}
              </div>
              <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                {(activePersona && service.persona?.[activePersona as keyof typeof service.persona]) || service.description}
              </p>

              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t("common.techStack")}
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="glass rounded-md px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                {service.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="glass-card relative overflow-hidden rounded-xl p-3"
                  >
                    {/* Liseré supérieur d'accent — définit la métrique */}
                    <div
                      className="pointer-events-none absolute inset-x-2 top-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
                      }}
                      aria-hidden
                    />
                    <p className="font-display text-2xl font-bold" style={{ color: accent }}>
                      {m.value}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => onNavigateDetail("service-detail", service.index)}
                variant="outline"
                size="sm"
                icon={<ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
                iconPosition="right"
                className="mt-auto self-start group"
              >
                {t("services.card.cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}