import { isStaffRole } from "@/config/roles.config";
import type { Role } from "@/types/role.types";

export type DashboardVariant = "owner" | "trainer" | "member";

/**
 * Decides which of the three named dashboards (Owner/Trainer/Member — the
 * brief's explicit deliverables) a user sees. Unlike navigation/permission
 * filtering (which is purely PBAC), dashboard *composition* is intentionally
 * role-driven here because the three layouts are a named product
 * requirement, not an incidental permission difference.
 *
 * manager / receptionist / super_admin all get the "owner" (staff) variant;
 * individual widgets within it still respect permission gates (e.g. a
 * receptionist without `trainers:read` simply won't see Trainer Performance).
 * Multi-role users resolve to the most senior applicable variant:
 * staff > trainer > member.
 */
export function getDashboardVariant(roles: Role[]): DashboardVariant {
  if (roles.some(isStaffRole)) return "owner";
  if (roles.includes("trainer")) return "trainer";
  return "member";
}
