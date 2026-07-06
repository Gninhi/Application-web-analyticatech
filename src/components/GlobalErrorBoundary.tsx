"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary global — capture les crashes React et affiche
 * un écran "System Alert" stylisé dans l'esthétique cyberpunk.
 */
export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // En production : envoyer vers un service de monitoring (Sentry, etc.)
    console.error("[Analyticatech] System failure:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-military bg-[#011C40]">
          <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10">
              <AlertTriangle className="h-8 w-8 text-[#F26D3D]" aria-hidden />
            </div>
            <p
              className="font-mono text-xs uppercase tracking-[0.3em] text-[#F26D3D] mb-3"
            >
              System Alert // 0xERR_FATAL
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-100 mb-3">
              Défaillance système détectée
            </h1>
            <p className="text-slate-400 text-sm mb-2">
              Une erreur inattendue est survenue lors du rendu de l&apos;interface.
              L&apos;incident a été journalisé pour analyse.
            </p>
            {this.state.error && (
              <pre className="font-mono text-[11px] text-[#F26D3D]/80 bg-black/30 border border-white/10 rounded-lg p-3 mt-4 overflow-auto max-h-32 text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F26D3D] px-5 py-2.5 font-mono text-sm font-semibold text-white transition hover:bg-[#ff7a4a] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              REINITIALISER LE SYSTEME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
