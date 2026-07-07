import type { Role } from "@/types/role.types";
import { PERMISSIONS, type Permission } from "@/types/permission.types";

export { PERMISSIONS };
export type { Permission };

/**
 * Role -> permission matrix. The ONLY place that decides what a role can do.
 * `resolvePermissions()` (lib/permissions.ts) unions this across a user's roles.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [...PERMISSIONS], // everything, including org:manage
  owner: [
    "dashboard:view",
    "members:read", "members:write", "members:delete",
    "trainers:read", "trainers:write", "trainers:delete",
    "attendance:read", "attendance:write",
    "payments:read", "payments:write",
    "memberships:read", "memberships:write",
    "meal-plans:read", "meal-plans:write",
    "workout-plans:read", "workout-plans:write",
    "sessions:read", "sessions:write",
    "reports:read", "reports:export",
    "notifications:read", "notifications:write",
    "notice-board:read", "notice-board:write",
    "settings:read", "settings:write",
    "org:manage",
  ],
  manager: [
    "dashboard:view",
    "members:read", "members:write",
    "trainers:read", "trainers:write",
    "attendance:read", "attendance:write",
    "payments:read", "payments:write",
    "memberships:read", "memberships:write",
    "meal-plans:read",
    "workout-plans:read",
    "sessions:read", "sessions:write",
    "reports:read", "reports:export",
    "notifications:read", "notifications:write",
    "notice-board:read", "notice-board:write",
    "settings:read",
  ],
  trainer: [
    "dashboard:view",
    "members:read",
    "attendance:read", "attendance:write",
    "meal-plans:read", "meal-plans:write",
    "workout-plans:read", "workout-plans:write",
    "sessions:read", "sessions:write",
    "notifications:read",
    "notice-board:read",
  ],
  receptionist: [
    "dashboard:view",
    "members:read", "members:write",
    "attendance:read", "attendance:write",
    "payments:read", "payments:write",
    "memberships:read",
    "sessions:read",
    "notifications:read",
    "notice-board:read",
  ],
  member: [
    "dashboard:view",
    "meal-plans:read",
    "workout-plans:read",
    "attendance:read",
    "payments:read",
    "memberships:read",
    "sessions:read",
    "notifications:read",
    "notice-board:read",
  ],
};
