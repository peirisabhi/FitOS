"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/features/notifications/services";
import { queryKeys } from "@/constants/query-keys";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() }),
    onError: (error) => toast.error(errorMessage(error, "Couldn't update notification.")),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update notifications.")),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.remove(id),
    onSuccess: () => {
      toast.success("Notification removed.");
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't remove notification.")),
  });
}
