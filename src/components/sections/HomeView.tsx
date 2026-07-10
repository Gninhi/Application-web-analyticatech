"use client";

import { useId, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Quote,
  ChevronRight,
  Activity,
} from "lucide-react";
import { SERVICES, STREAM_METRICS, ACTIVITY_LOG, TESTIMONIALS, CAPABILITIES, MARQUEE_KEYWORDS, HERO_STATS, type ViewKey } from "@/lib/data";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ScrambleText } from "@/components/ScrambleText";
import { PixelRevealTitle } from "@/components/PixelRevealTitle";
import { Marquee } from "@/components/Marquee";
import { SnakeButton } from "@/components/SnakeButton";
import { SERVICE_ICONS } from "@/lib/services";

interface HomeViewProps {
  onNavigate: (view: ViewKey) => void;
}

// Types des données dynamiques
interface DynamicMetric {
  key: string;
  label: string;
  value: string;
  suffix: string;
}
interface DynamicClient {
  name: string;
  sector: string;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  // État pour les données dynamiques (métriques + clients)
  const [dynamicMetrics, setDynamicMetrics] = useState<DynamicMetric[]>([]);
  const [dynamicClients, setDynamicClients] = useState<DynamicClient[]>([]);

  useEffect(() => {
    // Fetch parallèle des métriques et clients
    Promise.all([
      fetch("/api/metrics").then((r) => r.json()).catch(() => ({ success: false, metrics: [] })),
      fetch("/api/clients").then((r) => r.json()).catch(() => ({ success: false, clients: [] })),
    ]).then(([metricsRes, clientsRes]) => {
      if (metricsRes.success) setDynamicMetrics(metricsRes.metrics);
      if (clientsRes.success) setDynamicClients(clientsRes.clients);
    });
  }, []);

  // Stats affichées : dynamiques si dispo, sinon fallback statique (HERO_STATS)
  const displayStats = dynamicMetrics.length >= 4
    ? dynamicMetrics.slice(0, 4).map((m) => ({ v: m.value, l: m.label }))
    : HERO_STATS;

  // Clients affichés : dynamiques si dispo, sinon fallback statique
  const displayClients = dynamicClients.length > 0
    ? dynamicClients
    : ["NOVA BANK", "AXIOM CORP", "HELIOS GROUP", "MERIDIAN", "QUANTUM LABS", "ORBITAL SYS"].map((name) => ({ name, sector: "" }));
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

