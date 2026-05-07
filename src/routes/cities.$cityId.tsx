import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronLeft } from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { articles, cities, trafficSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/cities/$cityId")({
  component: CityDetail,
});

const tabs = ["Overview", "Articles", "Analytics", "Email Campaigns", "SEO", "Settings"];

function CityDetail() {
  const { cityId } = Route.useParams();
  const city = cities.find((c) => c.id === Number(cityId));
  if (!city) throw notFound();

  const cityArticles = articles.filter((a) => a.city === city.name);

  return (
    <PageShell title={`${city.name} Intelligence`} subtitle={`${city.subdomain} · ${city.population.toLocaleString()} population`}>
      <Link to="/cities" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-3 w-3" /> All cities
      </Link>

      <div className="border-b border-border mb-6 -mt-2">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t, i) => (
            <button key={t} className={`px-3 py-2 text-sm border-b-2 -mb-px transition ${i === 0 ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Articles", v: city.articles },
          { l: "Clicks", v: city.clicks.toLocaleString() },
          { l: "CTR", v: `${city.ctr}%` },
          { l: "Revenue", v: `$${(city.revenue / 1000).toFixed(1)}k` },
        ].map((m) => (
          <div key={m.l} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{m.l}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums">{m.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard className="xl:col-span-2" title="Traffic" description="Last 30 days">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trafficSeries}>
                <defs>
                  <linearGradient id="ct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="clicks" stroke="var(--color-primary)" strokeWidth={2} fill="url(#ct)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top Categories">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={[
                { name: "Local News", v: 92 }, { name: "Real Estate", v: 78 },
                { name: "Sports", v: 64 }, { name: "Business", v: 51 }, { name: "Trending", v: 39 },
              ]}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={84} />
                <Bar dataKey="v" fill="var(--color-primary)" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Top Performing Articles">
          <ul className="divide-y divide-border -my-2">
            {cityArticles.slice(0, 5).map((a) => (
              <li key={a.id} className="py-3">
                <p className="text-sm font-medium line-clamp-1">{a.title}</p>
                <div className="mt-1 text-[11px] text-muted-foreground flex gap-3 tabular-nums">
                  <span>{a.category}</span>·<span>{a.clicks.toLocaleString()} clicks</span>·<span>CTR {a.ctr}%</span>
                </div>
              </li>
            ))}
            {cityArticles.length === 0 && <li className="py-6 text-sm text-muted-foreground text-center">No articles yet for this city.</li>}
          </ul>
        </SectionCard>

        <SectionCard title="Engagement Heatmap" description="Hour × day of week">
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 7 * 12 }, (_, i) => {
              const v = (Math.sin(i / 3) + Math.cos(i / 5) + 2) / 4;
              return <div key={i} className="aspect-square rounded-sm" style={{ background: `oklch(0.623 0.188 259.815 / ${0.08 + v * 0.7})` }} />;
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">{[0.1, 0.25, 0.45, 0.65, 0.85].map((o) => <div key={o} className="h-2 w-3 rounded-sm" style={{ background: `oklch(0.623 0.188 259.815 / ${o})` }} />)}</div>
            <span>More</span>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
