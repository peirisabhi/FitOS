import { httpClient } from "@/lib/http-client";
import type {
  IAuthRepository,
  LoginPayload,
  LoginResult,
  SessionResult,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/features/auth/types";
import type { ApiResponse } from "@/types/api.types";

/**
 * Talks to `/auth/*` over HTTP only. Identical whether MSW (mock) or a
 * real NestJS instance answers — see architecture doc §7 and
 * `lib/http-client.ts`.
 */
export const authRepository: IAuthRepository = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    const res = await httpClient.post<ApiResponse<LoginResult>>("/auth/login", payload, {
      unauthenticated: true,
    });
    return res.data;
  },

  async logout(): Promise<void> {
    await httpClient.post<void>("/auth/logout");
  },

  async getSession(): Promise<SessionResult> {
    const res = await httpClient.get<ApiResponse<SessionResult>>("/auth/session");
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const res = await httpClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", payload, {
      unauthenticated: true,
    });
    return res.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const res = await httpClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", payload, {
      unauthenticated: true,
    });
    return res.data;
  },
};
