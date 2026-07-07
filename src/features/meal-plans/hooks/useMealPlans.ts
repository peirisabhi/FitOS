"use client";

import { useQuery } from "@tanstack/react-query";
import { mealPlanService } from "@/features/meal-plans/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useMealPlans(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.mealPlans.list(params),
    queryFn: () => mealPlanService.list(params),
    placeholderData: (previous) => previous,
  });
}
