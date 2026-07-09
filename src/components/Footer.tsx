"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Cpu, Send, ShieldCheck, Github, Linkedin, Twitter } from "lucide-react";
import { NAV_ITEMS, type ViewKey } from "@/lib/data";

interface FooterProps {
  onNavigate: (view: ViewKey) => void;
}

/** Horloge UTC isolée dans son propre composant pour éviter le re-render du Footer complet. */
function UtcClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">UTC {time}</span>;
}

const SOCIAL_LINKS = [
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com" },
  { icon: Twitter, label: "Twitter / X", url: "https://twitter.com" },
  { icon: Github, label: "GitHub", url: "https://github.com" },
] as const;

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Validation basique côté client (le vrai envoi se fait via API en production)
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      setSubscribed(true);
      setEmail("");
      const t = setTimeout(() => setSubscribed(false), 4000);
      // Cleanup au unmount
      return () => clearTimeout(t);
    },
    [email]
  );

  return (
    <footer className="relative mt-auto border-t border-white/10 glass-strong">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Marque + statut */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F26D3D]/40 bg-[#F26D3D]/10">
                <Cpu className="h-4 w-4 text-[#F26D3D]" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-100">
                Analytica<span className="text-[#F26D3D]">tech</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs mb-5">
              Cabinet de conseil en IA, Transformation Digitale et Automatisation.
              Architecture de systèmes intelligents à l&apos;échelle.
            </p>

            {/* Indicateur de statut système */}
            <div className="inline-flex items-center gap-2.5 rounded-lg glass px-3 py-2">
              <motion.span
                className="h-2 w-2 rounded-full bg-[#4CAF50]"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
                System Online
              </span>
              <span className="mx-1 h-3 w-px bg-white/15" aria-hidden />
              <UtcClock />
            </div>
          </div>

          {/* Navigation secondaire */}
          <nav className="md:col-span-2" aria-label="Navigation pied de page">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertises */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              Expertises
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Intelligence Artificielle &amp; LLM</li>
              <li>Transformation Digitale</li>
              <li>Automatisation &amp; Workflows</li>
              <li>Systèmes Agentiques</li>
              <li>Business Intelligence</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F26D3D] mb-4">
              Newsletter Insights
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Recevez nos analyses techniques sur l&apos;IA en production.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  aria-label="Adresse email pour la newsletter"
                  className="terminal-input flex-1 min-w-0 rounded-lg bg-black/30 border border-white/10 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-600 outline-none transition"
                />
                <button
                  type="submit"
                  aria-label="S'abonner à la newsletter"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F26D3D] text-white transition hover:bg-[#ff7a4a]"
                >
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {subscribed && (
                <p className="font-mono text-[10px] text-[#4CAF50] uppercase tracking-wider">
                  ✓ Abonnement confirmé
                </p>
              )}
            </form>

            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass text-slate-400 hover:text-[#F26D3D] transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            © {new Date().getFullYear()} Analyticatech — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4CAF50]" aria-hidden />
              ISO 27001 · RGPD
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              v2.4.1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
