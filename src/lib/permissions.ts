import type { Role } from "@/types/role.types";
import type { Permission } from "@/types/permission.types";
import { ROLE_PERMISSIONS } from "@/config/permissions.config";

/**
 * Union of every permission granted by any of the given roles. This is the
 * ONLY function that should ever compute an effective permission set — both
 * the middleware guard and the client-side `usePermission` hook call it, so
 * permission logic can never diverge between the two tiers.
 */
export function resolvePermissions(roles: Role[]): Set<Permission> {
  const set = new Set<Permission>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      set.add(permission);
    }
  }
  return set;
}

export function hasPermission(
  granted: Set<Permission> | Permission[],
  required: Permission | Permission[],
): boolean {
  const grantedSet = granted instanceof Set ? granted : new Set(granted);
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.some((p) => grantedSet.has(p));
}
