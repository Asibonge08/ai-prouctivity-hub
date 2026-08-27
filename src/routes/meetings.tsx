import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Field, TextArea, TextInput, PrimaryButton, GhostButton } from "@/components/form-controls";
import { streamAi } from "@/lib/ai-client";
import { sampleMeetingNotes } from "@/lib/workspace-data";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aileron" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get an executive summary, decisions, owners, deadlines and follow-ups — with gaps marked Not specified.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aileron" },
      {
        property: "og:description",
        content: "Structured meeting summaries and action items without invented details.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = notes.trim().length > 40;

  const generate = async () => {
    if (!canGenerate) {
      setError("Paste at least a few lines of meeting notes before summarising.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      await streamAi(
        {
          feature: "meeting",
          input: `Meeting title: ${title || "Not specified"}

Raw notes:
${notes}`,
        },
        setOutput,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Aileron only summarises what is in your notes. Missing owners and deadlines are reported as “Not specified” rather than guessed."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow">Meeting notes</span>
            <button
              onClick={() => setNotes(sampleMeetingNotes)}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Load example
            </button>
          </div>

          <Field label="Meeting title (optional)">
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Project Phoenix sync"
            />
          </Field>

          <Field
            label="Notes or transcript"
            hint={`${notes.trim().split(/\s+/).filter(Boolean).length} words pasted`}
          >
            <TextArea
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your raw notes, bullet points or transcript here…"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <PrimaryButton loading={loading} onClick={() => void generate()} disabled={!canGenerate}>
              Summarise notes
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                setNotes("");
                setTitle("");
                setOutput("");
                setError(null);
              }}
            >
              Clear
            </GhostButton>
          </div>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={() => void generate()}
          label="Structured summary"
          emptyTitle="No summary yet"
          emptyHint="Paste meeting notes on the left. You will get an executive summary, decisions, an action-item table and open follow-ups."
        />
      </div>
    </AppShell>
  );
}
