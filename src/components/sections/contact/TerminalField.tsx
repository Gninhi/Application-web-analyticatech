"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface TerminalFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
}

export function TerminalField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  error,
  required,
  icon,
  hint,
  className,
}: TerminalFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block font-mono text-[11px] uppercase tracking-[0.2em] font-medium text-slate-700 dark:text-slate-300"
        >
          {label} {required && <span className="text-accent-ink">*</span>}
        </label>
        {hint && (
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-400 hidden sm:inline">
            {hint}
          </span>
        )}
      </div>

      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-accent-ink transition-colors">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-err` : undefined}
          className={cn(
            "w-full rounded-xl border px-3.5 py-2.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition-all duration-200",
            icon ? "pl-10" : "pl-3.5",
            "bg-white/80 dark:bg-slate-950/60 backdrop-blur-sm",
            error
              ? "border-[#F26D3D] ring-2 ring-[#F26D3D]/20 shadow-[0_0_12px_rgba(242,109,61,0.15)]"
              : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-[#F26D3D] focus:ring-2 focus:ring-[#F26D3D]/20 focus:shadow-[0_0_15px_rgba(242,109,61,0.12)]"
          )}
        />
      </div>

      {error && (
        <p
          id={`${name}-err`}
          className="font-mono text-[11px] text-accent-ink flex items-center gap-1.5 pt-0.5"
          role="alert"
        >
          <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
