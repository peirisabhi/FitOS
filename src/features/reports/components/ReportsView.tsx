"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, DollarSign, TrendingUp, UserPlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard, DataTable } from "@/components/data-display";
import { StaggerFade } from "@/components/motion";
import { QueryBoundary } from "@/components/feedback";
import { RequirePermission } from "@/shared/components";
import { exportToCsv } from "@/lib/csv";
import { useReportsSummary } from "@/features/reports/hooks";
import {
  RevenueReportChart,
  AttendanceReportChart,
  MembershipGrowthChart,
} from "@/features/reports/components/ReportCharts";
import {
  REPORT_PERIODS,
  type ReportPeriod,
  type TrainerPerformanceRow,
} from "@/features/reports/types";

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  "3m": "Last 3 months",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
};

const trainerColumns: ColumnDef<TrainerPerformanceRow>[] = [
  { accessorKey: "trainerName", header: "Trainer" },
  { accessorKey: "sessionsCompleted", header: "Sessions" },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-current text-amber-500" /> {row.original.rating}
      </span>
    ),
  },
  {
    accessorKey: "retentionRate",
    header: "Retention",
    cell: ({ row }) => <Badge variant="secondary">{row.original.retentionRate}%</Badge>,
  },
];

export function ReportsView() {
  const [period, setPeriod] = useState<ReportPeriod>("12m");
  const { data, isLoading, isError, refetch } = useReportsSummary(period);

  const csvRows = useMemo(() => {
    if (!data) return [];
    return data.revenueTrend.map((point, i) => ({
      month: point.label,
      revenue: point.value,
      attendance: data.attendanceTrend[i]?.value ?? 0,
      activeMembers: data.membershipGrowth[i]?.value ?? 0,
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPORT_PERIODS.map((p) => (
              <SelectItem key={p} value={p}>
                {PERIOD_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <RequirePermission permission="reports:export">
          <Button
            variant="outline"
            disabled={csvRows.length === 0}
            onClick={() => exportToCsv(`gymos-report-${period}`, csvRows)}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </RequirePermission>
      </div>

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        data={data}
        onRetry={() => refetch()}
        errorTitle="Couldn't load reports"
        loadingFallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted/40 h-28 animate-pulse rounded-xl border" />
            ))}
          </div>
        }
      >
        {(summary) => (
          <div className="space-y-6">
            <StaggerFade className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Total Revenue"
                value={`$${summary.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
              />
              <MetricCard
                label="Total Attendance"
                value={summary.totalAttendance.toLocaleString()}
                icon={TrendingUp}
              />
              <MetricCard
                label="Net New Members"
                value={summary.newMembers.toLocaleString()}
                icon={UserPlus}
              />
              <MetricCard
                label="Avg. Trainer Rating"
                value={summary.averageTrainerRating.toFixed(1)}
                icon={Star}
              />
            </StaggerFade>

            <div className="grid gap-4 lg:grid-cols-2">
              <RevenueReportChart data={summary.revenueTrend} />
              <AttendanceReportChart data={summary.attendanceTrend} />
            </div>

            <MembershipGrowthChart data={summary.membershipGrowth} />

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Trainer Performance</h2>
              <DataTable columns={trainerColumns} data={summary.trainerPerformance} />
            </div>
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}
