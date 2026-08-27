import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Field, TextArea, Select, PrimaryButton, GhostButton } from "@/components/form-controls";
import { streamAi } from "@/lib/ai-client";
import { sampleResearchQuestions } from "@/lib/workspace-data";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aileron" },
      {
        name: "description",
        content:
          "Get a balanced briefing on any workplace topic: summary, insights, pros and cons, recommendations and stated limitations.",
      },
      { property: "og:title", content: "AI Research Assistant — Aileron" },
      {
        property: "og:description",
        content: "Business research briefings with explicit confidence and limitations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [depth, setDepth] = useState("Balanced briefing");
  const [audience, setAudience] = useState("Team leads");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = question.trim().length > 8;

  const generate = async (q: string = question) => {
    if (q.trim().length <= 8) {
      setError("Enter a research question with a little more detail.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      await streamAi(
        {
          feature: "research",
          input: `Research question: ${q}
Depth: ${depth}
Audience: ${audience}`,
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
      title="AI Research Assistant"
      description="Briefings state their own limits. Aileron will not fabricate statistics, studies or sources — verify anything you plan to act on."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-4 sm:p-5">
          <span className="label-eyebrow">Research question</span>

          <Field label="What do you want to understand?">
            <TextArea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What should we consider before moving to a four-day work week?"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Depth">
              <Select value={depth} onChange={(e) => setDepth(e.target.value)}>
                <option>Quick overview</option>
                <option>Balanced briefing</option>
                <option>Deep analysis</option>
              </Select>
            </Field>
            <Field label="Audience">
              <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option>Team leads</option>
                <option>Executive stakeholders</option>
                <option>Just me</option>
              </Select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <PrimaryButton loading={loading} onClick={() => void generate()} disabled={!canGenerate}>
              Research topic
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                setQuestion("");
                setOutput("");
                setError(null);
              }}
            >
              Clear
            </GhostButton>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <p className="label-eyebrow">Example questions</p>
            {sampleResearchQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setQuestion(q)}
                className="block w-full rounded-md bg-surface-sunken px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={() => void generate()}
          label="Briefing"
          emptyTitle="No briefing yet"
          emptyHint="Ask a question, or pick one of the examples. The briefing is fully editable so you can trim it before sharing."
        />
      </div>
    </AppShell>
  );
}
