/**
 * SolutionVisuals — visuels des cartes solutions.
 *
 * Remplace les précédents visuels Three.js (ThreeDShape) : ceux-ci faisaient
 * charger three.js en eager (≈200+ KiB de JS inutilisé) et plantaient en
 * WebGL indisponible (erreurs console en headless → best-practices Lighthouse).
 *
 * Les nouveaux visuels sont 100% SVG/CSS inline : ultra-légers, GPU-only,
 * flat-shading cohérent avec la direction « ASCII / terminal » du hero.
 * Conservent l'identité : fond dark slate, accent orange #F26D3D,
 * accents bleu #022873 / vert #4CAF50, étiquette monospace en bas.
 */

function VisualFrame({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative h-48 w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-slate-900/90 flex items-center justify-center"
      role="img"
      aria-label={title}
    >
      {children}
      <span className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-widest text-slate-400 pointer-events-none bg-slate-950/60 px-2 py-0.5 rounded">
        {label}
      </span>
    </div>
  );
}

/** Point lumineux animé (pulse CSS) — overlay HTML, hors du viewBox SVG. */
function FlowDot({ tone = "orange" }: { tone?: "orange" | "green" | "blue" }) {
  const color =
    tone === "green" ? "#4CAF50" : tone === "blue" ? "#022873" : "#F26D3D";
  const pos =
    tone === "green"
      ? "left-[72%] top-[38%]"
      : tone === "blue"
      ? "left-[34%] top-[40%]"
      : "left-[52%] top-[36%]";
  return (
    <span
      className={`absolute ${pos} h-1.5 w-1.5 rounded-full animate-pulse`}
      style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      aria-hidden
    />
  );
}

export function SolutionVisualAI() {
  return (
    <VisualFrame label="Noyau Cognitif RAG" title="Pipeline d'ingestion et de récupération RAG">
      <svg viewBox="0 0 320 160" className="h-full w-full p-4" aria-hidden>
        <defs>
          <linearGradient id="aiViz" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#022873" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F26D3D" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Nœuds */}
        <g className="font-mono">
          <rect x="12" y="40" width="70" height="44" rx="8" fill="#02287366" stroke="#022873" />
          <text x="47" y="67" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">SOURCES</text>
          <rect x="125" y="34" width="78" height="56" rx="10" fill="none" stroke="#F26D3D" strokeWidth="1.5" />
          <text x="164" y="58" textAnchor="middle" fill="#F26D3D" fontSize="10" fontWeight="700">CŒUR IA</text>
          <text x="164" y="74" textAnchor="middle" fill="#ffffff99" fontSize="8">RAG · LLM</text>
          <rect x="238" y="40" width="70" height="44" rx="8" fill="none" stroke="#4CAF50" />
          <text x="273" y="67" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="700">ACTIONS</text>
        </g>
        {/* Liens animés */}
        <g stroke="url(#aiViz)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse">
          <line x1="82" y1="62" x2="125" y2="62" />
          <line x1="203" y1="62" x2="238" y2="62" />
        </g>
      </svg>
      <FlowDot />
    </VisualFrame>
  );
}

export function SolutionVisualTransformation() {
  return (
    <VisualFrame label="Architecture Cloud-Native" title="Architecture distribuée cloud-native">
      <svg viewBox="0 0 320 160" className="h-full w-full p-4" aria-hidden>
        {/* Couches */}
        <g className="font-mono">
          <rect x="20" y="26" width="280" height="26" rx="6" fill="#02287333" stroke="#022873" />
          <text x="160" y="43" textAnchor="middle" fill="#cfe0ff" fontSize="9">API GATEWAY</text>
          <rect x="42" y="62" width="90" height="44" rx="8" fill="none" stroke="#F26D3D" />
          <text x="87" y="80" textAnchor="middle" fill="#F26D3D" fontSize="9" fontWeight="700">MICRO-SERVICES</text>
          <text x="87" y="94" textAnchor="middle" fill="#ffffff88" fontSize="8">Conteneur · K8s</text>
          <rect x="188" y="62" width="90" height="44" rx="8" fill="none" stroke="#4CAF50" />
          <text x="233" y="80" textAnchor="middle" fill="#4CAF50" fontSize="9" fontWeight="700">ÉVÉNEMENTIEL</text>
          <text x="233" y="94" textAnchor="middle" fill="#ffffff88" fontSize="8">Pub/Sub · Async</text>
          <rect x="42" y="118" width="236" height="20" rx="6" fill="#02287333" stroke="#022873" />
          <text x="160" y="132" textAnchor="middle" fill="#cfe0ff" fontSize="9">DATA LAYER · SOUVERAIN</text>
        </g>
      </svg>
      <FlowDot tone="blue" />
    </VisualFrame>
  );
}

