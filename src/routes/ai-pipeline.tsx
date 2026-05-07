import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, Activity, Zap } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { pipelineStages, sourcePlatforms } from "@/lib/mock-data";

export const Route = createFileRoute("/ai-pipeline")({
  component: PipelinePage,
});

function PipelinePage() {
  return (
    <PageShell title="AI Pipeline" subtitle="Live workflow visualization">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 mb-6">
        {pipelineStages.map((s, i) => (
          <div key={s.name} className="bg-card border border-border rounded-xl p-4 shadow-card relative">
            <div className="text-[11px] text-muted-foreground">Stage {i + 1}</div>
            <div className="mt-1 text-sm font-semibold">{s.name}</div>
            <div className="mt-3 text-2xl font-semibold tabular-nums">{s.active}</div>
            <div className="text-[11px] text-muted-foreground">active jobs</div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Queue {s.queued}</span>
              <Badge tone={s.success > 98 ? "success" : "warning"}>{s.success}%</Badge>
            </div>
            {i < pipelineStages.length - 1 && (
              <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-border">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Source Platforms" description="Ingestion health">
          <ul className="divide-y divide-border -my-2">
            {sourcePlatforms.map((p) => (
              <li key={p.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {p.status === "healthy" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.jobs} jobs · last sync 2m ago</div>
                  </div>
                </div>
                <Badge tone={p.status === "healthy" ? "success" : "warning"}>{p.status}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent Events" description="Pipeline activity stream">
          <ul className="space-y-3 text-sm">
            {[
              { i: Zap, t: "Published 14 articles to NYC", a: "12s ago" },
              { i: Activity, t: "AI Summarization queue cleared", a: "1m ago" },
              { i: AlertCircle, t: "TikTok API rate limit warning", a: "4m ago", warn: true },
              { i: CheckCircle2, t: "Moderation: 8 approvals", a: "6m ago" },
              { i: Zap, t: "Pushed daily newsletters to GMass", a: "12m ago" },
            ].map((e, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <e.i className={`h-4 w-4 mt-0.5 ${e.warn ? "text-warning" : "text-primary"}`} />
                <div className="flex-1">
                  <div>{e.t}</div>
                  <div className="text-[11px] text-muted-foreground">{e.a}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}
