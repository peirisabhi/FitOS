"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/features/notifications/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useNotifications(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationService.list(params),
    placeholderData: (previous) => previous,
  });
}
