import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trophy, Sparkles } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/rankings")({
  component: RankingsPage,
});

const ranked = [...articles]
  .map((a) => ({ ...a, score: Math.round(a.engagement * 0.5 + a.ctr * 1.5 + a.aiConfidence * 20) }))
  .sort((a, b) => b.score - a.score);

function RankingsPage() {
  return (
    <PageShell title="Ranking Engine" subtitle="Homepage optimization & A/B testing">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard className="xl:col-span-2" title="Homepage Ranking" description="Score = CTR × engagement × freshness × revenue">
          <ul className="divide-y divide-border -my-2">
            {ranked.slice(0, 8).map((a, i) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{a.city} · CTR {a.ctr}% · Engagement {a.engagement}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{a.score}</div>
                  <div className="text-[10px] text-muted-foreground">score</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Ranking Weights" action={<Badge tone="primary">Auto-rank ON</Badge>}>
            <div className="space-y-4">
              {[
                { l: "CTR weight", v: 40 },
                { l: "Engagement weight", v: 30 },
                { l: "Freshness weight", v: 20 },
                { l: "Revenue weight", v: 35 },
              ].map((w) => (
                <div key={w.l}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{w.l}</span>
                    <span className="tabular-nums text-muted-foreground">{w.v}%</span>
                  </div>
                  <input type="range" defaultValue={w.v} className="w-full accent-primary" />
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span>A/B headline testing</span>
                <div className="h-5 w-9 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-card" />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Why this ranked high" action={<Sparkles className="h-3.5 w-3.5 text-primary" />}>
            <p className="text-xs text-muted-foreground">"{ranked[0].title}" leads because:</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center justify-between"><span>High CTR</span><Badge tone="success">+38%</Badge></li>
              <li className="flex items-center justify-between"><span>Engagement spike</span><Badge tone="success">+22%</Badge></li>
              <li className="flex items-center justify-between"><span>Freshness</span><Badge tone="primary">2h ago</Badge></li>
              <li className="flex items-center justify-between"><span>Revenue impact</span><Badge tone="success">$5.8k</Badge></li>
            </ul>
          </SectionCard>
        </div>
      </div>

      <div className="mt-4">
        <SectionCard title="Score Distribution">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={ranked}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
