"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workoutPlanService } from "@/features/workout-plans/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateWorkoutPlanDTO, UpdateWorkoutPlanDTO } from "@/features/workout-plans/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateWorkoutPlanDTO) => workoutPlanService.create(dto),
    onSuccess: () => {
      toast.success("Workout plan created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't create workout plan.")),
  });
}

export function useUpdateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateWorkoutPlanDTO }) => workoutPlanService.update(id, dto),
    onSuccess: () => {
      toast.success("Workout plan updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update workout plan.")),
  });
}

export function useDeleteWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutPlanService.remove(id),
    onSuccess: () => {
      toast.success("Workout plan removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutPlans.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove workout plan.")),
  });
}
