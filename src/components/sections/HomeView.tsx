"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
  TrendingUp,
  Quote,
  ChevronRight,
  Activity,
} from "lucide-react";
import { SERVICES, STREAM_METRICS, ACTIVITY_LOG, TESTIMONIALS, CLIENT_LOGOS, type ViewKey } from "@/lib/data";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrambleText } from "@/components/ScrambleText";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Network,
  Workflow,
  Bot,
  BarChart3,
};

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-24 md:space-y-32">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 md:pt-44 pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 mb-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F26D3D] animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-300">
              Cabinet IA · Transformation · Automatisation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display font-bold tracking-tight text-slate-50 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]"
          >
            LE FUTUR DE
            <br />
            <span className="text-gradient-accent text-neon">L&apos;INTELLIGENCE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Nous concevons et industrialisons des systèmes à base d&apos;IA, d&apos;agents
            cognitifs et d&apos;automatisations critiques. De l&apos;architecture au déploiement,
            nous transformons vos processus métier en avantage concurrentiel durable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <button
              onClick={() => onNavigate("services")}
              className="group inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
            >
              Explorer nos services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-2 rounded-lg glass px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-slate-100 transition hover:bg-white/10"
            >
              Demander un devis
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl glass"
          >
            {[
              { v: "120+", l: "Missions livrées" },
              { v: "38%", l: "Coûts réduits" },
              { v: "99.98%", l: "Uptime plateforme" },
              { v: "4.9/5", l: "Satisfaction C-Level" },
            ].map((s) => (
              <div key={s.l} className="bg-[#022859]/30 p-5">
                <p className="font-display text-2xl md:text-3xl font-bold text-[#F26D3D]">{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                  {s.l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ MONOLITH ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tag="// 01 — MONOLITH"
            title="Une expertise, cinq piliers technologiques"
            description="Un monolithe d'expertise couvrant l'ensemble de la chaîne de valeur de l'IA appliquée — de la donnée brute à la décision autonome."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const Icon = ICONS[service.icon] ?? BrainCircuit;
              return (
                <motion.div
                  key={service.index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <SpotlightCard className="h-full p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <span className="font-mono text-3xl font-bold text-white/10">
                        {service.index}.
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F26D3D]/30 bg-[#F26D3D]/10">
                        <Icon className="h-5 w-5 text-[#F26D3D]" aria-hidden />
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-slate-50 mb-1.5">
                      {service.title}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#F26D3D] mb-3">
                      {service.tagline}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-[10px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                      {service.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="font-display text-lg font-bold text-slate-100">
                            {m.value}
                          </p>
                          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}

            <motion.button
              onClick={() => onNavigate("contact")}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: SERVICES.length * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-dashed border-[#F26D3D]/40 p-6 text-left transition hover:border-[#F26D3D]/70 hover:bg-[#F26D3D]/5 flex flex-col justify-between min-h-[260px]"
            >
              <span className="font-mono text-3xl font-bold text-white/10">06.</span>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-50 mb-2">
                  Besoin sur-mesure ?
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Co-construisons votre architecture cible avec nos architectes Solution.
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#F26D3D]">
                  <ScrambleText text="Initier un projet" />
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ============ DATA STREAM ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tag="// 02 — DATA STREAM"
            title="La donnée, en flux continu"
            description="Un aperçu live de notre infrastructure de monitoring. Chaque mission alimente une télémétrie partagée et observable."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 grid grid-cols-2 gap-5">
              {STREAM_METRICS.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      {metric.label}
                    </p>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#4CAF50]">
                      <TrendingUp className="h-3 w-3" aria-hidden />
                      +{metric.trend}%
                    </span>
                  </div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-slate-50">
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                      decimals={metric.suffix === "%" ? 2 : 0}
                    />
                  </p>
                  <Sparkline data={metric.sparkline} className="mt-4 h-10 w-full" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Activity className="h-4 w-4 text-[#F26D3D]" aria-hidden />
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
                  Live Activity Stream
                </span>
                <span className="ml-auto h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" aria-hidden />
              </div>
              <div className="flex-1 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {ACTIVITY_LOG.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 shrink-0">{log.time}</span>
                    <span
                      className={
                        log.level === "ok"
                          ? "text-[#4CAF50] shrink-0"
                          : log.level === "warn"
                          ? "text-[#F26D3D] shrink-0"
                          : "text-slate-500 shrink-0"
                      }
                    >
                      {log.level === "ok" ? "✓" : log.level === "warn" ? "!" : "→"}
                    </span>
                    <span className="text-slate-300">{log.event}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tag="// 03 — TRUST SIGNAL"
            title="Ils nous confient leurs systèmes critiques"
            description="Directions générales, CIO et C-Level d'organisations européennes : la confiance se construit sur la livraison."
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 opacity-60">
            {CLIENT_LOGOS.map((logo) => (
              <span
                key={logo}
                className="font-display text-lg md:text-xl font-bold tracking-widest text-slate-300 hover:text-[#F26D3D] transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 flex flex-col"
              >
                <Quote className="h-6 w-6 text-[#F26D3D]/60 mb-3" aria-hidden />
                <blockquote className="text-sm text-slate-300 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-white/10">
                  <p className="font-display font-bold text-slate-100">{t.author}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    {t.role} · {t.company}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA final ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14 text-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(242,109,61,0.25), transparent 60%)",
              }}
              aria-hidden
            />
            <p className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-4">
              {"// Prêt à initier ?"}
            </p>
            <h2 className="relative font-display text-3xl md:text-5xl font-bold text-slate-50 mb-4">
              Construisons votre architecture IA
            </h2>
            <p className="relative max-w-xl mx-auto text-slate-400 mb-8">
              Un échange d&apos;une heure avec un architecte Solution pour cadrer votre besoin.
            </p>
            <button
              onClick={() => onNavigate("contact")}
              className="relative inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#ff7a4a] neon-glow"
            >
              Planifier l&apos;échange
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#F26D3D] mb-3">
        {tag}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-50 mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F26D3D" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F26D3D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill="url(#spark-grad)" />
      <polyline
        points={points}
        fill="none"
        stroke="#F26D3D"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
