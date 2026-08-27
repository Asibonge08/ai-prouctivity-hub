import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Compass,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { DISCLAIMER } from "@/lib/workspace-data";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Compass },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-md bg-primary">
        <div className="size-2.5 rounded-full bg-primary-foreground" />
      </div>
      <span className="text-base font-semibold tracking-tight">Aileron</span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <p className="label-eyebrow mb-3 px-3">Workspace</p>
          <NavLinks />
        </div>
        <p className="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md lg:hidden">
        <Brand />
        <button
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded-md p-2 text-foreground transition-colors hover:bg-secondary"
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar px-4 py-5 shadow-panel">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <p className="label-eyebrow mb-3 px-3">Workspace</p>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <p className="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mb-6 space-y-1 lg:mb-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-[28px]">
              {title}
            </h1>
            {description && (
              <p className="max-w-[64ch] text-pretty text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
          {children}
          <footer className="mt-12 border-t border-border pt-5">
            <p className="max-w-[70ch] text-[11px] leading-relaxed text-muted-foreground">
              {DISCLAIMER} Avoid submitting confidential or personally identifying information to AI
              tools without checking your organisation&apos;s policy first.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
