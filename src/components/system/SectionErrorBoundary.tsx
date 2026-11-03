"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { trackClientException } from "@/instrumentation-client";
import { Button } from "@/components/ui/button";

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
            <AlertTriangle className="h-6 w-6 text-accent-ink" aria-hidden />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-ink font-semibold">
            Incident de rendu // {this.props.sectionName ?? "Module"}
          </span>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Cette partie de la page n&apos;a pas pu s&apos;afficher. Le reste de la page fonctionne
            normalement.
          </p>
          <Button
            onClick={this.handleRetry}
            variant="outline"
            size="sm"
            icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />}
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
