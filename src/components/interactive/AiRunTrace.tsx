"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Database,
  BrainCircuit,
  UserCheck,
  BarChart3,
  Quote,
  ShieldCheck,
  History,
  RotateCcw,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { FilterPill } from "@/components/interactive/FilterPill";
import { IconBadge } from "@/components/ui/IconBadge";

/**
 * AiRunTrace — section 05 « De la donnée à la décision ».
 *
 * Au lieu de quatre étiquettes abstraites, le visiteur choisit une question
 * métier et voit le système la traiter comme une trace d'exécution : sources
 * lues, réponse sourcée, action soumise à sa validation, indicateur mis à jour.
 *
 * - Tout le texte est présent dès le premier rendu (SEO, LCP) : la lecture
 *   animée ne fait qu'avancer les statuts et la ligne de progression.
 * - La lecture démarre quand la section devient visible ; elle s'arrête à
 *   l'étape de validation (bouton), puis reprend après un clic, ou seule au
 *   bout de quelques secondes avec la mention « validation simulée ».
 * - Mouvement réduit : pas de lecture, la trace complète est affichée.
 * - Exemples illustratifs, signalés comme tels (charte de contenu).
 */

const SCENARIOS = ["s1", "s2", "s3"] as const;
type ScenarioKey = (typeof SCENARIOS)[number];

/** Durée d'exécution simulée de chaque étape (ms), hors validation. */
const STEP_MS = [1500, 2600, 0, 1400] as const;
/** Délai avant validation simulée si le visiteur ne clique pas (ms). */
const AUTO_APPROVE_MS = 6000;

type StepStatus = "done" | "running" | "waiting" | "next";

/** Remplace les renvois « [n] » d'une réponse par des pastilles de citation. */
function withCitations(
  text: string,
  label: (n: string) => string,
): ReactNode[] {
  return text.split(/(\[\d\])/g).map((part, i) => {
    const m = /^\[(\d)\]$/.exec(part);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    return (
      <sup
        key={i}
        aria-label={label(m[1] ?? "")}
        className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-0.5 items-center justify-center rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10 px-1 font-mono text-[10px] font-semibold not-italic text-accent-ink"
      >
        {m[1]}
      </sup>
    );
  });
}

