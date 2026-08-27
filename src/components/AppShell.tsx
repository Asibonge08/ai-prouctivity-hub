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
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { DISCLAIMER } from "@/lib/workspace-data";
import { useTheme } from "@/hooks/use-theme";
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

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", compact && "justify-center")}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-4" strokeWidth={2} />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight">Aileron Studio</span>
      )}
    </div>
  );
}

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        compact && "justify-center px-2",
      )}
    >
      {dark ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
      {!compact && <span>{dark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}

function NavLinks({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            title={label}
            className={cn(
              "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
              compact && "justify-center px-0",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
            {!compact && <span className="truncate">{label}</span>}
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
      {/* Persistent left task bar: icon rail on tablets, full rail on desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[68px] flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 md:flex lg:w-64 lg:px-4">
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <div className="hidden lg:block">
          <Brand />
        </div>
        <div className="mt-7 flex-1 overflow-y-auto">
          <p className="label-eyebrow mb-2 hidden px-3 lg:block">Workspace</p>
          <div className="lg:hidden">
            <NavLinks compact />
          </div>
          <div className="hidden lg:block">
            <NavLinks />
          </div>
        </div>
        <div className="mt-4 space-y-3 border-t border-sidebar-border pt-4">
          <div className="lg:hidden">
            <ThemeToggle compact />
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <p className="hidden text-[11px] leading-relaxed text-muted-foreground lg:block">
            {DISCLAIMER}
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <button
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-border p-2 text-foreground transition-colors hover:bg-secondary"
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar px-4 py-5 shadow-panel">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-7 flex-1 overflow-y-auto">
              <p className="label-eyebrow mb-2 px-3">Workspace</p>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="mt-6 space-y-3 border-t border-sidebar-border pt-4">
              <ThemeToggle />
              <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
            </div>
          </div>
        </div>
      )}

      <div className="md:pl-[68px] lg:pl-64">
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mb-6 space-y-1.5 lg:mb-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-[30px]">
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
