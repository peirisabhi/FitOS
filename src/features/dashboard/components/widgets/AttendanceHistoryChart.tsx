"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/data-display";
import type { AttendanceHistoryPoint } from "@/features/dashboard/types";

export function AttendanceHistoryChart({ data }: { data: AttendanceHistoryPoint[] }) {
  return (
    <ChartCard title="Attendance History" description="Check-ins this week" height={220}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
        <Tooltip
          formatter={(value: number) => [value, "Visits"]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Bar dataKey="visits" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}
