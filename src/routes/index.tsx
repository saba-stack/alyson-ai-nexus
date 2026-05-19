import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Globe2, FileText, MousePointerClick, Percent, DollarSign, Users, ShieldAlert, Sparkles,
  ArrowUpRight, Flame, Zap, TrendingUp, Eye, ChevronRight,
} from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { MetricCard } from "@/components/MetricCard";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const badgeTone: Record<string, "primary" | "destructive" | "success" | "brand"> = {
  Trending: "primary", Viral: "destructive", Breaking: "destructive", "High Revenue": "success",
};

type JsonRecord = Record<string, unknown>;
type SparklinePoint = { x: number; y: number };

type DashboardTrafficPoint = {
  day: string;
  clicks: number;
  revenue: number;
  articles: number;
};

type DashboardCity = {
  id: number | string;
  name: string;
  state: string;
  status: string;
  articles: number;
  clicks: number;
  ctr: number;
  revenue: number;
  subscribers: number;
  topCategory: string;
};

type DashboardArticle = {
  id: number | string;
  title: string;
  city: string;
  source: string;
  category: string;
  status: string;
  ctr: number;
  clicks: number;
  engagement: number;
  aiConfidence: number;
  badges?: string[];
};

type DashboardPipelineStage = {
  name: string;
  active: number;
  queued: number;
  success: number;
};

type DashboardSourcePlatform = {
  name: string;
  jobs: number;
  status: string;
};

type DashboardMetrics = {
  totalWebsites: number;
  articlesPublished: number;
  totalClicks: number;
  averageCtr: number;
  totalRevenue: number;
  subscribers: number;
  pendingReviews: number;
  aiArticlesToday: number;
  deltas: {
    totalWebsites: number;
    articlesPublished: number;
    totalClicks: number;
    averageCtr: number;
    totalRevenue: number;
    subscribers: number;
    pendingReviews: number;
    aiArticlesToday: number;
  };
};

type DashboardData = {
  metrics: DashboardMetrics;
  trafficSeries: DashboardTrafficPoint[];
  cities: DashboardCity[];
  articles: DashboardArticle[];
  pipelineStages: DashboardPipelineStage[];
  sourcePlatforms: DashboardSourcePlatform[];
};

const integerFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const compactCurrencyFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const defaultDashboardData: DashboardData = {
  metrics: {
    totalWebsites: 0,
    articlesPublished: 0,
    totalClicks: 0,
    averageCtr: 0,
    totalRevenue: 0,
    subscribers: 0,
    pendingReviews: 0,
    aiArticlesToday: 0,
    deltas: {
      totalWebsites: 0,
      articlesPublished: 0,
      totalClicks: 0,
      averageCtr: 0,
      totalRevenue: 0,
      subscribers: 0,
      pendingReviews: 0,
      aiArticlesToday: 0,
    },
  },
  trafficSeries: [],
  cities: [],
  articles: [],
  pipelineStages: [],
  sourcePlatforms: [],
};

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toText = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const pickArray = (source: JsonRecord, keys: string[]): unknown[] => {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }
  return [];
};

const pickNumber = (source: JsonRecord, keys: string[], fallback = 0): number => {
  for (const key of keys) {
    if (key in source) return toNumber(source[key], fallback);
  }
  return fallback;
};

const metricSparkline = (seed: number): SparklinePoint[] =>
  Array.from({ length: 14 }, (_, i) => ({
    x: i,
    y: 20 + Math.abs(Math.sin((i + seed) / 2)) * 80,
  }));

const normalizeTrafficPoint = (value: unknown, index: number): DashboardTrafficPoint => {
  const item = isRecord(value) ? value : {};
  return {
    day: toText(item.day, toText(item.date, `D${index + 1}`)),
    clicks: toNumber(item.clicks, 0),
    revenue: toNumber(item.revenue, 0),
    articles: toNumber(item.articles, 0),
  };
};

