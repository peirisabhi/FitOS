"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services";
import { queryKeys } from "@/constants/query-keys";

export function useTrainerDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.trainer(),
    queryFn: () => dashboardService.getTrainerSummary(),
  });
}