export function SolutionVisualAutomation() {
  return (
    <VisualFrame label="Orchestration & Automatisation" title="Chaîne d'automatisation des workflows">
      <svg viewBox="0 0 320 160" className="h-full w-full p-4" aria-hidden>
        <defs>
          <linearGradient id="autoViz" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F26D3D" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g className="font-mono">
          <rect x="14" y="30" width="64" height="46" rx="8" fill="#4CAF5022" stroke="#4CAF50" />
          <text x="46" y="57" textAnchor="middle" fill="#4CAF50" fontSize="9" fontWeight="700">TRIGGER</text>
          <rect x="126" y="22" width="68" height="62" rx="10" fill="none" stroke="#F26D3D" strokeWidth="1.5" />
          <text x="160" y="48" textAnchor="middle" fill="#F26D3D" fontSize="9" fontWeight="700">AGENTS</text>
          <text x="160" y="62" textAnchor="middle" fill="#ffffff99" fontSize="8">Orchestration</text>
          <text x="160" y="74" textAnchor="middle" fill="#ffffff66" fontSize="8">n8n · Temporal</text>
          <rect x="240" y="30" width="66" height="46" rx="8" fill="none" stroke="#022873" />
          <text x="273" y="57" textAnchor="middle" fill="#9db8ff" fontSize="9" fontWeight="700">RAPPORTS</text>
        </g>
        <g stroke="url(#autoViz)" strokeWidth="2" strokeDasharray="3 5" className="animate-pulse">
          <line x1="78" y1="53" x2="126" y2="53" />
          <line x1="194" y1="53" x2="240" y2="53" />
        </g>
      </svg>
      <FlowDot tone="green" />
    </VisualFrame>
  );
}

export function SolutionVisualAgentic() {
  return (
    <VisualFrame label="Multi-agents & Autonomie" title="Orchestration d'agents cognitifs autonomes">
      <svg viewBox="0 0 320 160" className="h-full w-full p-4" aria-hidden>
        <defs>
          <linearGradient id="agentViz" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F26D3D" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#022873" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g className="font-mono">
          {/* Orchestrateur central */}
          <rect x="122" y="22" width="76" height="56" rx="10" fill="#F26D3D22" stroke="#F26D3D" strokeWidth="1.5" />
          <text x="160" y="48" textAnchor="middle" fill="#F26D3D" fontSize="9" fontWeight="700">ORCHESTRE</text>
          <text x="160" y="62" textAnchor="middle" fill="#ffffff99" fontSize="8">Plan · Mémoire</text>
          {/* Agents périphériques */}
          <rect x="12" y="66" width="58" height="40" rx="8" fill="#02287333" stroke="#022873" />
          <text x="41" y="91" textAnchor="middle" fill="#9db8ff" fontSize="8" fontWeight="700">AGENT R</text>
          <rect x="250" y="66" width="58" height="40" rx="8" fill="#02287333" stroke="#022873" />
          <text x="279" y="91" textAnchor="middle" fill="#9db8ff" fontSize="8" fontWeight="700">AGENT S</text>
          <rect x="64" y="120" width="58" height="32" rx="8" fill="#4CAF5022" stroke="#4CAF50" />
          <text x="93" y="141" textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="700">AGENT T</text>
          <rect x="198" y="120" width="58" height="32" rx="8" fill="#4CAF5022" stroke="#4CAF50" />
          <text x="227" y="141" textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="700">AGENT U</text>
        </g>
        <g stroke="url(#agentViz)" strokeWidth="1.5" strokeDasharray="3 5" className="animate-pulse">
          <line x1="70" y1="86" x2="122" y2="66" />
          <line x1="198" y1="66" x2="250" y2="86" />
          <line x1="122" y1="78" x2="93" y2="120" />
          <line x1="198" y1="78" x2="227" y2="120" />
        </g>
      </svg>
      <FlowDot />
    </VisualFrame>
  );
}

export function SolutionVisualBI() {
  return (
    <VisualFrame label="Observabilité & Pilotage" title="Tableau de bord de pilotage de la performance">
      <svg viewBox="0 0 320 160" className="h-full w-full p-4" aria-hidden>
        <g className="font-mono">
          <text x="24" y="24" fill="#F26D3D" fontSize="9" fontWeight="700">KPI GLOBAL</text>
          <text x="24" y="42" fill="#fff" fontSize="20" fontWeight="700" fontFamily="monospace">+18.4%</text>
          {/* Barres */}
          <g fill="#F26D3D" opacity="0.85">
            <rect x="24" y="58" width="26" height="34" rx="3" />
            <rect x="60" y="46" width="26" height="46" rx="3" fill="#C9470F" />
            <rect x="96" y="64" width="26" height="28" rx="3" />
          </g>
          <g fill="none" stroke="#022873" strokeWidth="2">
            <polyline points="24,132 60,112 96,118 132,92 168,100 204,70 240,78 276,54" className="animate-pulse" />
          </g>
          <circle cx="276" cy="54" r="4" fill="#4CAF50" />
          <text x="24" y="148" fill="#ffffff66" fontSize="8">REVENUS · ROI · ALERTES</text>
        </g>
      </svg>
      <FlowDot />
    </VisualFrame>
  );
}
