import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import {
  Field,
  TextArea,
  TextInput,
  SegmentedControl,
  PrimaryButton,
  GhostButton,
} from "@/components/form-controls";
import { streamAi } from "@/lib/ai-client";
import { sampleEmail } from "@/lib/workspace-data";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aileron" },
      {
        name: "description",
        content:
          "Turn a few key points into a polished, professional email with a suggested subject line and adjustable tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Aileron" },
      {
        property: "og:description",
        content: "AI email drafting with formal, friendly and persuasive tones.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof TONES)[number];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = purpose.trim().length > 2 && keyPoints.trim().length > 2;

  const generate = async (nextTone: Tone = tone) => {
    if (!canGenerate) {
      setError("Add the purpose of the email and at least one key point before generating.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      await streamAi(
        {
          feature: "email",
          input: `Recipient / context: ${recipient || "Not specified"}
Purpose: ${purpose}
Key points the email must cover:
${keyPoints}
Preferred subject line: ${subject || "Not specified — suggest one"}
Requested tone: ${nextTone}`,
        },
        setOutput,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setRecipient(sampleEmail.recipient);
    setPurpose(sampleEmail.purpose);
    setKeyPoints(sampleEmail.keyPoints);
    setSubject(sampleEmail.subject);
  };

  const reset = () => {
    setRecipient("");
    setPurpose("");
    setKeyPoints("");
    setSubject("");
    setOutput("");
    setError(null);
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe what you need to say. Aileron structures it professionally without inventing facts, dates or commitments you did not provide."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow">Input</span>
            <button
              onClick={loadSample}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Load example
            </button>
          </div>

          <Field label="Recipient / context">
            <TextInput
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Design team leads (Priya, Marcus)"
            />
          </Field>

          <Field label="Purpose of the email">
            <TextInput
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Follow up on Q3 sprint feedback"
            />
          </Field>

          <Field label="Key points" hint="One point per line. Only these facts will be used.">
            <TextArea
              rows={6}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"- Thanks for the feedback\n- Confirm data table scope by Friday"}
            />
          </Field>

          <Field label="Subject (optional)">
            <TextInput
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Leave blank to have one suggested"
            />
          </Field>

          <Field label="Tone">
            <SegmentedControl
              options={TONES}
              value={tone}
              onChange={(t) => {
                setTone(t);
                if (output) void generate(t);
              }}
            />
          </Field>

          <div className="flex flex-wrap gap-2 pt-1">
            <PrimaryButton loading={loading} onClick={() => void generate()} disabled={!canGenerate}>
              Generate email
            </PrimaryButton>
            <GhostButton onClick={reset}>Clear</GhostButton>
          </div>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={() => void generate()}
          label="Draft email"
          emptyTitle="No draft yet"
          emptyHint="Fill in the purpose and key points, then generate. You can edit the result before copying it."
        />
      </div>
    </AppShell>
  );
}
