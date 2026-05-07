import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { cities } from "@/lib/mock-data";

export const Route = createFileRoute("/cities/")({
  component: CitiesPage,
});

function CitiesPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"clicks" | "revenue" | "subscribers">("clicks");
  const filtered = cities
    .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b[sort] - a[sort]);

  return (
    <PageShell title="Cities" subtitle={`${cities.length} active city networks`}>
      <SectionCard>
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cities..."
              className="h-9 w-full pl-8 pr-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)}
              className="h-9 px-3 text-sm rounded-md border border-border bg-card">
              <option value="clicks">Sort: Clicks</option>
              <option value="revenue">Sort: Revenue</option>
              <option value="subscribers">Sort: Subscribers</option>
            </select>
            <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 font-medium hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" /> Add city
            </button>
          </div>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2 px-5">City</th>
                <th className="text-left font-medium py-2 px-3">Subdomain</th>
                <th className="text-right font-medium py-2 px-3">Articles</th>
                <th className="text-right font-medium py-2 px-3">Clicks</th>
                <th className="text-right font-medium py-2 px-3">CTR</th>
                <th className="text-right font-medium py-2 px-3">Revenue</th>
                <th className="text-right font-medium py-2 px-3">Subscribers</th>
                <th className="text-left font-medium py-2 px-3">Top Category</th>
                <th className="text-left font-medium py-2 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition">
                  <td className="py-2.5 px-5">
                    <Link to="/cities/$cityId" params={{ cityId: String(c.id) }} className="font-medium hover:text-primary">
                      {c.name} <span className="text-muted-foreground font-normal">{c.state}</span>
                    </Link>
                  </td>
                  <td className="px-3 text-muted-foreground tabular-nums">{c.subdomain}</td>
                  <td className="text-right tabular-nums px-3">{c.articles}</td>
                  <td className="text-right tabular-nums px-3">{c.clicks.toLocaleString()}</td>
                  <td className="text-right tabular-nums px-3">{c.ctr}%</td>
                  <td className="text-right tabular-nums px-3">${(c.revenue / 1000).toFixed(1)}k</td>
                  <td className="text-right tabular-nums px-3">{c.subscribers.toLocaleString()}</td>
                  <td className="px-3 text-muted-foreground">{c.topCategory}</td>
                  <td className="px-5"><Badge tone={c.status === "active" ? "success" : "neutral"}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageShell>
  );
}
