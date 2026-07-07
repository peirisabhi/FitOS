"use client";

import { useQuery } from "@tanstack/react-query";
import { workoutPlanService } from "@/features/workout-plans/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useWorkoutPlans(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.workoutPlans.list(params),
    queryFn: () => workoutPlanService.list(params),
    placeholderData: (previous) => previous,
  });
}
