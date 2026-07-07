"use client";

import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/features/attendance/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useAttendance(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.attendance.list(params),
    queryFn: () => attendanceService.list(params),
    placeholderData: (previous) => previous,
  });
}
