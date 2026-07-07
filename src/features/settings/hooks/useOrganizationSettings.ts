"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/features/settings/services";
import { queryKeys } from "@/constants/query-keys";

export function useOrganizationSettings() {
  return useQuery({
    queryKey: queryKeys.settings.organization(),
    queryFn: () => settingsService.getOrganization(),
  });
}
