"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { trackClientException } from "@/instrumentation-client";

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
  fallback?: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * SectionErrorBoundary — Error boundary granulaire pour sections animées complexes.
 * Empêche une défaillance isolée (ex: calcul d'animation, WebGL, scroll-jacking)
 * de faire crasher toute la page ou d'afficher un écran blanc.
 */
export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(
      `[Analyticatech] Section error in ${this.props.sectionName ?? "Section"}:`,
      error,
      info.componentStack
    );
    try {
      trackClientException(error, {
        componentStack: info.componentStack || undefined,
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
    } catch {
      // Ignorer pour éviter tout crash en cascade
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="my-8 w-full rounded-2xl border border-[#F26D3D]/30 bg-[#F26D3D]/5 p-8 text-center backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10">
            <AlertTriangle className="h-6 w-6 text-[#F26D3D]" aria-hidden />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F26D3D] font-bold">
            Incident de rendu // {this.props.sectionName ?? "Module"}
          </span>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Le composant interactif a rencontré une anomalie temporaire. Le reste de la page
            demeure pleinement fonctionnel.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/10 px-4 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 transition-colors hover:border-[#F26D3D] hover:text-[#F26D3D]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            <span>Réinitialiser ce module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
