import { createFileRoute } from "@tanstack/react-router";
import { Send, Mail, Sparkles, LayoutTemplate } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { campaigns } from "@/lib/mock-data";

export const Route = createFileRoute("/email")({
  component: EmailPage,
});

function EmailPage() {
  return (
    <PageShell title="Email Campaigns" subtitle="Newsletter management & subscriber growth">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Active subscribers", v: "84,000", d: "+6.4%" },
          { l: "Avg open rate", v: "41%", d: "+2.1%" },
          { l: "Avg click rate", v: "16%", d: "+0.8%" },
          { l: "Campaign revenue", v: "$5.7k", d: "+12%" },
        ].map((m) => (
          <div key={m.l} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{m.l}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{m.v}</div>
            <div className="text-[11px] text-success mt-0.5">{m.d}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard className="xl:col-span-2" title="Campaigns" action={<button className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 font-medium hover:bg-primary/90"><Send className="h-3 w-3" />Send now</button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 px-5 text-left font-medium">Campaign</th>
                  <th className="py-2 px-3 text-left font-medium">City</th>
                  <th className="py-2 px-3 text-left font-medium">Type</th>
                  <th className="py-2 px-3 text-right font-medium">Sent</th>
                  <th className="py-2 px-3 text-right font-medium">Open</th>
                  <th className="py-2 px-3 text-right font-medium">Click</th>
                  <th className="py-2 px-5 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition">
                    <td className="py-2.5 px-5 font-medium">{c.title}</td>
                    <td className="px-3 text-muted-foreground">{c.city}</td>
                    <td className="px-3"><Badge tone="primary">{c.type}</Badge></td>
                    <td className="px-3 text-right tabular-nums">{c.sent.toLocaleString()}</td>
                    <td className="px-3 text-right tabular-nums">{c.open}%</td>
                    <td className="px-3 text-right tabular-nums">{c.click}%</td>
                    <td className="px-5 text-right tabular-nums">${c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Email Builder" description="AI-assisted">
            <div className="space-y-2">
              {[
                { i: Sparkles, l: "Generate with AI" },
                { i: LayoutTemplate, l: "Drag & drop blocks" },
                { i: Mail, l: "HTML editor" },
              ].map((b) => (
                <button key={b.l} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted/50 transition text-left">
                  <b.i className="h-3.5 w-3.5 text-primary" />
                  <span>{b.l}</span>
                </button>
              ))}
              <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center">
                <Mail className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="mt-2 text-xs text-muted-foreground">Live preview</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Integrations">
            <ul className="space-y-2">
              {["Salesforce", "GMass"].map((p) => (
                <li key={p} className="flex items-center justify-between text-sm">
                  <span>{p}</span>
                  <Badge tone="success">Connected</Badge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
