import type { Tenant } from "@/types/tenant.types";

export interface OrganizationSettings {
  tenantName: string;
  plan: Tenant["plan"];
}

export interface UpdateOrganizationDTO {
  tenantName: string;
}

export interface UpdateProfileDTO {
  name: string;
}

export interface ProfileSettingsResult {
  id: string;
  name: string;
  email: string;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export interface ISettingsRepository {
  getOrganization(): Promise<OrganizationSettings>;
  updateOrganization(dto: UpdateOrganizationDTO): Promise<OrganizationSettings>;
  updateProfile(dto: UpdateProfileDTO): Promise<ProfileSettingsResult>;
  getNotificationPreferences(): Promise<NotificationPreferences>;
  updateNotificationPreferences(dto: NotificationPreferences): Promise<NotificationPreferences>;
}
