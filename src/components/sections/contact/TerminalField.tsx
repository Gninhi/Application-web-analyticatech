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
}: TerminalFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 mb-2"
      >
        {label} {required && <span className="text-[#F26D3D]">*</span>}
      </label>
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
          "terminal-input w-full rounded-lg bg-black/30 border px-3.5 py-2.5 font-mono text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 outline-none transition",
          error ? "border-[#F26D3D]/60" : "border-black/10 dark:border-white/10"
        )}
      />
      {error && (
        <p
          id={`${name}-err`}
          className="mt-1.5 font-mono text-[11px] text-[#F26D3D] flex items-center gap-1.5"
        >
          <AlertTriangle className="h-3 w-3" aria-hidden /> {error}
        </p>
      )}
    </div>
  );
}
