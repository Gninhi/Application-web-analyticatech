"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  BarChart2,
  Clock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAppContent } from "@/components/providers/ContentProvider";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { Sparkline } from "@/components/interactive/Sparkline";
import { ActivityFeed } from "@/components/interactive/ActivityFeed";
import type { MetricDTO } from "@/types/content";

// ─── Helpers ────────────────────────────────────────────────────────────────

const NEGATIVE_IS_GOOD = new Set([
  "cost_reduction",
  "cost_per_agent",
  "alert_resolution_time",
  "dashboard_latency",
  "energy_consumption",
]);

function toIntlLocale(locale: string): string {
  return locale === "en" ? "en-US" : "fr-FR";
}

function decimalsFor(n: number | null): number {
  if (n == null) return 0;
  return Number.isInteger(n) ? 0 : 2;
}

function LiveClock({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span suppressHydrationWarning className="tabular-nums">
      {now.toLocaleTimeString(locale, { timeZone: "UTC", hour12: false })}
    </span>
  );
}

function TrendIcon({ value, invert }: { value: number | null | undefined; invert: boolean }) {
  if (value == null || value === 0) return <Minus className="h-3 w-3 text-slate-600 dark:text-slate-400" />;
  const positive = invert ? value < 0 : value > 0;
  return positive ? (
    <TrendingUp className="h-3 w-3 text-emerald-400" />
  ) : (
    <TrendingDown className="h-3 w-3 text-rose-400" />
  );
}

