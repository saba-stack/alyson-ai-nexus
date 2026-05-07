import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { integrations } from "@/lib/mock-data";

export const Route = createFileRoute("/integrations")({
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <PageShell title="Integrations" subtitle="API connections & data sources">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((i) => {
          const ok = i.status === "connected";
          return (
            <SectionCard key={i.name}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-sm font-bold">
                      {i.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{i.name}</div>
                      <div className="text-[11px] text-muted-foreground">{i.category}</div>
                    </div>
                  </div>
                </div>
                <Badge tone={ok ? "success" : "warning"}>
                  {ok ? <CheckCircle2 className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5" />}
                  {i.status}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{i.description}</p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last sync · {i.lastSync}</span>
                <div className="h-5 w-9 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-card" />
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </PageShell>
  );
}
