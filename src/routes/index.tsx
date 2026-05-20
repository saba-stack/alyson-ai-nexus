import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react"; // Added for Live Data
import { apiFetch } from "@/lib/api"; // Added to talk to Railway
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Globe2,
  FileText,
  MousePointerClick,
  Percent,
  DollarSign,
  Users,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  Flame,
  Zap,
  TrendingUp,
  Eye,
  ChevronRight,
} from "lucide-react";
import { PageShell, SectionCard, Badge } from "@/components/PageShell";
import { MetricCard } from "@/components/MetricCard";
import { sparkline } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const badgeTone: Record<string, "primary" | "destructive" | "success" | "brand"> = {
  Trending: "primary",
  Viral: "destructive",
  Breaking: "destructive",
  "High Revenue": "success",
};

function Dashboard() {
  // 1. Setup state for real data
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from your Railway Backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await apiFetch("/stats"); // Calls https://reasonable-acceptance-production.up.railway.app/stats
        setData(stats);
      } catch (err) {
        console.error("Failed to fetch live stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Fallback values so the screen doesn't go black if the API fails
  const stats = data || {
    websites: "0",
    articles: "0",
    clicks: "0",
    ctr: "0%",
    revenue: "$0",
    subscribers: "0",
    pending: "0",
    aiToday: "0",
    cities: [],
    trending: [],
  };

  return (
    <PageShell title="Alyson Intelligence Dashboard" subtitle="Realtime Data from Railway Backend">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Websites" value={stats.websites} delta={0} data={sparkline(1)} icon={Globe2} />
        <MetricCard label="Articles Published" value={stats.articles} delta={0} data={sparkline(2)} icon={FileText} />
        <MetricCard label="Total Clicks" value={stats.clicks} delta={0} data={sparkline(3)} icon={MousePointerClick} />
        <MetricCard label="Average CTR" value={stats.ctr} delta={0} data={sparkline(4)} icon={Percent} />
        <MetricCard label="Total Revenue" value={stats.revenue} delta={0} data={sparkline(5)} icon={DollarSign} />
        <MetricCard label="Subscribers" value={stats.subscribers} delta={0} data={sparkline(6)} icon={Users} />
        <MetricCard label="Pending Reviews" value={stats.pending} delta={0} data={sparkline(7)} icon={ShieldAlert} />
        <MetricCard label="AI Articles Today" value={stats.aiToday} delta={0} data={sparkline(8)} icon={Sparkles} />
      </div>

      {/* City Performance Table using Live Data */}
      <div className="mt-6">
        <SectionCard title="City Performance (Live)" description="Real-time data from your database">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground border-b border-border">
                  <th className="text-left py-2 px-5">City</th>
                  <th className="text-right py-2 px-3">Clicks</th>
                  <th className="text-right py-2 px-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.cities?.map((c: any) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/40">
                    <td className="py-2.5 px-5 font-medium">{c.name}</td>
                    <td className="text-right px-3">{c.clicks?.toLocaleString()}</td>
                    <td className="text-right px-3">${c.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="text-center py-4 text-xs">Connecting to Railway...</p>}
            {!loading && stats.cities?.length === 0 && (
              <p className="text-center py-4 text-xs text-destructive">No data found at /stats endpoint yet.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
