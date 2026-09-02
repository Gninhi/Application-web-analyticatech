"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/lib/i18n";

export interface TechTickerItem {
  code: string;
  name: string;
  delta: string;
  status: string;
}

export interface ClientTickerItem {
  code: string;
  name: string;
  sector?: string | null;
  status?: string | null;
}

export type TickerItem = TechTickerItem | ClientTickerItem;

interface BaseStockTickerProps {
  /** Sens du défilement. "left" (défaut pour tech) ou "right" (défaut pour clients) */
  direction?: "left" | "right";
  /** Vitesse en secondes pour un cycle complet. Défaut : 35 */
  speed?: number;
  /** Classe CSS additionnelle sur le conteneur englobant */
  className?: string;
  /** Pause au survol. Défaut : true */
  pauseOnHover?: boolean;
}

export interface TechStockTickerProps extends BaseStockTickerProps {
  type: "tech";
  items?: TechTickerItem[];
  keywords?: string[];
}

export interface ClientStockTickerProps extends BaseStockTickerProps {
  type: "clients";
  items?: ClientTickerItem[];
  clients?: Array<{ name: string; sector?: string | null }>;
}

export interface CustomStockTickerProps<T> extends BaseStockTickerProps {
  type: "custom";
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export type StockTickerProps =
  | TechStockTickerProps
  | ClientStockTickerProps
  | CustomStockTickerProps<unknown>;

// ============================================================
// DONNÉES PAR DÉFAUT ENRICHIES POUR L'ESTHÉTIQUE TRADING BOURSE
// ============================================================

const DEFAULT_TECH_TICKERS_FR: TechTickerItem[] = [
  { code: "RAG-01", name: "Raisonnement & RAG", delta: "▲ 320ms", status: "LIVE" },
  { code: "AGNT-02", name: "Multi-Agents Swarms", delta: "▲ 87% AUTO", status: "LIVE" },
  { code: "AUTO-03", name: "Workflows n8n & Orchestration", delta: "▲ -75% LAT", status: "PROD" },
  { code: "DATA-04", name: "Data Platform & dbt Core", delta: "▲ 640+ KPI", status: "ONLINE" },
  { code: "LLM-05", name: "Inférence vLLM & Guardrails", delta: "▲ 94.2% ACC", status: "LIVE" },
  { code: "VCTR-06", name: "Vector Search Pinecone", delta: "▲ <15ms", status: "ACTIVE" },
  { code: "SOUV-07", name: "Souveraineté Cloud & RGPD", delta: "● 100% EU", status: "AUDITED" },
  { code: "PROD-08", name: "Déploiement CI/CD Cloud", delta: "▲ 99.98% UP", status: "STABLE" },
  { code: "TRFM-09", name: "Transformation Cognitive", delta: "▲ 3.2x ROI", status: "LIVE" },
  { code: "GOV-10", name: "Gouvernance des Données", delta: "● PII MASK", status: "ACTIF" },
];

const DEFAULT_TECH_TICKERS_EN: TechTickerItem[] = [
  { code: "RAG-01", name: "Reasoning & RAG", delta: "▲ 320ms", status: "LIVE" },
  { code: "AGNT-02", name: "Multi-Agent Swarms", delta: "▲ 87% AUTO", status: "LIVE" },
  { code: "AUTO-03", name: "n8n Workflows & Orchestration", delta: "▲ -75% LAT", status: "PROD" },
  { code: "DATA-04", name: "Data Platform & dbt Core", delta: "▲ 640+ KPI", status: "ONLINE" },
  { code: "LLM-05", name: "vLLM Inference & Guardrails", delta: "▲ 94.2% ACC", status: "LIVE" },
  { code: "VCTR-06", name: "Pinecone Vector Search", delta: "▲ <15ms", status: "ACTIVE" },
  { code: "SOUV-07", name: "Cloud Sovereignty & GDPR", delta: "● 100% EU", status: "AUDITED" },
  { code: "PROD-08", name: "Cloud CI/CD Deployment", delta: "▲ 99.98% UP", status: "STABLE" },
  { code: "TRFM-09", name: "Cognitive Transformation", delta: "▲ 3.2x ROI", status: "LIVE" },
  { code: "GOV-10", name: "Data Governance & Privacy", delta: "● PII MASK", status: "ACTIVE" },
];

const DEFAULT_CLIENT_TICKERS_FR: ClientTickerItem[] = [
  { code: "NOVA", name: "NovaFinance", sector: "FINTECH", status: "PROD ACTIVE" },
  { code: "AXIO", name: "Axiom Stratégie", sector: "CONSEIL", status: "PROD ACTIVE" },
  { code: "HELI", name: "Helios Energy", sector: "ÉNERGIE", status: "PROD ACTIVE" },
  { code: "MRDN", name: "Meridian Logistics", sector: "SUPPLY CHAIN", status: "PROD ACTIVE" },
  { code: "QNTM", name: "Quantum Retail", sector: "E-COMMERCE", status: "PROD ACTIVE" },
  { code: "ORBT", name: "Orbit Aerospace", sector: "INDUSTRIE", status: "PROD ACTIVE" },
  { code: "VRTX", name: "Vortex Health", sector: "BIOTECH", status: "PROD ACTIVE" },
  { code: "ZNTH", name: "Zenith Media", sector: "MÉDIA", status: "PROD ACTIVE" },
  { code: "PLRS", name: "Polaris Capital", sector: "INVESTISSEMENT", status: "PROD ACTIVE" },
  { code: "NRDC", name: "Nordic Systems", sector: "CLOUD INFRA", status: "PROD ACTIVE" },
];

const DEFAULT_CLIENT_TICKERS_EN: ClientTickerItem[] = [
  { code: "NOVA", name: "NovaFinance", sector: "FINTECH", status: "PROD ACTIVE" },
  { code: "AXIO", name: "Axiom Strategy", sector: "CONSULTING", status: "PROD ACTIVE" },
  { code: "HELI", name: "Helios Energy", sector: "ENERGY", status: "PROD ACTIVE" },
  { code: "MRDN", name: "Meridian Logistics", sector: "SUPPLY CHAIN", status: "PROD ACTIVE" },
  { code: "QNTM", name: "Quantum Retail", sector: "E-COMMERCE", status: "PROD ACTIVE" },
  { code: "ORBT", name: "Orbit Aerospace", sector: "INDUSTRY", status: "PROD ACTIVE" },
  { code: "VRTX", name: "Vortex Health", sector: "BIOTECH", status: "PROD ACTIVE" },
  { code: "ZNTH", name: "Zenith Media", sector: "MEDIA", status: "PROD ACTIVE" },
  { code: "PLRS", name: "Polaris Capital", sector: "INVESTMENT", status: "PROD ACTIVE" },
  { code: "NRDC", name: "Nordic Systems", sector: "CLOUD INFRA", status: "PROD ACTIVE" },
];

const TICKER_META_DICTIONARY: Record<string, { code: string; delta: string; status: string }> = {
  IA: { code: "AI-01", delta: "▲ 320ms", status: "LIVE" },
  AI: { code: "AI-01", delta: "▲ 320ms", status: "LIVE" },
  Agents: { code: "AGNT-02", delta: "▲ 12 actifs", status: "LIVE" },
  Automatisation: { code: "AUTO-03", delta: "▲ 87%", status: "PROD" },
  Automation: { code: "AUTO-03", delta: "▲ 87%", status: "PROD" },
  Transformation: { code: "TRFM-04", delta: "▲ 3.2x ROI", status: "LIVE" },
  BI: { code: "BI-05", delta: "▲ 94.2%", status: "LIVE" },
  RAG: { code: "RAG-06", delta: "▲ 98.1%", status: "PROD" },
  LLM: { code: "LLM-07", delta: "▲ GPT-4o", status: "LIVE" },
  Data: { code: "DATA-08", delta: "▲ 2.4 To/j", status: "LIVE" },
  Souveraineté: { code: "SOV-09", delta: "● FR/EU", status: "ACTIF" },
  Sovereignty: { code: "SOV-09", delta: "● FR/EU", status: "ACTIVE" },
  Production: { code: "PROD-10", delta: "▲ 99.9%", status: "LIVE" },
  Gouvernance: { code: "GOV-11", delta: "▲ RGPD", status: "ACTIF" },
  Governance: { code: "GOV-11", delta: "▲ GDPR", status: "ACTIVE" },
};

/**
 * StockTicker — Composant centralisé et uniforme pour les bandeaux défilants
 * de la page d'accueil (Style Ticker Boursier / Trading Terminal).
 *
 * Caractéristiques clés :
 * 1. Défilement 100% infini, mathématiquement symétrique (2x doubles pistes)
 * 2. Animation CSS auto-injectée ultra-robuste avec accélération GPU (translate3d)
 * 3. Dimensions et hauteurs strictement identiques pour tous les bandeaux du site
 * 4. Double estompage gauche / droite (masque CSS vectoriel + dégradés overlay)
 * 5. Pause fluide au survol
 */
export function StockTicker(props: StockTickerProps) {
  const {
    direction = props.type === "clients" ? "right" : "left",
    speed = props.type === "clients" ? 65 : 60,
    className,
    pauseOnHover = true,
  } = props;

  const { locale } = useI18n();

  // Construction des items selon le type
  let renderedItems: React.ReactNode[] = [];

  if (props.type === "tech") {
    let itemsToUse: TechTickerItem[] = [];
    if (props.items && props.items.length > 0) {
      itemsToUse = props.items;
    } else if (props.keywords && props.keywords.length > 0) {
      itemsToUse = props.keywords.map((kw, i) => {
        const meta = TICKER_META_DICTIONARY[kw] ?? {
          code: `SYS-${String(i + 1).padStart(2, "0")}`,
          delta: "▲ ACTIVE",
          status: "LIVE",
        };
        return {
          code: meta.code,
          name: kw,
          delta: meta.delta,
          status: meta.status,
        };
      });
    } else {
      itemsToUse = locale === "en" ? DEFAULT_TECH_TICKERS_EN : DEFAULT_TECH_TICKERS_FR;
    }

    renderedItems = itemsToUse.map((item, idx) => (
      <div key={idx} className="flex items-center gap-3.5 px-6 group/ticker cursor-default select-none">
        {/* Code Ticker Orange */}
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#F26D3D]/10 text-[#F26D3D] border border-[#F26D3D]/25 tracking-wider whitespace-nowrap">
          [{item.code}]
        </span>

        {/* Libellé / Capacité */}
        <span className="font-display text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 group-hover/ticker:text-[#F26D3D] transition-colors whitespace-nowrap">
          {item.name}
        </span>

        {/* Delta Métrique */}
        <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
          {item.delta}
        </span>

        {/* Statut Live */}
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          {item.status}
        </span>

        {/* Séparateur boursier orange */}
        <span className="text-[#F26D3D]/40 font-mono text-xs font-bold ml-2 select-none" aria-hidden>
          {"//"}
        </span>
      </div>
    ));
  } else if (props.type === "clients") {
    let itemsToUse: ClientTickerItem[] = [];
    if (props.items && props.items.length > 0) {
      itemsToUse = props.items;
    } else if (props.clients && props.clients.length > 0) {
      itemsToUse = props.clients.map((c) => ({
        code: c.name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "CORP",
        name: c.name,
        sector: c.sector || "ENTERPRISE",
        status: "PROD ACTIVE",
      }));
    } else {
      itemsToUse = locale === "en" ? DEFAULT_CLIENT_TICKERS_EN : DEFAULT_CLIENT_TICKERS_FR;
    }

    renderedItems = itemsToUse.map((item, idx) => (
      <div key={idx} className="flex items-center gap-3.5 px-6 group/client cursor-default select-none">
        {/* Code Ticker Bleu Ciel */}
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25 tracking-wider whitespace-nowrap">
          [{item.code}]
        </span>

        {/* Nom Entreprise */}
        <span className="font-display text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 group-hover/client:text-[#F26D3D] transition-colors whitespace-nowrap">
          {item.name}
        </span>

        {/* Badge Secteur */}
        {item.sector && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 whitespace-nowrap">
            {item.sector}
          </span>
        )}

        {/* Statut Déploiement */}
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {item.status || "PROD ACTIVE"}
        </span>

        {/* Séparateur boursier orange */}
        <span className="text-[#F26D3D]/40 font-mono text-xs font-bold ml-2 select-none" aria-hidden>
          {"//"}
        </span>
      </div>
    ));
  } else if (props.type === "custom") {
    renderedItems = props.items.map((item, idx) => (
      <div key={idx} className="shrink-0 flex items-center">
        {props.renderItem(item, idx)}
      </div>
    ));
  }

