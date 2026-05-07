import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Edit3, AlertTriangle } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/moderation")({
  component: ModerationPage,
});

function ModerationPage() {
  const pending = articles.filter((a) => a.status === "Pending Review" || a.status === "Draft");

  return (
    <PageShell title="Moderation" subtitle="Human-in-the-loop approval queue">
      <SectionCard className="mb-4" action={
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Human Approval Mode</span>
          <div className="h-5 w-9 rounded-full bg-primary relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-card" />
          </div>
        </div>
      }>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Pending review", v: pending.length, t: "warning" as const },
            { l: "Approved today", v: 42, t: "success" as const },
            { l: "Rejected today", v: 6, t: "destructive" as const },
            { l: "Avg AI confidence", v: "84%", t: "primary" as const },
          ].map((m) => (
            <div key={m.l}>
              <div className="text-xs text-muted-foreground">{m.l}</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{m.v}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Review Queue">
        <ul className="divide-y divide-border -my-2">
          {pending.map((a) => (
            <li key={a.id} className="py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="warning">Pending</Badge>
                  <Badge>{a.source}</Badge>
                  <span className="text-[11px] text-muted-foreground">{a.city} · {a.category}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium">{a.title}</p>
                <div className="mt-2 flex items-center gap-4 text-[11px]">
                  <span className="text-muted-foreground">AI confidence</span>
                  <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${a.aiConfidence * 100}%` }} />
                  </div>
                  <span className="tabular-nums font-medium">{(a.aiConfidence * 100).toFixed(0)}%</span>
                  {a.aiConfidence < 0.75 && <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-3 w-3" />Low confidence</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="h-8 w-8 rounded-md bg-success/10 text-success hover:bg-success/20 flex items-center justify-center"><Check className="h-4 w-4" /></button>
                <button className="h-8 w-8 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center"><X className="h-4 w-4" /></button>
                <button className="h-8 w-8 rounded-md border border-border bg-card hover:bg-muted flex items-center justify-center"><Edit3 className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </PageShell>
  );
}
