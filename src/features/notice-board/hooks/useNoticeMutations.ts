"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { noticeService } from "@/features/notice-board/services";
import { queryKeys } from "@/constants/query-keys";
import type { CreateNoticeDTO, UpdateNoticeDTO } from "@/features/notice-board/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateNoticeDTO) => noticeService.create(dto),
    onSuccess: () => {
      toast.success("Announcement posted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.noticeBoard.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't post announcement.")),
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNoticeDTO }) => noticeService.update(id, dto),
    onSuccess: () => {
      toast.success("Announcement updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.noticeBoard.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update announcement.")),
  });
}

export function useTogglePinNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) => noticeService.update(id, { pinned }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.noticeBoard.all() }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't update announcement.")),
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => noticeService.remove(id),
    onSuccess: () => {
      toast.success("Announcement removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.noticeBoard.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove announcement.")),
  });
}
