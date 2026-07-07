"use client";

import { useQuery } from "@tanstack/react-query";
import { trainerService } from "@/features/trainers/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useTrainers(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.trainers.list(params),
    queryFn: () => trainerService.list(params),
    placeholderData: (previous) => previous,
  });
}
