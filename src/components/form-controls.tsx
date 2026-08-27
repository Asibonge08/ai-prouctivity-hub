import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const base =
  "w-full rounded-md border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-shadow focus:ring-2 focus:ring-ring/25";

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "resize-y leading-relaxed", className)} />;
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, className)} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(base, "appearance-none pr-8", className)} />;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            value === opt
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-foreground ring-1 ring-border hover:bg-secondary",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...props
}: InputHTMLAttributes<HTMLButtonElement> & { loading?: boolean; children: ReactNode }) {
  return (
    <button
      {...props}
      type="button"
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    >
      {loading && (
        <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
      )}
      {loading ? "Generating…" : children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-surface px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border transition-colors hover:bg-secondary",
        className,
      )}
    >
      {children}
    </button>
  );
}
