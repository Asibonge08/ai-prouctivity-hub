import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Field, TextInput, Select, SegmentedControl, PrimaryButton } from "@/components/form-controls";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Workspace Settings — Aileron" },
      {
        name: "description",
        content:
          "Set your name, role, default tone and output length so every Aileron assistant matches how your team writes.",
      },
      { property: "og:title", content: "Workspace Settings — Aileron" },
      {
        property: "og:description",
        content: "Personalise Aileron's defaults: identity, tone, output length and AI review preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const STORAGE_KEY = "aileron:preferences";

type Prefs = {
  name: string;
  role: string;
  team: string;
  tone: string;
  length: "Concise" | "Balanced" | "Detailed";
};

const defaults: Prefs = {
  name: "",
  role: "",
  team: "",
  tone: "Professional",
  length: "Balanced",
};

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...defaults, ...JSON.parse(raw) });
    } catch {
      /* ignore malformed preferences */
    }
  }, []);

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
  };

  return (
    <AppShell
      title="Settings"
      description="Defaults applied across the email, meeting, planner and research assistants."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-5 p-5">
          <p className="label-eyebrow">Your profile</p>
          <Field label="Full name" hint="Used to sign drafted emails.">
            <TextInput
              value={prefs.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Asibonge Blose"
            />
          </Field>
          <Field label="Role">
            <TextInput
              value={prefs.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="Operations Lead"
            />
          </Field>
          <Field label="Team or company">
            <TextInput
              value={prefs.team}
              onChange={(e) => update("team", e.target.value)}
              placeholder="Northbound Consulting"
            />
          </Field>
        </section>

        <section className="panel space-y-5 p-5">
          <p className="label-eyebrow">Output defaults</p>
          <Field label="Default tone">
            <Select value={prefs.tone} onChange={(e) => update("tone", e.target.value)}>
              {["Professional", "Friendly", "Direct", "Persuasive", "Apologetic"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Default length" hint="Applies to generated drafts and summaries.">
            <SegmentedControl
              options={["Concise", "Balanced", "Detailed"] as const}
              value={prefs.length}
              onChange={(v) => update("length", v)}
            />
          </Field>
          <div className="flex items-center gap-3">
            <PrimaryButton onClick={save}>Save preferences</PrimaryButton>
            {saved && <span className="text-xs text-muted-foreground">Saved to this browser.</span>}
          </div>
        </section>

        <section className="panel space-y-2 p-5 lg:col-span-2">
          <p className="label-eyebrow">Responsible AI</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Aileron never invents facts, figures, quotes or sources. Every output is a draft that needs a
            human review before it is sent, scheduled or shared. Preferences are stored locally in this
            browser and are not used to train any model.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
