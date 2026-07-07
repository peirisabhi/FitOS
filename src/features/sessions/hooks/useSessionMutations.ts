"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sessionService } from "@/features/sessions/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateSessionDTO, UpdateSessionDTO } from "@/features/sessions/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSessionDTO) => sessionService.create(dto),
    onSuccess: () => {
      toast.success("Session scheduled.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't schedule session.")),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSessionDTO }) => sessionService.update(id, dto),
    onSuccess: () => {
      toast.success("Session updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update session.")),
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionService.update(id, { status: "cancelled" }),
    onSuccess: () => {
      toast.success("Session cancelled.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't cancel session.")),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionService.remove(id),
    onSuccess: () => {
      toast.success("Session removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove session.")),
  });
}
