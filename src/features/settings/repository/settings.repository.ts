import { httpClient } from "@/lib/http-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  ISettingsRepository,
  OrganizationSettings,
  UpdateOrganizationDTO,
  UpdateProfileDTO,
  ProfileSettingsResult,
  NotificationPreferences,
} from "@/features/settings/types";

export const settingsRepository: ISettingsRepository = {
  async getOrganization(): Promise<OrganizationSettings> {
    const res = await httpClient.get<ApiResponse<OrganizationSettings>>("/settings/organization");
    return res.data;
  },
  async updateOrganization(dto: UpdateOrganizationDTO): Promise<OrganizationSettings> {
    const res = await httpClient.patch<ApiResponse<OrganizationSettings>>("/settings/organization", dto);
    return res.data;
  },
  async updateProfile(dto: UpdateProfileDTO): Promise<ProfileSettingsResult> {
    const res = await httpClient.patch<ApiResponse<ProfileSettingsResult>>("/settings/profile", dto);
    return res.data;
  },
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const res = await httpClient.get<ApiResponse<NotificationPreferences>>("/settings/notification-preferences");
    return res.data;
  },
  async updateNotificationPreferences(dto: NotificationPreferences): Promise<NotificationPreferences> {
    const res = await httpClient.patch<ApiResponse<NotificationPreferences>>("/settings/notification-preferences", dto);
    return res.data;
  },
};
