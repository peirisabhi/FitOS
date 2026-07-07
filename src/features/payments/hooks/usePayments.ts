"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/features/payments/services";
import { queryKeys } from "@/constants/query-keys";
import type { ListQueryParams } from "@/repositories/base.repository";

export function usePayments(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => paymentService.list(params),
    placeholderData: (previous) => previous,
  });
}
