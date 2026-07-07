"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/data-display";
import type { PeakHourPoint } from "@/features/dashboard/types";

export function PeakHoursChart({ data }: { data: PeakHourPoint[] }) {
  return (
    <ChartCard title="Peak Hours" description="Check-ins by time of day, today">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          formatter={(value: number) => [value, "Visits"]}
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Bar dataKey="visits" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}
