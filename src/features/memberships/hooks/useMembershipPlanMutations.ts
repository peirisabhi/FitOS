"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { membershipPlanService } from "@/features/memberships/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateMembershipPlanDTO, UpdateMembershipPlanDTO } from "@/features/memberships/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMembershipPlanDTO) => membershipPlanService.create(dto),
    onSuccess: () => {
      toast.success("Plan created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't create plan.")),
  });
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMembershipPlanDTO }) => membershipPlanService.update(id, dto),
    onSuccess: () => {
      toast.success("Plan updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update plan.")),
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membershipPlanService.remove(id),
    onSuccess: () => {
      toast.success("Plan removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove plan.")),
  });
}
