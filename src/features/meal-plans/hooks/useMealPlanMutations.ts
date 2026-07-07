"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mealPlanService } from "@/features/meal-plans/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateMealPlanDTO, UpdateMealPlanDTO } from "@/features/meal-plans/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMealPlanDTO) => mealPlanService.create(dto),
    onSuccess: () => {
      toast.success("Meal plan created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't create meal plan.")),
  });
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMealPlanDTO }) => mealPlanService.update(id, dto),
    onSuccess: () => {
      toast.success("Meal plan updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update meal plan.")),
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mealPlanService.remove(id),
    onSuccess: () => {
      toast.success("Meal plan removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.mealPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove meal plan.")),
  });
}
