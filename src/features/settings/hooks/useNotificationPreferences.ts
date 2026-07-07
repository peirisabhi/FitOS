"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/features/settings/services";
import { queryKeys } from "@/constants/query-keys";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.settings.notificationPreferences(),
    queryFn: () => settingsService.getNotificationPreferences(),
  });
}