function MiniProgressBar({ pct, color = "#F26D3D" }: { pct: number; color?: string }) {
  return (
    <div className="mt-3 h-[2px] w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.abs(pct))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ─── Grande carte métrique ────────────────────────────────────────────────

function HeroMetricCard({ metric, locale, index }: { metric: MetricDTO; locale: string; index: number }) {
  const invert = NEGATIVE_IS_GOOD.has(metric.key);
  const decimals = decimalsFor(metric.numericValue);
  const trendPositive = metric.trend != null ? (invert ? metric.trend < 0 : metric.trend > 0) : null;

  return (
    <div className="glass-strong group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-[#F26D3D]/40 hover:shadow-[0_0_40px_rgba(242,109,61,0.08)]">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(242,109,61,0.15) 0%, transparent 70%)" }}
        aria-hidden
      />
      {metric.source === "stream" && (
        <span className="absolute right-4 top-4 flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F26D3D] opacity-40" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F26D3D]" />
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F26D3D]/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
            {metric.label}
          </p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <TrendIcon value={metric.trend} invert={invert} />
          {metric.trend != null && (
            <span className={`font-mono text-[10px] font-bold ${trendPositive ? "text-emerald-400" : metric.trend === 0 ? "text-slate-500 dark:text-slate-400" : "text-rose-400"}`}>
              {metric.trend > 0 ? "+" : ""}{metric.trend.toFixed(1)} %
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        {metric.numericValue != null ? (
          <AnimatedCounter
            value={metric.numericValue}
            suffix={metric.suffix ?? ""}
            decimals={decimals}
            locale={locale}
            duration={1800}
            ariaLive
            className="font-display text-4xl md:text-5xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-[#F26D3D]"
          />
        ) : (
          <span className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{metric.value}</span>
        )}
      </div>
      {metric.sparkline && metric.sparkline.length >= 2 && (
        <div className="mt-4 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <Sparkline data={metric.sparkline} height={40} label={metric.label} className="h-full w-full" />
        </div>
      )}
      {metric.trend != null && (
        <MiniProgressBar pct={metric.trend} color={trendPositive ? "#10b981" : "#f43f5e"} />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#F26D3D]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
    </div>
  );
}

// ─── Petite carte métrique ────────────────────────────────────────────────

function CompactMetricCard({ metric, locale }: { metric: MetricDTO; locale: string }) {
  const invert = NEGATIVE_IS_GOOD.has(metric.key);
  const decimals = decimalsFor(metric.numericValue);

  return (
    <div className="glass group relative flex flex-col justify-between overflow-hidden rounded-xl border-black/10 dark:border-white/10 p-4 transition-all duration-300 hover:border-[#F26D3D]/30 hover:bg-white/10 dark:hover:bg-white/10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{metric.label}</span>
        <TrendIcon value={metric.trend} invert={invert} />
      </div>
      <div className="flex items-end justify-between gap-2">
        {metric.numericValue != null ? (
          <AnimatedCounter
            value={metric.numericValue}
            suffix={metric.suffix ?? ""}
            decimals={decimals}
            locale={locale}
            duration={1600}
            className="font-display text-xl font-bold tabular-nums text-slate-900 dark:text-white group-hover:text-[#F26D3D] transition-colors"
          />
        ) : (
          <span className="font-display text-xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
        )}
        {metric.source === "stream" && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] animate-pulse shrink-0" aria-hidden />
        )}
      </div>
      {metric.sparkline && metric.sparkline.length >= 2 && (
        <div className="mt-2 h-7 opacity-50 group-hover:opacity-80 transition-opacity">
          <Sparkline data={metric.sparkline} height={28} label={metric.label} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

// ─── Carte signal statique ────────────────────────────────────────────────

function SignalCard({ icon: Icon, label, value, accent = "#F26D3D" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      className="glass group relative flex flex-col gap-3 overflow-hidden rounded-xl border-black/10 dark:border-white/10 p-4 transition-all duration-300 hover:border-white/20 dark:hover:border-white/30"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: `radial-gradient(120% 100% at 100% 0%, ${accent}14 0%, transparent 55%)` }}
        aria-hidden
      />
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-lg border"
        style={{ borderColor: `${accent}30`, backgroundColor: `${accent}10` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} aria-hidden />
      </div>
      <div className="relative">
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────

export function DataConsoleBento() {
  const { t, locale } = useI18n();
  const { metrics, activityLogs } = useAppContent();

  const intlLocale = toIntlLocale(locale);

  const streamMetrics = useMemo(
    () => metrics.filter((m) => m.source === "stream").sort((a, b) => a.order - b.order),
    [metrics]
  );

  const allMetrics = useMemo(
    () => (streamMetrics.length >= 3 ? streamMetrics : metrics).slice(0, 6),
    [streamMetrics, metrics]
  );

  const [heroMetrics, compactMetrics] = useMemo(
    () => [allMetrics.slice(0, 2), allMetrics.slice(2, 6)],
    [allMetrics]
  );

  if (metrics.length === 0) return null;

  const SIGNAL_CARDS = [
    { icon: Zap, label: "Disponibilité système", value: "99.98 %", accent: "#F26D3D" },
    { icon: Activity, label: "Requêtes actives", value: "2 847", accent: "#3b82f6" },
    { icon: BarChart2, label: "Agents déployés", value: "124", accent: "#8b5cf6" },
    { icon: Clock, label: "Latence P95", value: "< 320 ms", accent: "#10b981" },
  ] as const;

  return (
    <section className="relative" aria-labelledby="dataconsole-bento-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glass-card relative overflow-hidden rounded-3xl border-black/10 dark:border-white/10"
        >
          {/* Halos de fond */}
          <div
            className="pointer-events-none absolute -top-40 right-1/3 h-80 w-80 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(242,109,61,0.4) 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-1/4 h-60 w-60 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
            aria-hidden
          />

          {/* Grille technique */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden
          />

          <div className="relative p-6 md:p-8 lg:p-10">
            {/* ── En-tête ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F26D3D]/30 bg-[#F26D3D]/10 px-3 py-1.5">
                  <Radio className="h-3 w-3 text-[#F26D3D]" aria-hidden />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] animate-pulse" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#F26D3D]">
                    {t("dataconsole.live")}
                  </span>
                </div>
                <h2
                  id="dataconsole-bento-heading"
                  className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                  {t("dataconsole.title")}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                  {t("dataconsole.desc")}
                </p>
              </div>

              {/* Horloge UTC */}
              <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F26D3D]">UTC</span>
                <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                  <LiveClock locale={intlLocale} />
                </span>
              </div>
            </div>

            {/* ── BENTO GRID ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

              {/* Colonne gauche : 2 métriques hero empilées */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {heroMetrics.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <HeroMetricCard metric={m} locale={intlLocale} index={i} />
                  </motion.div>
                ))}
              </div>

              {/* Colonne centrale : console d'activité live */}
              <motion.div
                className="lg:col-span-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 glass-strong"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="flex items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-[#F26D3D]" aria-hidden />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500 dark:text-slate-400">
                      {t("dataconsole.console.title")}
                    </span>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                </div>
                <div className="p-4">
                  <ActivityFeed logs={activityLogs} limit={7} />
                </div>
              </motion.div>

              {/* Colonne droite : signaux + métriques compactes */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                {/* 4 signaux */}
                <div className="grid grid-cols-2 gap-3">
                  {SIGNAL_CARDS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <SignalCard icon={s.icon} label={s.label} value={s.value} accent={s.accent} />
                    </motion.div>
                  ))}
                </div>

                {/* Métriques compactes CMS */}
                {compactMetrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {compactMetrics.slice(0, 4).map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                      >
                        <CompactMetricCard metric={m} locale={intlLocale} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Pied de section ──────────────────────────────────────── */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-5">
              <div className="flex flex-wrap items-center gap-2">
                {["REST API", "WebSocket", "GraphQL", "gRPC"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hidden md:block">
                {t("dataconsole.tag")} · v2.4.1
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
