"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services";
import { queryKeys } from "@/constants/query-keys";

export function useMemberDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.member(),
    queryFn: () => dashboardService.getMemberSummary(),
  });
}