export function AiRunTrace() {
  const { t } = useI18n();
  const [scenario, setScenario] = useState<ScenarioKey>("s1");
  /** Nombre d'étapes terminées (0 → 4) ; 4 = trace complète (premier rendu). */
  const [completed, setCompleted] = useState(4);
  const [approval, setApproval] = useState<"none" | "user" | "simulated">(
    "simulated",
  );
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const reducedMotion = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const play = useCallback(() => {
    if (reducedMotion()) return;
    setCompleted(0);
    setApproval("none");
    setPlaying(true);
  }, [reducedMotion]);

  // Lecture au premier passage de la section dans le viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          play();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  // Avancement : chaque étape s'exécute, la validation attend le visiteur
  useEffect(() => {
    if (!playing || completed >= 4) return;
    if (completed === 2) {
      if (approval !== "none") {
        const id = setTimeout(() => setCompleted(3), 450);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setApproval("simulated"), AUTO_APPROVE_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setCompleted((c) => c + 1);
      if (completed === 3) setPlaying(false);
    }, STEP_MS[completed]);
    return () => clearTimeout(id);
  }, [playing, completed, approval]);

  const selectScenario = (key: ScenarioKey) => {
    setScenario(key);
    play();
  };

  const status = (index: number): StepStatus => {
    if (index < completed) return "done";
    if (index === completed)
      return index === 2 ? "waiting" : playing ? "running" : "next";
    return "next";
  };

  const k = (suffix: string) => t(`home.run.${scenario}.${suffix}`);
  const sources = [k("src1"), k("src2"), k("src3")];
  const progress = Math.min(completed, 3) / 3;
  const citeLabel = (n: string) => `Source ${n}`;

  const STEPS = [
    {
      icon: Database,
      title: t("home.run.step1"),
      verb: t("home.run.step1.verb"),
      body: (
        <>
          <ol className="flex flex-wrap gap-2">
            {sources.map((src, i) => (
              <li
                key={src}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-200"
              >
                <span className="font-mono text-[10px] font-semibold text-accent-ink">
                  {i + 1}
                </span>
                {src}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {t("home.run.step1.note")}
          </p>
        </>
      ),
    },
    {
      icon: BrainCircuit,
      title: t("home.run.step2"),
      verb: t("home.run.step2.verb"),
      body: (
        <p className="rounded-2xl border border-border bg-background/60 p-4 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
          {withCitations(k("answer"), citeLabel)}
        </p>
      ),
    },
    {
      icon: UserCheck,
      title: t("home.run.step3"),
      verb:
        approval === "none"
          ? t("home.run.step3.verb")
          : t("home.run.step3.verb.done"),
      body: (
        <div className="rounded-2xl border border-[#F26D3D]/35 bg-[#F26D3D]/[0.06] p-4">
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
            {k("action")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {approval === "none" ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setApproval("user")}
                  icon={<Check className="h-3.5 w-3.5" aria-hidden />}
                  data-cta="home_run_approve"
                >
                  {t("home.run.step3.approve")}
                </Button>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {t("home.run.step3.waiting")}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-link">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {approval === "user"
                  ? t("home.run.step3.approved")
                  : t("home.run.step3.simulated")}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: t("home.run.step4"),
      verb: t("home.run.step4.verb"),
      body: (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {k("decision")}
        </p>
      ),
    },
  ];

  const STATUS_LABEL: Record<StepStatus, string> = {
    done: t("home.run.status.done"),
    running: t("home.run.status.running"),
    waiting: t("home.run.status.waiting"),
    next: t("home.run.status.next"),
  };

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden glass-card rounded-3xl p-6 md:p-10"
    >
      {/* En-tête */}
      <div className="flex flex-col gap-4 border-b border-black/10 pb-8 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-ink">
            {t("home.section.graph")}
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl">
            {t("home.graph.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
            {t("home.run.subtitle")}
          </p>
        </div>
        <span className="self-start rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 md:self-auto">
          {t("home.run.example")}
        </span>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Question et garanties */}
        <div className="lg:col-span-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {t("home.run.choose")}
          </p>
          <div
            role="tablist"
            aria-label={t("home.run.choose")}
            className="flex flex-wrap gap-2"
          >
            {SCENARIOS.map((key) => (
              <FilterPill
                key={key}
                active={scenario === key}
                aria-controls="ai-run-trace"
                onClick={() => selectScenario(key)}
              >
                {t(`home.run.${key}.chip`)}
              </FilterPill>
            ))}
          </div>

          <figure className="mt-6 rounded-2xl border border-border bg-background/60 p-5">
            <figcaption className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
              <Quote className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
              {t("home.run.asked")}
            </figcaption>
            <blockquote className="mt-3 font-display text-xl font-semibold leading-snug text-slate-900 dark:text-white md:text-2xl">
              {k("question")}
            </blockquote>
          </figure>

          <ul className="mt-6 space-y-3">
            {[
              { icon: Quote, label: t("home.run.g1") },
              { icon: ShieldCheck, label: t("home.run.g2") },
              { icon: History, label: t("home.run.g3") },
            ].map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-100"
              >
                <IconBadge icon={icon} size="sm" />
                {label}
              </li>
            ))}
          </ul>

          <Button
            variant="ghost"
            size="sm"
            onClick={play}
            icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
            className="mt-6"
          >
            {t("home.run.replay")}
          </Button>
        </div>

        {/* Trace d'exécution */}
        <div
          id="ai-run-trace"
          role="tabpanel"
          aria-live="polite"
          className="lg:col-span-7"
        >
          <ol className="relative space-y-6">
            {/* Ligne de progression : elle relie les étapes et se remplit à mesure qu'elles s'exécutent */}
            <span
              className="absolute bottom-6 left-[21px] top-6 w-px bg-black/10 dark:bg-white/10"
              aria-hidden
            />
            <span
              className="absolute left-[21px] top-6 w-px origin-top bg-[#F26D3D] transition-transform duration-700 ease-out"
              style={{
                height: "calc(100% - 3rem)",
                transform: `scaleY(${progress})`,
              }}
              aria-hidden
            />
            {STEPS.map((step, i) => {
              const st = status(i);
              const lit = st !== "next";
              return (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[2.75rem_1fr] gap-4"
                  data-status={st}
                >
                  <IconBadge
                    icon={step.icon}
                    size="md"
                    tone={lit ? "accent" : "neutral"}
                    className={cn(
                      "transition-colors bg-background",
                      st === "running" && "ring-2 ring-[#F26D3D]/40",
                    )}
                  />
                  <div className="min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                        <span className="mr-2 font-mono text-xs text-accent-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                          st === "done" && "bg-link/10 text-link",
                          st === "running" && "bg-[#F26D3D]/10 text-accent-ink",
                          st === "waiting" && "bg-[#F26D3D]/15 text-accent-ink",
                          st === "next" &&
                            "bg-black/5 text-slate-600 dark:bg-white/10 dark:text-slate-400",
                        )}
                      >
                        {STATUS_LABEL[st]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {step.verb}
                    </p>
                    <div className="mt-3">{step.body}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
