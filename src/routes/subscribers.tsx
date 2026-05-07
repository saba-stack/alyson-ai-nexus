import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Filter, Tag } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { cities, subscribersGrowth } from "@/lib/mock-data";

export const Route = createFileRoute("/subscribers")({
  component: SubscribersPage,
});

function SubscribersPage() {
  return (
    <PageShell title="Subscribers" subtitle="Audience CRM & segmentation">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <SectionCard className="xl:col-span-2" title="Subscriber Growth" action={
          <button className="h-8 px-3 text-xs rounded-md border border-border bg-card inline-flex items-center gap-1.5 hover:bg-muted"><Download className="h-3 w-3" />Export CSV</button>
        }>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={subscribersGrowth}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="subscribers" stroke="var(--color-primary)" fill="url(#sg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Quick Filters">
          <div className="space-y-2 text-sm">
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition">
              <span className="flex items-center gap-2"><Filter className="h-3.5 w-3.5 text-primary" />Active subscribers</span>
              <span className="tabular-nums text-muted-foreground">81,400</span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition">
              <span className="flex items-center gap-2"><Tag className="h-3.5 w-3.5 text-primary" />VIP segment</span>
              <span className="tabular-nums text-muted-foreground">2,140</span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-card hover:bg-muted/50 transition">
              <span className="flex items-center gap-2"><Filter className="h-3.5 w-3.5 text-warning" />Unsubscribed</span>
              <span className="tabular-nums text-muted-foreground">1,260</span>
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="By City">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 px-5 text-left font-medium">City</th>
                <th className="py-2 px-3 text-right font-medium">Subscribers</th>
                <th className="py-2 px-3 text-right font-medium">Growth</th>
                <th className="py-2 px-3 text-right font-medium">Unsubscribe %</th>
                <th className="py-2 px-5 text-left font-medium">Tag</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition">
                  <td className="py-2.5 px-5 font-medium">{c.name}</td>
                  <td className="px-3 text-right tabular-nums">{c.subscribers.toLocaleString()}</td>
                  <td className="px-3 text-right tabular-nums text-success">+{(Math.random() * 8 + 2).toFixed(1)}%</td>
                  <td className="px-3 text-right tabular-nums text-muted-foreground">{(Math.random() * 2 + 0.5).toFixed(1)}%</td>
                  <td className="px-5"><Badge tone="primary">{c.topCategory}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageShell>
  );
}
