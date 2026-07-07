"use client";

import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { ChartCard } from "@/components/data-display";
import type { MembershipDistributionSlice } from "@/features/dashboard/types";

const COLORS = [
  "var(--color-primary)",
  "oklch(0.708 0 0)",
  "oklch(0.556 0 0)",
  "oklch(0.87 0 0)",
];

export function MembershipDistributionChart({ data }: { data: MembershipDistributionSlice[] }) {
  return (
    <ChartCard title="Membership Distribution" description="Active members by plan type">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
        />
        <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ChartCard>
  );
}