const normalizeCity = (value: unknown, index: number): DashboardCity => {
  const item = isRecord(value) ? value : {};
  return {
    id: item.id ?? index + 1,
    name: toText(item.name, ""),
    state: toText(item.state, ""),
    status: toText(item.status, "paused"),
    articles: toNumber(item.articles, 0),
    clicks: toNumber(item.clicks, 0),
    ctr: toNumber(item.ctr, 0),
    revenue: toNumber(item.revenue, 0),
    subscribers: toNumber(item.subscribers, 0),
    topCategory: toText(item.topCategory, toText(item.top_category, "N/A")),
  };
};

const normalizeArticle = (value: unknown, index: number): DashboardArticle => {
  const item = isRecord(value) ? value : {};
  const badges = Array.isArray(item.badges)
    ? item.badges.filter((badge): badge is string => typeof badge === "string")
    : undefined;

  const clicks = toNumber(item.clicks, 0);
  const confidenceValue = toNumber(item.aiConfidence, toNumber(item.ai_confidence, 0));
  return {
    id: item.id ?? index + 1,
    title: toText(item.title, ""),
    city: toText(item.city, ""),
    source: toText(item.source, ""),
    category: toText(item.category, ""),
    status: toText(item.status, ""),
    ctr: toNumber(item.ctr, 0),
    clicks,
    engagement: toNumber(item.engagement, clicks),
    aiConfidence: confidenceValue > 1 ? confidenceValue / 100 : confidenceValue,
    badges,
  };
};

const normalizePipelineStage = (value: unknown): DashboardPipelineStage => {
  const item = isRecord(value) ? value : {};
  return {
    name: toText(item.name, ""),
    active: toNumber(item.active, 0),
    queued: toNumber(item.queued, 0),
    success: toNumber(item.success, 0),
  };
};

const normalizeSourcePlatform = (value: unknown): DashboardSourcePlatform => {
  const item = isRecord(value) ? value : {};
  return {
    name: toText(item.name, ""),
    jobs: toNumber(item.jobs, 0),
    status: toText(item.status, "healthy"),
  };
};

const normalizeDashboardData = (payload: unknown): DashboardData => {
  const root = isRecord(payload) ? payload : {};
  const data = isRecord(root.data) ? root.data : root;
  const metrics = isRecord(data.metrics) ? data.metrics : {};
  const deltas = isRecord(metrics.deltas) ? metrics.deltas : {};

  const trafficSeries = pickArray(data, ["trafficSeries", "traffic", "networkTraffic"])
    .map((item, index) => normalizeTrafficPoint(item, index));
  const cities = pickArray(data, ["cities", "cityPerformance"])
    .map((item, index) => normalizeCity(item, index))
    .filter((city) => city.name.length > 0);
  const articles = pickArray(data, ["articles", "topArticles", "trendingArticles"])
    .map((item, index) => normalizeArticle(item, index))
    .filter((article) => article.title.length > 0);
  const pipelineStages = pickArray(data, ["pipelineStages", "pipeline"])
    .map(normalizePipelineStage)
    .filter((stage) => stage.name.length > 0);
  const sourcePlatforms = pickArray(data, ["sourcePlatforms", "sources"])
    .map(normalizeSourcePlatform)
    .filter((platform) => platform.name.length > 0);

  const derivedArticlesPublished = cities.reduce((sum, city) => sum + city.articles, 0) || articles.length;
  const derivedTotalClicks = trafficSeries.reduce((sum, point) => sum + point.clicks, 0) || articles.reduce((sum, article) => sum + article.clicks, 0);
  const derivedAverageCtr = cities.length > 0
    ? cities.reduce((sum, city) => sum + city.ctr, 0) / cities.length
    : 0;
  const derivedTotalRevenue = trafficSeries.reduce((sum, point) => sum + point.revenue, 0) || cities.reduce((sum, city) => sum + city.revenue, 0);
  const derivedSubscribers = cities.reduce((sum, city) => sum + city.subscribers, 0);
  const derivedPendingReviews = articles.filter((article) => article.status.toLowerCase().includes("pending")).length;

  return {
    metrics: {
      totalWebsites: pickNumber(metrics, ["totalWebsites", "total_websites"], 0),
      articlesPublished: pickNumber(metrics, ["articlesPublished", "articles_published"], derivedArticlesPublished),
      totalClicks: pickNumber(metrics, ["totalClicks", "total_clicks"], derivedTotalClicks),
      averageCtr: pickNumber(metrics, ["averageCtr", "average_ctr"], derivedAverageCtr),
      totalRevenue: pickNumber(metrics, ["totalRevenue", "total_revenue"], derivedTotalRevenue),
      subscribers: pickNumber(metrics, ["subscribers"], derivedSubscribers),
      pendingReviews: pickNumber(metrics, ["pendingReviews", "pending_reviews"], derivedPendingReviews),
      aiArticlesToday: pickNumber(metrics, ["aiArticlesToday", "ai_articles_today"], 0),
      deltas: {
        totalWebsites: pickNumber(deltas, ["totalWebsites", "total_websites"], 0),
        articlesPublished: pickNumber(deltas, ["articlesPublished", "articles_published"], 0),
        totalClicks: pickNumber(deltas, ["totalClicks", "total_clicks"], 0),
        averageCtr: pickNumber(deltas, ["averageCtr", "average_ctr"], 0),
        totalRevenue: pickNumber(deltas, ["totalRevenue", "total_revenue"], 0),
        subscribers: pickNumber(deltas, ["subscribers"], 0),
        pendingReviews: pickNumber(deltas, ["pendingReviews", "pending_reviews"], 0),
        aiArticlesToday: pickNumber(deltas, ["aiArticlesToday", "ai_articles_today"], 0),
      },
    },
    trafficSeries,
    cities,
    articles,
    pipelineStages,
    sourcePlatforms,
  };
};

