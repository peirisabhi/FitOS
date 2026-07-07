import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { decodeMockToken } from "@/mocks/token";
import { buildOwnerDashboard, buildTrainerDashboard, buildMemberDashboard } from "@/mocks/fixtures/dashboard";

const baseUrl = siteConfig.api.baseUrl;

function requireAuth(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return decodeMockToken(token);
}

export const dashboardHandlers = [
  http.get(`${baseUrl}/dashboard/owner`, ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json({ message: "Unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 });
    }
    return HttpResponse.json({ data: buildOwnerDashboard() });
  }),

  http.get(`${baseUrl}/dashboard/trainer`, ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json({ message: "Unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 });
    }
    return HttpResponse.json({ data: buildTrainerDashboard() });
  }),

  http.get(`${baseUrl}/dashboard/member`, ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json({ message: "Unauthenticated", code: "UNAUTHENTICATED" }, { status: 401 });
    }
    return HttpResponse.json({ data: buildMemberDashboard() });
  }),
];
