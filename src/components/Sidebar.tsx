import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, FileText, Workflow, BarChart3, Trophy,
  Mail, ShieldCheck, Users, Plug, Settings, Sparkles,
} from "lucide-react";
import logoUrl from "@/assets/alyson-logo.svg";

const main = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cities", label: "Cities", icon: Building2 },
  { to: "/articles", label: "Articles", icon: FileText },
  { to: "/ai-pipeline", label: "AI Pipeline", icon: Workflow },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/rankings", label: "Rankings", icon: Trophy },
  { to: "/email", label: "Email Campaigns", icon: Mail },
  { to: "/moderation", label: "Moderation", icon: ShieldCheck },
  { to: "/subscribers", label: "Subscribers", icon: Users },
];

const secondary = [
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col bg-sidebar border-r border-border">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
        <img src={logoUrl} alt="Alyson" className="h-8 w-8" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">Alyson</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Local News AI</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Workspace</p>
          <ul className="space-y-0.5">
            {main.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-sidebar-active text-foreground font-semibold shadow-card"
                        : "text-sidebar-foreground hover:bg-sidebar-active/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">System</p>
          <ul className="space-y-0.5">
            {secondary.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-sidebar-active text-foreground font-semibold shadow-card"
                        : "text-sidebar-foreground hover:bg-sidebar-active/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mx-1 rounded-lg bg-card border border-border p-3 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">AI Credits</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/3 bg-primary rounded-full" />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">412k of 600k tokens used</p>
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center text-primary-foreground text-xs font-semibold">
            AD
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Admin</span>
            <span className="text-[11px] text-muted-foreground">admin@alyson.news</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