  if (renderedItems.length === 0) return null;

  // Répétition pour garantir une boucle infinie continue (translation -50%)
  const baseItems = renderedItems.length < 6 ? [...renderedItems, ...renderedItems] : renderedItems;
  const fullTrackItems = [...baseItems, ...baseItems];

  const trackClass = direction === "left" ? "stock-ticker-track-left" : "stock-ticker-track-right";

  return (
    <div className={cn("w-full relative my-4", className)}>
      {/* Cadre Ticker Boursier Universel et Uniforme */}
      <div
        className={cn(
          "stock-ticker-container relative w-full overflow-hidden flex items-center select-none",
          pauseOnHover && "hover:[&_.stock-ticker-track-left]:[animation-play-state:paused] hover:[&_.stock-ticker-track-right]:[animation-play-state:paused]",
          "border-y border-black/10 dark:border-white/10",
          "py-3.5 bg-black/[0.03] dark:bg-white/[0.02] backdrop-blur-md"
        )}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        <div
          className={cn(trackClass, "flex items-center shrink-0")}
          style={
            {
              "--ticker-duration": `${speed}s`,
              animationDuration: `${speed}s`,
            } as React.CSSProperties
          }
        >
          {fullTrackItems.map((node, i) => (
            <React.Fragment key={i}>{node}</React.Fragment>
          ))}
        </div>

        {/* Estompage progressif gauche & droite doux */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-44 bg-gradient-to-r from-background via-background/60 to-transparent z-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-44 bg-gradient-to-l from-background via-background/60 to-transparent z-10"
          aria-hidden
        />
      </div>
    </div>
  );
}
