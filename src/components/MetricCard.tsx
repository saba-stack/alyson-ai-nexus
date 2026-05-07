import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta: number;
  data: { x: number; y: number }[];
  icon?: LucideIcon;
};

export function MetricCard({ label, value, delta, data, icon: Icon }: Props) {
  const positive = delta >= 0;
  return (
    <div className="group bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
          <div className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
            <span className="text-muted-foreground font-normal ml-1">vs last week</span>
          </div>
        </div>
        <div className="h-10 w-24 -mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`mc-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="y" stroke="var(--color-primary)" strokeWidth={1.5} fill={`url(#mc-${label})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
