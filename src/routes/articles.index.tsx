import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/articles/")({
  component: ArticlesPage,
});

const statusTone = {
  Draft: "neutral",
  "Pending Review": "warning",
  Published: "success",
  Rejected: "destructive",
} as const;

function ArticlesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const filtered = articles.filter((a) => {
    if (status !== "all" && a.status !== status) return false;
    if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <PageShell title="Articles" subtitle="AI newsroom CMS">
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "Draft", "Pending Review", "Published", "Rejected"].map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`h-8 px-3 text-xs rounded-md border transition ${status === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles..."
                className="h-9 w-64 pl-8 pr-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40" />
            </div>
            <Link to="/articles/$articleId" params={{ articleId: "new" }}
              className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 font-medium hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" /> New article
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pl-5 pr-3 text-left font-medium w-8"><input type="checkbox" className="rounded" /></th>
                <th className="py-2 px-3 text-left font-medium">Title</th>
                <th className="py-2 px-3 text-left font-medium">Category</th>
                <th className="py-2 px-3 text-left font-medium">Source</th>
                <th className="py-2 px-3 text-left font-medium">Status</th>
                <th className="py-2 px-3 text-right font-medium">AI</th>
                <th className="py-2 px-3 text-right font-medium">CTR</th>
                <th className="py-2 px-3 text-right font-medium">Revenue</th>
                <th className="py-2 px-3 text-left font-medium">Published</th>
                <th className="py-2 pr-5 pl-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition">
                  <td className="pl-5 pr-3 py-2.5"><input type="checkbox" className="rounded" /></td>
                  <td className="py-2.5 px-3 max-w-md">
                    <Link to="/articles/$articleId" params={{ articleId: String(a.id) }} className="font-medium line-clamp-1 hover:text-primary">{a.title}</Link>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.city}</div>
                  </td>
                  <td className="px-3 text-muted-foreground">{a.category}</td>
                  <td className="px-3"><Badge>{a.source}</Badge></td>
                  <td className="px-3"><Badge tone={statusTone[a.status]}>{a.status}</Badge></td>
                  <td className="px-3 text-right tabular-nums">{(a.aiConfidence * 100).toFixed(0)}%</td>
                  <td className="px-3 text-right tabular-nums">{a.ctr}%</td>
                  <td className="px-3 text-right tabular-nums">${a.revenue.toLocaleString()}</td>
                  <td className="px-3 text-muted-foreground tabular-nums">{a.publishedAt}</td>
                  <td className="pr-5 pl-3"><button className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageShell>
  );
}
