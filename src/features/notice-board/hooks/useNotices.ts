"use client";

import { useQuery } from "@tanstack/react-query";
import { noticeService } from "@/features/notice-board/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function useNotices(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.noticeBoard.list(params),
    queryFn: () => noticeService.list(params),
    placeholderData: (previous) => previous,
  });
}
