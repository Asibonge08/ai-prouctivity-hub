import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, Compass, MessageSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { todaysTasks, deadlines, recentActivity, insights } from "@/lib/workspace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aileron — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan your day and research topics from one AI workplace productivity dashboard.",
      },
      { property: "og:title", content: "Aileron — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI email drafting, meeting summaries, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    label: "Email Generator",
    detail: "Draft professional outreach",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Meeting Summarizer",
    detail: "Turn notes into action items",
    icon: FileText,
  },
  {
    to: "/planner",
    label: "Task Planner",
    detail: "Build a realistic schedule",
    icon: CalendarClock,
  },
  {
    to: "/research",
    label: "Research Assistant",
    detail: "Brief yourself on any topic",
    icon: Compass,
  },
  {
    to: "/chat",
    label: "AI Chat",
    detail: "Ask your workplace assistant",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  const open = todaysTasks.filter((t) => !t.done);
  return (
    <AppShell
      title="Good morning, Julian"
      description={`You have ${open.length} open tasks today and ${deadlines.length} deadlines in view.`}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Open tasks", value: String(open.length) },
            { label: "Due today", value: "2" },
            { label: "AI drafts", value: "3" },
            { label: "Focus window", value: "09:00" },
          ].map((s) => (
            <div key={s.label} className="panel p-4">
              <span className="label-eyebrow">{s.label}</span>
              <div className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</div>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="label-eyebrow">Quick tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map(({ to, label, detail, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="panel flex items-center justify-between p-4 transition-shadow hover:shadow-panel"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="size-4 text-foreground" strokeWidth={1.75} />
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{detail}</span>
                  </span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <h2 className="label-eyebrow">Today&apos;s tasks</h2>
            <div className="panel divide-y divide-border">
              {todaysTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 p-4">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${t.done ? "bg-muted-foreground/40" : t.priority === "High" ? "bg-destructive" : "bg-primary"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${t.done ? "text-muted-foreground line-through" : ""}`}
                    >
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.project} · {t.due} · {t.estimate}
                    </p>
                  </div>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="label-eyebrow">Upcoming deadlines</h2>
            <div className="space-y-3">
              {deadlines.map((d) => (
                <div
                  key={d.id}
                  className={`flex items-start gap-4 rounded-lg border-l-2 bg-surface-sunken p-3 ${d.urgent ? "border-destructive" : "border-border"}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.when}</p>
                  </div>
                  {d.urgent && (
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-destructive">
                      Urgent
                    </span>
                  )}
                </div>
              ))}
            </div>

            <h2 className="label-eyebrow pt-3">Recent activity</h2>
            <div className="panel divide-y divide-border">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{a.tool}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{a.when}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-3">
          <h2 className="label-eyebrow">AI productivity insights</h2>
          <ul className="panel divide-y divide-border">
            {insights.map((i) => (
              <li key={i} className="p-4 text-sm text-pretty">
                {i}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground">
            Insights are generated from the sample workspace data above and are suggestions, not
            verified findings.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
