import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import {
  Field,
  TextArea,
  TextInput,
  Select,
  PrimaryButton,
  GhostButton,
} from "@/components/form-controls";
import { streamAi } from "@/lib/ai-client";
import { sampleTasks } from "@/lib/workspace-data";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — Aileron" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritised, realistic daily or weekly schedule with breaks, buffers and sub-steps.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — Aileron" },
      {
        property: "og:description",
        content: "Prioritise tasks and build an achievable schedule around your working hours.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Today");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = tasks.trim().length > 5;

  const generate = async () => {
    if (!canGenerate) {
      setError("Add at least one task before building a schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      await streamAi(
        {
          feature: "planner",
          input: `Planning horizon: ${horizon}
Working hours: ${start} to ${end}
Fixed commitments / constraints: ${notes || "Not specified"}

Tasks (one per line, with deadline / priority / estimate where given):
${tasks}`,
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
      title="AI Task Planner"
      description="Aileron sequences your work against real available hours, adds breaks and buffer, and flags anything that will not realistically fit."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="label-eyebrow">Tasks</span>
            <button
              onClick={() => setTasks(sampleTasks)}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Load example
            </button>
          </div>

          <Field
            label="Task list"
            hint="Format: task — deadline — priority — estimated duration. Anything you omit is treated as unspecified."
          >
            <TextArea
              rows={9}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Review vendor contract — today 17:30 — high — 45 min"}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Plan for">
              <Select value={horizon} onChange={(e) => setHorizon(e.target.value)}>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This week</option>
              </Select>
            </Field>
            <Field label="Start">
              <TextInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="End">
              <TextInput type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>

          <Field label="Fixed commitments (optional)">
            <TextArea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Standup 09:15–09:30, client call 14:00–15:00"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <PrimaryButton loading={loading} onClick={() => void generate()} disabled={!canGenerate}>
              Build schedule
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                setTasks("");
                setNotes("");
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
          label="Prioritised schedule"
          emptyTitle="No schedule yet"
          emptyHint="Add your tasks and working hours, then build a schedule. Each block stays editable before you copy it into your calendar."
        />
      </div>
    </AppShell>
  );
}
