import Cookies from "js-cookie";
import { authRepository } from "@/features/auth/repository";
import { siteConfig } from "@/config/site.config";
import type {
  LoginPayload,
  LoginResult,
  SessionResult,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/features/auth/types";

/**
 * Orchestration layer between hooks and the repository: owns side effects
 * (writing/clearing the session cookie) that don't belong in a pure data
 * hook or in the repository itself.
 */
export const authService = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    const result = await authRepository.login(payload);
    setSessionCookie(result.token, result.expiresAt);
    return result;
  },

  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } finally {
      clearSessionCookie();
    }
  },

  async getSession(): Promise<SessionResult> {
    return authRepository.getSession();
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    return authRepository.forgotPassword(payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return authRepository.resetPassword(payload);
  },
};

function setSessionCookie(token: string, expiresAt: number): void {
  Cookies.set(siteConfig.session.cookieName, token, {
    expires: new Date(expiresAt),
    sameSite: "lax",
  });
}

function clearSessionCookie(): void {
  Cookies.remove(siteConfig.session.cookieName);
}
