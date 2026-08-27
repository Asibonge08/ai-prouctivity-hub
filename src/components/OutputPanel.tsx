import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RefreshCw, Pencil, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  emptyTitle: string;
  emptyHint: string;
  label?: string;
};

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  emptyTitle,
  emptyHint,
  label = "AI output",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  const hasContent = value.trim().length > 0;

  return (
    <section className="panel flex min-h-[320px] flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          {loading && <span className="size-2 animate-pulse rounded-full bg-success" />}
          <span className="label-eyebrow">{label}</span>
        </div>
        {hasContent && !loading && (
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
              {editing ? "Preview" : "Edit"}
            </button>
            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              Regenerate
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 pt-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Generation failed</p>
              <p className="mt-0.5 text-destructive/85">{error}</p>
              <button onClick={onRegenerate} className="mt-2 text-xs font-semibold underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {!error && !hasContent && loading && (
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm text-muted-foreground">Drafting with AI…</p>
            {[90, 100, 75, 96, 60].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-sm bg-muted"
                style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        )}

        {!error && !hasContent && !loading && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary">
              <Pencil className="size-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium">{emptyTitle}</p>
            <p className="mt-1 max-w-[42ch] text-pretty text-xs text-muted-foreground">
              {emptyHint}
            </p>
          </div>
        )}

        {!error && hasContent && (
          <>
            {editing ? (
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[320px] w-full resize-y rounded-md border border-input bg-surface-sunken p-3 font-mono text-[13px] leading-relaxed outline-none focus:ring-2 focus:ring-ring/25"
              />
            ) : (
              <article className={cn("prose-output max-w-none", loading && "opacity-90")}>
                <ReactMarkdown
                  components={{
                    table: ({ children }) => (
                      <div className="my-3 overflow-x-auto rounded-md border border-border">
                        <table className="w-full text-left text-[13px]">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border-b border-border bg-surface-sunken px-3 py-2 text-xs font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-border/60 px-3 py-2 align-top">{children}</td>
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
                {loading && (
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-foreground align-middle" />
                )}
              </article>
            )}
          </>
        )}
      </div>
    </section>
  );
}
