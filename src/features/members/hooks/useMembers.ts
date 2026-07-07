"use client";

import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/features/members/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useMembers(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.members.list(params),
    queryFn: () => memberService.list(params),
    placeholderData: (previous) => previous,
  });
}
