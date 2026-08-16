"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { MovingButton } from "@/components/interactive/MovingButton";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary global — capture les crashes React et affiche
 * un écran "Alerte Système" stylisé dans l'esthétique cyberpunk.
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
        <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-military bg-background">
          <div className="glass-card rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#F26D3D]/40 bg-[#F26D3D]/10">
              <AlertTriangle className="h-8 w-8 text-[#F26D3D]" aria-hidden />
      </div>
            <p
              className="font-mono text-xs uppercase tracking-[0.3em] text-[#F26D3D] mb-3"
            >
              Alerte Système // 0xERR_FATAL
         </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Défaillance système détectée
        </h1>
            <p className="text-slate-400 dark:text-slate-300 text-sm mb-2">
              Une erreur inattendue est survenue lors du rendu de l&apos;interface.
              L&apos;incident a été journalisé pour analyse.
         </p>
            {this.state.error && (
              <pre className="font-mono text-[11px] text-[#F26D3D]/80 bg-black/30 border border-black/10 dark:border-white/10 rounded-lg p-3 mt-4 overflow-auto max-h-32 text-left">
                {this.state.error.message}
            </pre>
            )}
            <MovingButton
              onClick={this.handleReload}
              borderRadius="0.5rem"
              duration={3000}
              className="mt-6 bg-[#C9470F] px-5 py-2.5 text-sm text-white hover:bg-[#B63C0C]"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              RÉINITIALISER LE SYSTÈME
        </MovingButton>
      </div>
    </div>
      );
    }

    return this.props.children;
  }
}