          <h1 className="font-display font-bold tracking-tight text-[#F26D3D] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
            <PixelRevealTitle
              text="LE FUTUR DE"
              as="span"
              className="block"
              delay={0.05}
            />
            <PixelRevealTitle
              text="L'INTELLIGENCE"
              as="span"
              className="block text-neon"
              delay={0.35}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-7 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed"
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
            <SnakeButton
              onClick={() => onNavigate("services")}
              variant="primary"
              size="lg"
              className="group neon-glow"
            >
              Explorer nos services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </SnakeButton>
            <SnakeButton
              onClick={() => onNavigate("contact")}
              variant="ghost"
              size="lg"
            >
              Demander un devis
            </SnakeButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl glass-card"
          >
            {displayStats.map((s) => (
              <div key={s.l} className="bg-[#022859]/30 p-5">
                <p className="font-display text-2xl md:text-3xl font-bold text-[#F26D3D]">{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-300 mt-1">
                  {s.l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SERVICE TICKER — défilement dynamique des services ============ */}
      <Marquee
        items={SERVICES}
        speed={35}
        className="border-y border-white/10 bg-[#011C40]/60 backdrop-blur-sm py-4"
        renderItem={(item) => {
          const service = item as typeof SERVICES[number];
          const Icon = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
          return (
            <button
              onClick={() => onNavigate("services")}
              className="group flex items-center gap-3 px-6 text-slate-200 hover:text-[#F26D3D] transition-colors"
              aria-label={`Voir le service : ${service.title}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F26D3D]/30 bg-[#F26D3D]/10">
                <Icon className="h-4 w-4 text-[#F26D3D]" aria-hidden />
              </span>
              <span className="font-display text-lg md:text-xl font-bold tracking-tight whitespace-nowrap">
                {service.title}
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-[#F26D3D] transition-colors" aria-hidden />
              <span className="text-slate-600 mx-2" aria-hidden>|</span>
            </button>
          );
        }}
      />

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
              const Icon = SERVICE_ICONS[service.icon] ?? SERVICE_ICONS.BrainCircuit;
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
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">
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
                          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
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
                  className="glass-card rounded-2xl p-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
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
              className="glass-card rounded-2xl p-5 flex flex-col"
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
                    <span className="text-slate-500 shrink-0">{log.time}</span>
                    <span
                      className={
                        log.level === "ok"
                          ? "text-[#4CAF50] shrink-0"
                          : log.level === "warn"
                          ? "text-[#F26D3D] shrink-0"
                          : "text-slate-400 shrink-0"
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

      {/* ============ MARQUEE BAND (mots-clés signature) ============ */}
      <Marquee
        items={MARQUEE_KEYWORDS}
        speed={45}
        className="border-y border-white/10 py-4"
        renderItem={(item) => (
          <span className="flex items-center gap-6 px-6">
            <span className="font-display text-2xl md:text-4xl font-bold tracking-tight text-slate-100/80">
              {item as string}
            </span>
            <span className="text-[#F26D3D] text-xs" aria-hidden>●</span>
          </span>
        )}
      />

      {/* ============ CAPABILITIES — stretched text signature ============ */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tag="// 03 — CAPABILITIES"
            title="Un système voit. Tous savent."
            description="Nos architectures agentiques fonctionnent en réseau coordonné. La signature d'une plateforme de classe bancaire : détection, réponse, apprentissage — en continu."
          />

          <div className="mt-14 space-y-4">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl glass-card hover:border-[#F26D3D]/30 transition-colors"
              >
                {/* Texte étiré signature (visible au repos, révèle le contenu au hover) */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-1/2">
                    <p className="stretch-text text-sm md:text-base text-slate-300 group-hover:text-[#F26D3D] transition-colors leading-relaxed">
                      {cap.stretch}
                    </p>
                    <h3 className="mt-4 font-display text-2xl md:text-3xl font-bold text-slate-50 tracking-tight">
                      {cap.title}
                    </h3>
                  </div>
                  <div className="md:w-1/2 md:border-l border-white/10 md:pl-8">
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {cap.description}
                    </p>
                    <ul className="space-y-2">
                      {cap.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-[#4CAF50] mt-0.5 shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Index latéral */}
                <span className="absolute top-4 right-5 font-mono text-xs text-slate-500">
                  0{i + 1} / 0{CAPABILITIES.length}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES ============ */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tag="// 04 — TRUST SIGNAL"
            title="Ils nous confient leurs systèmes critiques"
            description="Directions générales, CIO et C-Level d'organisations européennes : la confiance se construit sur la livraison."
          />

          <div className="mt-10 space-y-4">
            {/* Piste 1 — gauche → droite */}
            <Marquee
              items={displayClients}
              speed={45}
              className="py-2"
              renderItem={(item) => {
                const client = item as { name: string; sector: string };
                return (
                  <span className="group flex items-center gap-3 px-6">
                    <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-300 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                      {client.name}
                    </span>
                    {client.sector && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                        {client.sector}
                      </span>
                    )}
                  </span>
                );
              }}
            />
            {/* Piste 2 — droite → gauche (sens inverse) */}
            {displayClients.length > 6 && (
              <Marquee
                items={[...displayClients].reverse()}
                direction="right"
                speed={50}
                className="py-2"
                renderItem={(item) => {
                  const client = item as { name: string; sector: string };
                  return (
                    <span className="group flex items-center gap-3 px-6">
                      {client.sector && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                          {client.sector}
                        </span>
                      )}
                      <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-300 group-hover:text-[#F26D3D] transition-colors whitespace-nowrap">
                        {client.name}
                      </span>
                    </span>
                  );
                }}
              />
            )}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 flex flex-col"
              >
                <Quote className="h-6 w-6 text-[#F26D3D]/60 mb-3" aria-hidden />
                <blockquote className="text-sm text-slate-300 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-white/10">
                  <p className="font-display font-bold text-slate-100">{t.author}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
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
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-14 text-center">
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
            <p className="relative max-w-xl mx-auto text-slate-300 mb-8">
              Un échange d&apos;une heure avec un architecte Solution pour cadrer votre besoin.
            </p>
            <SnakeButton
              onClick={() => onNavigate("contact")}
              variant="primary"
              size="lg"
              className="relative neon-glow"
            >
              Planifier l&apos;échange
              <ArrowRight className="h-4 w-4" aria-hidden />
            </SnakeButton>
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
