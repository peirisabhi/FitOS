import type { AuthUser } from "@/types/user.types";
import type { Role } from "@/types/role.types";

interface MockTokenPayload {
  sub: string;
  tenantId: string;
  /** Roles embedded as a claim, exactly as a real JWT would carry them — this
   *  is what lets middleware (Edge runtime) do a coarse permission check
   *  without a DB/mock-fixture lookup. */
  roles: Role[];
  exp: number;
}

/**
 * A deliberately simple, non-cryptographic mock token — base64 JSON, not a
 * real signed JWT. It exists only so the mock API layer has something
 * bearer-token-shaped to pass around; it is discarded entirely once a real
 * NestJS backend issues real signed JWTs (which would carry the same
 * sub/tenantId/roles/exp claims).
 */
export function issueMockToken(user: AuthUser, ttlMs: number): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + ttlMs;
  const payload: MockTokenPayload = { sub: user.id, tenantId: user.tenantId, roles: user.roles, exp: expiresAt };
  const token = `mock.${btoa(JSON.stringify(payload))}`;
  return { token, expiresAt };
}

export function decodeMockToken(token: string | undefined): MockTokenPayload | null {
  if (!token || !token.startsWith("mock.")) return null;
  try {
    const payload = JSON.parse(atob(token.slice("mock.".length))) as MockTokenPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export type { MockTokenPayload };
