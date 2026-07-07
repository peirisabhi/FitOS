"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService } from "@/features/payments/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreatePaymentDTO } from "@/features/payments/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePaymentDTO) => paymentService.create(dto),
    onSuccess: () => {
      toast.success("Payment recorded.");
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't record payment.")),
  });
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      paymentService.update(id, { status: "paid", paidOn: new Date().toISOString() }),
    onSuccess: () => {
      toast.success("Marked as paid.");
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update payment.")),
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentService.remove(id),
    onSuccess: () => {
      toast.success("Payment removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove payment.")),
  });
}
