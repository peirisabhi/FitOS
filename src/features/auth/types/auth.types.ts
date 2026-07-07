import type { AuthUser } from "@/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
  /** epoch ms */
  expiresAt: number;
}

export interface SessionResult {
  user: AuthUser;
  expiresAt: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/**
 * Contract the auth repository implements. Services and hooks depend on
 * this, never on the concrete class — see architecture doc §7.
 */
export interface IAuthRepository {
  login(payload: LoginPayload): Promise<LoginResult>;
  logout(): Promise<void>;
  getSession(): Promise<SessionResult>;
  forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }>;
  resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }>;
}