const formatInteger = (value: number): string => integerFormatter.format(Math.max(0, Math.round(value)));
const formatCompact = (value: number): string => compactFormatter.format(Math.max(0, value));
const formatCurrencyCompact = (value: number): string => `$${compactCurrencyFormatter.format(Math.max(0, value))}`;

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        const response = await apiFetch<unknown>("/stats");
        if (mounted) setDashboardData(normalizeDashboardData(response));
      } catch {
        if (mounted) setDashboardData(defaultDashboardData);
      }
    };

    void loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const top = [...dashboardData.articles]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  return (
    <PageShell title="Alyson Intelligence Dashboard" subtitle="Realtime overview across 50 city networks">
      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Websites"
          value={formatInteger(dashboardData.metrics.totalWebsites)}
          delta={dashboardData.metrics.deltas.totalWebsites}
          data={metricSparkline(1)}
          icon={Globe2}
        />
        <MetricCard
          label="Articles Published"
          value={formatInteger(dashboardData.metrics.articlesPublished)}
          delta={dashboardData.metrics.deltas.articlesPublished}
          data={metricSparkline(2)}
          icon={FileText}
        />
        <MetricCard
          label="Total Clicks"
          value={formatCompact(dashboardData.metrics.totalClicks)}
          delta={dashboardData.metrics.deltas.totalClicks}
          data={metricSparkline(3)}
          icon={MousePointerClick}
        />
        <MetricCard
          label="Average CTR"
          value={`${dashboardData.metrics.averageCtr.toFixed(1)}%`}
          delta={dashboardData.metrics.deltas.averageCtr}
          data={metricSparkline(4)}
          icon={Percent}
        />
        <MetricCard
          label="Total Revenue"
          value={formatCurrencyCompact(dashboardData.metrics.totalRevenue)}
          delta={dashboardData.metrics.deltas.totalRevenue}
          data={metricSparkline(5)}
          icon={DollarSign}
        />
        <MetricCard
          label="Subscribers"
          value={formatInteger(dashboardData.metrics.subscribers)}
          delta={dashboardData.metrics.deltas.subscribers}
          data={metricSparkline(6)}
          icon={Users}
        />
        <MetricCard
          label="Pending Reviews"
          value={formatInteger(dashboardData.metrics.pendingReviews)}
          delta={dashboardData.metrics.deltas.pendingReviews}
          data={metricSparkline(7)}
          icon={ShieldAlert}
        />
        <MetricCard
          label="AI Articles Today"
          value={formatInteger(dashboardData.metrics.aiArticlesToday)}
          delta={dashboardData.metrics.deltas.aiArticlesToday}
          data={metricSparkline(8)}
          icon={Sparkles}
        />
      </div>

      {/* Traffic + AI Pipeline */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard
          className="xl:col-span-2"
          title="Network Traffic"
          description="Clicks and revenue across all city sites — last 30 days"
          action={
            <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5 text-xs">
              {["7d", "30d", "90d"].map((p, i) => (
                <button key={p} className={`px-2.5 py-1 rounded ${i === 1 ? "bg-muted font-semibold" : "text-muted-foreground"}`}>{p}</button>
              ))}
            </div>
          }
        >
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.trafficSeries}>
                <defs>
                  <linearGradient id="g-clicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="clicks" stroke="var(--color-primary)" strokeWidth={2} fill="url(#g-clicks)" />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#g-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="AI Pipeline" description="Live job throughput" action={<Badge tone="success">Healthy</Badge>}>
          <ul className="space-y-3">
            {dashboardData.pipelineStages.map((s, i) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">{i + 1}</div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground">{s.active} active · {s.queued} queued</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.success}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2">
            {dashboardData.sourcePlatforms.slice(0, 6).map((p) => (
              <div key={p.name} className="text-center">
                <div className="text-[11px] text-muted-foreground">{p.name}</div>
                <div className="text-sm font-semibold tabular-nums">{p.jobs}</div>
                <div className={`h-1 rounded-full mx-auto mt-1 w-8 ${p.status === "healthy" ? "bg-success" : "bg-warning"}`} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* City performance + Trending */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard
          className="xl:col-span-2"
          title="City Performance"
          description="Sorted by clicks · click a row for City Intelligence"
          action={<Link to="/cities" className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5">View all <ChevronRight className="h-3 w-3" /></Link>}
        >
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left font-medium py-2 px-5">City</th>
                  <th className="text-right font-medium py-2 px-3">Articles</th>
                  <th className="text-right font-medium py-2 px-3">Clicks</th>
                  <th className="text-right font-medium py-2 px-3">CTR</th>
                  <th className="text-right font-medium py-2 px-3">Revenue</th>
                  <th className="text-right font-medium py-2 px-3">Subs</th>
                  <th className="text-left font-medium py-2 px-3">Top Cat.</th>
                  <th className="text-left font-medium py-2 px-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.cities.slice(0, 8).map((c, index) => (
                  <tr key={`${c.id}-${index}`} className="border-b border-border last:border-0 hover:bg-muted/40 transition cursor-pointer">
                    <td className="py-2.5 px-5">
                      <Link to="/cities/$cityId" params={{ cityId: String(c.id || index + 1) }} className="font-medium hover:text-primary">
                        {c.name}<span className="text-muted-foreground font-normal ml-1">{c.state}</span>
                      </Link>
                    </td>
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

        <SectionCard title="Trending Content" description="Top performing across the network">
          <ul className="space-y-3">
            {top.map((a, index) => (
              <li key={`${a.id}-${index}`} className="group p-3 -mx-2 rounded-lg hover:bg-muted/40 transition">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {a.badges?.map((b) => (
                        <Badge key={b} tone={badgeTone[b]}>
                          {b === "Viral" && <Flame className="h-2.5 w-2.5" />}
                          {b === "Trending" && <TrendingUp className="h-2.5 w-2.5" />}
                          {b === "Breaking" && <Zap className="h-2.5 w-2.5" />}
                          {b}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug line-clamp-2">{a.title}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{a.city}</span>·<span>{a.source}</span>·<span>{a.category}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[11px]">
                      <span className="tabular-nums"><Eye className="inline h-3 w-3 mr-0.5" />{a.clicks.toLocaleString()}</span>
                      <span className="tabular-nums text-success">CTR {a.ctr}%</span>
                      <span className="tabular-nums text-muted-foreground">AI {(a.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition text-[11px] font-medium text-primary inline-flex items-center gap-0.5 self-start">
                    Promote <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Bottom row: source mix + category */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Source Mix" description="Articles ingested by platform (last 7 days)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.sourcePlatforms} barSize={28}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="jobs" radius={[6, 6, 0, 0]}>
                  {dashboardData.sourcePlatforms.map((_, i) => <Cell key={i} fill="var(--color-primary)" fillOpacity={0.4 + i * 0.1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Articles vs Revenue" description="Daily output vs monetization">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.trafficSeries.slice(-14)}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="articles" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
