import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SendHorizontal, AlertCircle, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { streamAi, type ChatTurn } from "@/lib/ai-client";
import { chatSuggestions } from "@/lib/workspace-data";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Aileron" },
      {
        name: "description",
        content:
          "Ask your AI workplace assistant to prioritise tasks, rewrite messages, build agendas or prepare you for meetings.",
      },
      { property: "og:title", content: "AI Workplace Chat — Aileron" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history: ChatTurn[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      await streamAi({ feature: "chat", messages: history }, (full) => {
        setMessages([...history, { role: "assistant", content: full }]);
      });
    } catch (e) {
      setMessages(history);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  return (
    <AppShell
      title="AI Chat"
      description="Your workplace assistant keeps the context of this conversation. It is cleared when you leave the page."
    >
      <div className="panel flex h-[70vh] min-h-[520px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-sm font-medium">Ask your workplace assistant</p>
              <p className="mt-1 max-w-[44ch] text-pretty text-xs text-muted-foreground">
                Prioritising, rewriting, summarising, agendas and meeting prep — start with one of
                these.
              </p>
              <div className="mt-5 grid w-full max-w-md gap-2">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-md bg-surface-sunken px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[92%] rounded-lg rounded-bl-sm bg-surface-sunken px-3.5 py-2.5"
                }
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <div className="prose-output">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-1.5 px-1 text-muted-foreground">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
              <span className="ml-1 text-xs">Thinking…</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">Message failed</p>
                <p className="mt-0.5 text-destructive/85">{error}</p>
                {lastUser && (
                  <button
                    onClick={() => {
                      setMessages(messages.slice(0, -1));
                      void send(lastUser.content);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                  >
                    <RotateCcw className="size-3" /> Retry
                  </button>
                )}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-3 sm:p-4"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask anything about your work…"
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-md border border-input bg-surface-sunken px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/25"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex size-[42px] shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <SendHorizontal className="size-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
