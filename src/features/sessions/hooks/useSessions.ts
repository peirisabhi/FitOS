"use client";

import { useQuery } from "@tanstack/react-query";
import { sessionService } from "@/features/sessions/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useSessions(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.sessions.list(params),
    queryFn: () => sessionService.list(params),
    placeholderData: (previous) => previous,
  });
}
