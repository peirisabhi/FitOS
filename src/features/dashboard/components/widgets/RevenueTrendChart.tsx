"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/data-display";
import type { TrendPoint } from "@/features/dashboard/types";

export function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartCard title="Revenue Trend" description="Last 6 months">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#revenueGradient)" strokeWidth={2} />
      </AreaChart>
    </ChartCard>
  );
}
