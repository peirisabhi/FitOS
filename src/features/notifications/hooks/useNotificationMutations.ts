"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/features/notifications/services";
import { queryKeys } from "@/constants/query-keys";
import { useOptimisticMutation } from "@/shared/hooks";
import type { PaginatedResult } from "@/repositories/base.repository";
import type { Notification } from "@/features/notifications/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

/**
 * Params must match what `NotificationsList` passes to `useNotifications()`
 * — the optimistic write targets that exact cache entry. Milestone 5
 * performance pass: this is the one mutation in the app demonstrating the
 * `useOptimisticMutation` pattern built (but unused) back in Milestone 1 —
 * marking a notification read should feel instant, not wait on a round trip.
 */
const NOTIFICATIONS_LIST_PARAMS = { pageSize: 100 };

export function useMarkNotificationRead() {
  return useOptimisticMutation<PaginatedResult<Notification>, string>({
    mutationFn: (id) => notificationService.update(id, { read: true }),
    queryKey: queryKeys.notifications.list(NOTIFICATIONS_LIST_PARAMS),
    updater: (previous, id) => {
      if (!previous) return previous;
      return {
        ...previous,
        items: previous.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
      };
    },
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
