"use client";

import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/components/data-display/DashboardCard";

export interface ChartCardProps {
  title: string;
  description?: string;
  height?: number;
  /** A single Recharts chart element (LineChart, BarChart, etc.) — ResponsiveContainer requires exactly one child. */
  children: ReactElement;
}

/** Recharts wrapper standardizing height + ResponsiveContainer so charts never hand-roll sizing. */
export function ChartCard({ title, description, height = 280, children }: ChartCardProps) {
  return (
    <DashboardCard title={title} description={description}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
