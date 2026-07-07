import type { Role } from "@/types/role.types";

/**
 * Authenticated user/session shape. `roles` is plural — a user may hold
 * multiple roles, and effective permissions are the UNION of each role's
 * permission set (see lib/permissions.ts -> resolvePermissions).
 */
export interface AuthUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: Role[];
}

export interface Session {
  user: AuthUser;
  /** epoch ms */
  expiresAt: number;
  token: string;
}
