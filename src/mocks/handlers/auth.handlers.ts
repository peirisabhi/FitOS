import { http, HttpResponse } from "msw";
import { siteConfig } from "@/config/site.config";
import { findUserByEmail, findUserById } from "@/mocks/fixtures/users";
import { issueMockToken, decodeMockToken } from "@/mocks/token";
import type { AuthUser } from "@/types/user.types";
import type { MockUserRecord } from "@/mocks/fixtures/users";

const baseUrl = siteConfig.api.baseUrl;

function toAuthUser(record: MockUserRecord): AuthUser {
  return {
    id: record.id,
    tenantId: record.tenantId,
    name: record.name,
    email: record.email,
    roles: record.roles,
  };
}

export const authHandlers = [
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string; rememberMe?: boolean };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    const record = findUserByEmail(email);

    if (!record || record.password !== password) {
      return HttpResponse.json(
        { message: "Invalid email or password.", code: "INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }

    const user = toAuthUser(record);
    const ttl = body.rememberMe ? siteConfig.session.rememberMeTtlMs : siteConfig.session.ttlMs;
    const { token, expiresAt } = issueMockToken(user, ttl);

    return HttpResponse.json({ data: { user, token, expiresAt } });
  }),

  http.post(`${baseUrl}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${baseUrl}/auth/session`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const payload = decodeMockToken(token);

    if (!payload) {
      return HttpResponse.json(
        { message: "Session expired or invalid.", code: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    const record = findUserById(payload.sub);
    if (!record) {
      return HttpResponse.json({ message: "User not found.", code: "UNAUTHENTICATED" }, { status: 401 });
    }

    return HttpResponse.json({ data: { user: toAuthUser(record), expiresAt: payload.exp } });
  }),

  http.post(`${baseUrl}/auth/forgot-password`, async () => {
    // Always return 200 regardless of whether the email exists — never leak enumeration info.
    return HttpResponse.json({ data: { message: "If that email exists, a reset link has been sent." } });
  }),

  http.post(`${baseUrl}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as { token?: string; password?: string };
    if (!body.token || !body.password || body.password.length < 8) {
      return HttpResponse.json(
        { message: "Reset link is invalid or password too short.", code: "INVALID_RESET" },
        { status: 400 },
      );
    }
    return HttpResponse.json({ data: { message: "Password has been reset." } });
  }),
];
