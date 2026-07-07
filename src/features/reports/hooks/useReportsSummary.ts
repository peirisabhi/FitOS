"use client";

import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/features/reports/services";
import { queryKeys } from "@/constants/query-keys";
import type { ReportPeriod } from "@/features/reports/types";

export function useReportsSummary(period: ReportPeriod) {
  return useQuery({
    queryKey: queryKeys.reports.summary(period),
    queryFn: () => reportsService.getSummary(period),
  });
}
