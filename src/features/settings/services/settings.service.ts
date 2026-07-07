import { settingsRepository } from "@/features/settings/repository";

export const settingsService = {
  getOrganization: settingsRepository.getOrganization,
  updateOrganization: settingsRepository.updateOrganization,
  updateProfile: settingsRepository.updateProfile,
  getNotificationPreferences: settingsRepository.getNotificationPreferences,
  updateNotificationPreferences: settingsRepository.updateNotificationPreferences,
};
