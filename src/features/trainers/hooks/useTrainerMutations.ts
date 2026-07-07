"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trainerService } from "@/features/trainers/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateTrainerDTO, UpdateTrainerDTO } from "@/features/trainers/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTrainerDTO) => trainerService.create(dto),
    onSuccess: () => {
      toast.success("Trainer added.");
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't add trainer.")),
  });
}

export function useUpdateTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTrainerDTO }) => trainerService.update(id, dto),
    onSuccess: () => {
      toast.success("Trainer updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update trainer.")),
  });
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trainerService.remove(id),
    onSuccess: () => {
      toast.success("Trainer removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove trainer.")),
  });
}
