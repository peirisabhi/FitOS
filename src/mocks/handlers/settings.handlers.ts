import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { MOCK_TENANTS } from "@/mocks/fixtures/tenants";
import { decodeMockToken } from "@/mocks/token";
import { findUserById } from "@/mocks/fixtures/users";
import type {
  OrganizationSettings,
  UpdateProfileDTO,
  NotificationPreferences,
} from "@/features/settings/types";

const baseUrl = siteConfig.api.baseUrl;

let organization: OrganizationSettings = {
  tenantName: MOCK_TENANTS[0]!.name,
  plan: MOCK_TENANTS[0]!.plan,
};

let notificationPreferences: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
};

export const settingsHandlers = [
  http.get(`${baseUrl}/settings/organization`, () => {
    return HttpResponse.json({ data: organization });
  }),

  http.patch(`${baseUrl}/settings/organization`, async ({ request }) => {
    const body = (await request.json()) as { tenantName?: string };
    if (body.tenantName) {
      organization = { ...organization, tenantName: body.tenantName };
    }
    return HttpResponse.json({ data: organization });
  }),

  http.patch(`${baseUrl}/settings/profile`, async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = decodeMockToken(token);
    if (!payload) {
      return HttpResponse.json({ message: "Unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 });
    }
    const record = findUserById(payload.sub);
    if (!record) {
      return HttpResponse.json({ message: "User not found.", code: "NOT_FOUND" }, { status: 404 });
    }
    const body = (await request.json()) as UpdateProfileDTO;
    return HttpResponse.json({ data: { id: record.id, name: body.name, email: record.email } });
  }),

  http.get(`${baseUrl}/settings/notification-preferences`, () => {
    return HttpResponse.json({ data: notificationPreferences });
  }),

  http.patch(`${baseUrl}/settings/notification-preferences`, async ({ request }) => {
    const body = (await request.json()) as NotificationPreferences;
    notificationPreferences = { ...notificationPreferences, ...body };
    return HttpResponse.json({ data: notificationPreferences });
  }),
];
