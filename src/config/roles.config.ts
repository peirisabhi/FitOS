import { ROLES, type Role } from "@/types/role.types";

export { ROLES };
export type { Role };

/** Roles considered "staff" (gym-side) vs. the member-facing role. */
export const STAFF_ROLES: Role[] = ["super_admin", "owner", "manager", "trainer", "receptionist"];
export const isStaffRole = (role: Role): boolean => STAFF_ROLES.includes(role);
