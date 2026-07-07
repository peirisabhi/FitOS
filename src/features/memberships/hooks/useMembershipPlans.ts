"use client";

import { useQuery } from "@tanstack/react-query";
import { membershipPlanService } from "@/features/memberships/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useMembershipPlans(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.memberships.list(params),
    queryFn: () => membershipPlanService.list(params),
    placeholderData: (previous) => previous,
  });
}
