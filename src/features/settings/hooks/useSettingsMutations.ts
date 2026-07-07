"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/features/settings/services";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/store/auth.store";
import type { UpdateOrganizationDTO, UpdateProfileDTO, NotificationPreferences } from "@/features/settings/types";
import { ApiError } from "@/types/api.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateOrganizationDTO) => settingsService.updateOrganization(dto),
    onSuccess: () => {
      toast.success("Organization settings updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.organization() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update organization settings.")),
  });
}

export function useUpdateProfile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (dto: UpdateProfileDTO) => settingsService.updateProfile(dto),
    onSuccess: (result) => {
      toast.success("Profile updated.");
      if (user) setUser({ ...user, name: result.name });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't update profile.")),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: NotificationPreferences) => settingsService.updateNotificationPreferences(dto),
    onSuccess: () => {
      toast.success("Notification preferences saved.");
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.notificationPreferences() });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't save preferences.")),
  });
}
