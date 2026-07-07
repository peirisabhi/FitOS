"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/data-display";
import type { ReportTrendPoint } from "@/features/reports/types";

export function RevenueReportChart({ data }: { data: ReportTrendPoint[] }) {
  return (
    <ChartCard title="Revenue" description="Total revenue over the selected period">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="reportRevenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#reportRevenueGradient)" strokeWidth={2} />
      </AreaChart>
    </ChartCard>
  );
}

export function AttendanceReportChart({ data }: { data: ReportTrendPoint[] }) {
  return (
    <ChartCard title="Attendance" description="Total check-ins over the selected period">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), "Check-ins"]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

export function MembershipGrowthChart({ data }: { data: ReportTrendPoint[] }) {
  return (
    <ChartCard title="Membership Growth" description="Total active members over the selected period">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.708 0 0)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="oklch(0.708 0 0)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          formatter={(value: number) => [value.toLocaleString(), "Active members"]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Area type="monotone" dataKey="value" stroke="oklch(0.556 0 0)" fill="url(#growthGradient)" strokeWidth={2} />
      </AreaChart>
    </ChartCard>
  );
}
